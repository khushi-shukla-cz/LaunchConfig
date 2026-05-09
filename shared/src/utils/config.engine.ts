import { ZodError } from "zod";
import {
  AppConfigSchema,
  AppConfig,
  ConfigValidationResult,
  ConfigError,
  ConfigWarning,
} from "../schemas/config.schema";

// ─── Config Versioning ────────────────────────────────────────────────────────

const CONFIG_MIGRATIONS: Record<number, (config: any) => any> = {
  1: (c: any) => c, // base version
  2: (c: any) => {
    // Example migration: rename old field
    if (c.settings && !c.api) {
      c.api = c.settings;
      delete c.settings;
    }
    return c;
  },
};

export function migrateConfig(raw: any): any {
  const currentVersion = typeof raw?.configVersion === "number" ? raw.configVersion : 1;
  const targetVersion = Math.max(...Object.keys(CONFIG_MIGRATIONS).map(Number));

  let config = { ...raw };
  for (let v = currentVersion; v < targetVersion; v++) {
    const migration = CONFIG_MIGRATIONS[v + 1];
    if (migration) {
      try {
        config = migration(config);
        config.configVersion = v + 1;
      } catch (e: any) {
        console.warn(`[ConfigEngine] Migration v${v}→v${v + 1} failed: ${e.message}`);
      }
    }
  }
  return config;
}

// ─── Config Parser ────────────────────────────────────────────────────────────

export class ConfigParser {
  private cache = new Map<string, { config: AppConfig; ts: number }>();
  private readonly CACHE_TTL = 60_000;

  parse(raw: unknown, cacheKey?: string): ConfigValidationResult {
    if (cacheKey) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.ts < this.CACHE_TTL) {
        return { valid: true, errors: [], warnings: [], normalized: cached.config };
      }
    }

    const errors: ConfigError[] = [];
    const warnings: ConfigWarning[] = [];

    // Step 1: Ensure it's an object
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
      errors.push({
        path: "root",
        message: "Config must be a JSON object",
        code: "INVALID_ROOT",
        severity: "error",
        value: raw,
      });
      return {
        valid: false,
        errors,
        warnings,
        normalized: AppConfigSchema.parse({}),
      };
    }

    // Step 2: Migrate
    let migrated: any;
    try {
      migrated = migrateConfig(raw);
    } catch (e: any) {
      warnings.push({ path: "root", message: `Migration failed: ${e.message}`, code: "MIGRATION_FAILED" });
      migrated = raw;
    }

    // Step 3: Validate with Zod (non-breaking)
    let normalized: AppConfig;
    try {
      normalized = AppConfigSchema.parse(migrated);
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        for (const issue of e.errors) {
          errors.push({
            path: issue.path.join(".") || "root",
            message: issue.message,
            code: issue.code,
            severity: "error",
            value: undefined,
          });
        }
      }
      // Graceful degradation: parse with defaults for missing fields
      try {
        normalized = AppConfigSchema.parse(stripInvalidFields(migrated, e as ZodError));
        warnings.push({
          path: "root",
          message: "Some fields were removed due to validation errors; defaults applied",
          code: "PARTIAL_CONFIG",
        });
      } catch {
        normalized = AppConfigSchema.parse({});
        warnings.push({
          path: "root",
          message: "Config severely malformed; using all defaults",
          code: "FALLBACK_DEFAULTS",
        });
      }
    }

    // Step 4: Cross-field consistency checks
    const crossErrors = crossValidate(normalized);
    errors.push(...crossErrors.errors);
    warnings.push(...crossErrors.warnings);

    // Step 5: Infer missing labels/defaults
    normalized = inferDefaults(normalized);

    const isValid = errors.filter((e) => e.severity === "error").length === 0;

    if (cacheKey && isValid) {
      this.cache.set(cacheKey, { config: normalized, ts: Date.now() });
    }

    return { valid: isValid, errors, warnings, normalized };
  }

  invalidateCache(key?: string) {
    if (key) this.cache.delete(key);
    else this.cache.clear();
  }
}

// ─── Strip Invalid Fields ─────────────────────────────────────────────────────

function stripInvalidFields(raw: any, zodError: ZodError): any {
  const cleaned = JSON.parse(JSON.stringify(raw));
  for (const issue of zodError.errors) {
    const path = issue.path;
    if (path.length === 0) continue;
    try {
      let obj = cleaned;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
        if (!obj || typeof obj !== "object") break;
      }
      const last = path[path.length - 1];
      if (obj && last in obj) delete obj[last];
    } catch {}
  }
  return cleaned;
}

// ─── Cross Validation ─────────────────────────────────────────────────────────

function crossValidate(config: AppConfig): { errors: ConfigError[]; warnings: ConfigWarning[] } {
  const errors: ConfigError[] = [];
  const warnings: ConfigWarning[] = [];

  // Check page resources reference valid resources
  const resourceNames = new Set(config.resources.map((r) => r.name));
  for (const page of config.ui.pages) {
    if (page.resource && !resourceNames.has(page.resource)) {
      warnings.push({
        path: `ui.pages[${page.id}].resource`,
        message: `Page references unknown resource "${page.resource}" – page will render empty`,
        code: "UNKNOWN_RESOURCE_REF",
      });
    }
  }

  // Check relation fields reference valid resources
  for (const resource of config.resources) {
    for (const field of resource.fields) {
      if (field.relation && !resourceNames.has(field.relation.resource)) {
        warnings.push({
          path: `resources[${resource.name}].fields[${field.name}].relation`,
          message: `Field "${field.name}" references unknown resource "${field.relation.resource}"`,
          code: "UNKNOWN_RELATION_REF",
        });
      }
    }
  }

  // Auth: if google provider enabled, remind about env vars (warning only)
  if (config.auth.providers.includes("google")) {
    warnings.push({
      path: "auth.providers",
      message: "Google auth requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars",
      code: "MISSING_ENV_HINT",
    });
  }

  // Duplicate resource names
  const seen = new Set<string>();
  for (const r of config.resources) {
    if (seen.has(r.name)) {
      errors.push({
        path: `resources[${r.name}]`,
        message: `Duplicate resource name "${r.name}"`,
        code: "DUPLICATE_RESOURCE",
        severity: "error",
      });
    }
    seen.add(r.name);
  }

  // i18n: check referenced keys have translations
  if (config.i18n.enabled) {
    const defaultLocale = config.i18n.defaultLocale;
    const translations = config.i18n.translations[defaultLocale] || {};
    for (const page of config.ui.pages) {
      if (page.i18nKey && !translations[page.i18nKey]) {
        warnings.push({
          path: `ui.pages[${page.id}].i18nKey`,
          message: `Missing translation key "${page.i18nKey}" for locale "${defaultLocale}"`,
          code: "MISSING_I18N_KEY",
        });
      }
    }
  }

  return { errors, warnings };
}

// ─── Infer Defaults ───────────────────────────────────────────────────────────

function inferDefaults(config: AppConfig): AppConfig {
  const c = { ...config };

  // Resource labels
  c.resources = c.resources.map((r) => ({
    ...r,
    label: r.label || capitalize(r.name),
    pluralLabel: r.pluralLabel || capitalize(r.name) + "s",
    displayField: r.displayField || r.fields.find((f) => f.type === "text")?.name || "id",
  }));

  // Field labels
  c.resources = c.resources.map((r) => ({
    ...r,
    fields: r.fields.map((f) => ({
      ...f,
      label: f.label || capitalize(f.name.replace(/_/g, " ")),
    })),
  }));

  // UI app name fallback
  if (!c.ui.appName) {
    c.ui = { ...c.ui, appName: c.name };
  }

  // Auto-generate nav from resources if nav is empty
  if (c.ui.navigation.length === 0 && c.resources.length > 0) {
    c.ui = {
      ...c.ui,
      navigation: c.resources.map((r) => ({
        label: r.pluralLabel || r.label || r.name,
        path: `/${r.name}`,
        icon: r.icon || "database",
      })),
    };
  }

  // Auto-generate pages from resources if pages are empty
  if (c.ui.pages.length === 0 && c.resources.length > 0) {
    const pages: any[] = [];
    for (const r of c.resources) {
      pages.push({
        id: `${r.name}-list`,
        path: `/${r.name}`,
        title: r.pluralLabel || r.label,
        component: "table",
        resource: r.name,
      });
      pages.push({
        id: `${r.name}-new`,
        path: `/${r.name}/new`,
        title: `New ${r.label}`,
        component: "form",
        resource: r.name,
      });
      pages.push({
        id: `${r.name}-detail`,
        path: `/${r.name}/[id]`,
        title: r.label,
        component: "detail",
        resource: r.name,
      });
      pages.push({
        id: `${r.name}-edit`,
        path: `/${r.name}/[id]/edit`,
        title: `Edit ${r.label}`,
        component: "form",
        resource: r.name,
      });
    }
    c.ui = { ...c.ui, pages };
  }

  return c;
}

// ─── Dependency Graph ─────────────────────────────────────────────────────────

export interface DependencyGraph {
  nodes: Map<string, DependencyNode>;
  edges: Array<[string, string]>;
  order: string[];
}

interface DependencyNode {
  id: string;
  type: "ui" | "api" | "db" | "feature" | "auth";
  dependencies: string[];
  config: unknown;
}

export function buildDependencyGraph(config: AppConfig): DependencyGraph {
  const nodes = new Map<string, DependencyNode>();
  const edges: Array<[string, string]> = [];

  // DB nodes per resource
  for (const r of config.resources) {
    const id = `db:${r.name}`;
    nodes.set(id, { id, type: "db", dependencies: [], config: r });
  }

  // API nodes depend on DB
  for (const r of config.resources) {
    const id = `api:${r.name}`;
    const dbId = `db:${r.name}`;
    nodes.set(id, { id, type: "api", dependencies: [dbId], config: r });
    edges.push([id, dbId]);

    // relation dependencies
    for (const f of r.fields) {
      if (f.relation) {
        const relDbId = `db:${f.relation.resource}`;
        if (nodes.has(relDbId)) {
          edges.push([id, relDbId]);
          nodes.get(id)!.dependencies.push(relDbId);
        }
      }
    }
  }

  // UI nodes depend on API
  for (const page of config.ui.pages) {
    const id = `ui:${page.id}`;
    const deps: string[] = [];
    if (page.resource) {
      const apiId = `api:${page.resource}`;
      if (nodes.has(apiId)) {
        deps.push(apiId);
        edges.push([id, apiId]);
      }
    }
    nodes.set(id, { id, type: "ui", dependencies: deps, config: page });
  }

  // Auth node
  nodes.set("auth", { id: "auth", type: "auth", dependencies: [], config: config.auth });

  // Feature nodes
  for (const f of config.features) {
    const id = `feature:${f.name}`;
    nodes.set(id, { id, type: "feature", dependencies: ["auth"], config: f });
    edges.push([id, "auth"]);
  }

  // Topological sort
  const order = topologicalSort(nodes, edges);

  return { nodes, edges, order };
}

function topologicalSort(
  nodes: Map<string, DependencyNode>,
  edges: Array<[string, string]>
): string[] {
  const visited = new Set<string>();
  const temp = new Set<string>();
  const result: string[] = [];

  const visit = (id: string) => {
    if (temp.has(id)) return; // cycle – skip
    if (visited.has(id)) return;
    temp.add(id);
    const node = nodes.get(id);
    if (node) {
      for (const dep of node.dependencies) {
        visit(dep);
      }
    }
    temp.delete(id);
    visited.add(id);
    result.push(id);
  };

  for (const id of nodes.keys()) visit(id);
  return result;
}

// ─── Config Diff ──────────────────────────────────────────────────────────────

export function diffConfigs(prev: AppConfig, next: AppConfig): ConfigDiff {
  const changes: ConfigChange[] = [];

  // Resources
  const prevResources = new Map(prev.resources.map((r) => [r.name, r]));
  const nextResources = new Map(next.resources.map((r) => [r.name, r]));

  for (const [name, r] of nextResources) {
    if (!prevResources.has(name)) {
      changes.push({ type: "added", path: `resources.${name}`, value: r });
    } else if (JSON.stringify(prevResources.get(name)) !== JSON.stringify(r)) {
      changes.push({ type: "modified", path: `resources.${name}`, value: r, prevValue: prevResources.get(name) });
    }
  }
  for (const name of prevResources.keys()) {
    if (!nextResources.has(name)) {
      changes.push({ type: "removed", path: `resources.${name}` });
    }
  }

  // UI
  if (JSON.stringify(prev.ui) !== JSON.stringify(next.ui)) {
    changes.push({ type: "modified", path: "ui", value: next.ui, prevValue: prev.ui });
  }

  return { changes, requiresMigration: changes.some((c) => c.path.startsWith("resources")) };
}

export interface ConfigChange {
  type: "added" | "modified" | "removed";
  path: string;
  value?: unknown;
  prevValue?: unknown;
}

export interface ConfigDiff {
  changes: ConfigChange[];
  requiresMigration: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
