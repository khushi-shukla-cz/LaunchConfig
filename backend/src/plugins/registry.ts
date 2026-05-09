import { Router } from "express";
import { AppConfig } from "../../../shared/src/schemas/config.schema";
import { logger } from "../../../shared/src/utils/logger";
import { csvImportPlugin, CSVImportPlugin } from "../features/csv/plugin";
import { i18nPlugin, I18nPlugin } from "../features/i18n/plugin";
import { githubExportPlugin, GithubExportPlugin } from "../features/github/plugin";

export interface PluginInterface {
  name: string;
  onRegister(app: Router, config: AppConfig): void;
  onConfigLoad?(config: AppConfig): void;
  onRuntimeInit?(context: any): void;
  onError?(error: Error): void;
  createRouter?(): Router;
}

export class PluginRegistry {
  private plugins = new Map<string, PluginInterface>();
  private config!: AppConfig;

  // Register built-in plugins
  registerBuiltins(config: AppConfig) {
    const featureNames = config.features.map((f) => f.name);

    // CSV Import
    if (!config.features.length || featureNames.includes("csv-import")) {
      this.register(csvImportPlugin);
    }

    // i18n
    if (config.i18n.enabled || featureNames.includes("i18n")) {
      this.register(i18nPlugin);
    }

    // GitHub Export
    if (!config.features.length || featureNames.includes("github-export")) {
      this.register(githubExportPlugin);
    }
  }

  register(plugin: PluginInterface): void {
    if (this.plugins.has(plugin.name)) {
      logger.warn("feature", `Plugin "${plugin.name}" already registered, skipping`);
      return;
    }
    this.plugins.set(plugin.name, plugin);
    logger.info("feature", `Plugin "${plugin.name}" registered`);
  }

  getPlugin<T extends PluginInterface>(name: string): T | undefined {
    return this.plugins.get(name) as T;
  }

  fireOnRegister(app: Router, config: AppConfig): void {
    this.config = config;
    for (const [name, plugin] of this.plugins) {
      try {
        plugin.onRegister(app, config);
      } catch (e: any) {
        logger.error("feature", `Plugin ${name} onRegister failed`, e.message);
        plugin.onError?.(e);
      }
    }
  }

  fireOnConfigLoad(config: AppConfig): void {
    this.config = config;
    for (const [name, plugin] of this.plugins) {
      try {
        plugin.onConfigLoad?.(config);
      } catch (e: any) {
        logger.error("feature", `Plugin ${name} onConfigLoad failed`, e.message);
        plugin.onError?.(e);
      }
    }
  }

  fireOnRuntimeInit(context: any): void {
    for (const [name, plugin] of this.plugins) {
      try {
        plugin.onRuntimeInit?.(context);
      } catch (e: any) {
        logger.error("feature", `Plugin ${name} onRuntimeInit failed`, e.message);
        plugin.onError?.(e);
      }
    }
  }

  mountPluginRoutes(app: Router, config: AppConfig): void {
    const prefix = `${config.api.prefix}/${config.api.version}`;

    // CSV Import routes
    const csv = this.getPlugin<CSVImportPlugin>("csv-import");
    if (csv?.createRouter) {
      try {
        app.use(`${prefix}/csv`, csv.createRouter());
        logger.info("feature", `Mounted: ${prefix}/csv`);
      } catch (e: any) {
        logger.error("feature", "Failed to mount CSV routes", e.message);
      }
    }

    // i18n routes
    const i18n = this.getPlugin<I18nPlugin>("i18n");
    if (i18n?.createRouter) {
      try {
        app.use(`${prefix}/i18n`, i18n.createRouter());
        logger.info("feature", `Mounted: ${prefix}/i18n`);
      } catch (e: any) {
        logger.error("feature", "Failed to mount i18n routes", e.message);
      }
    }

    // GitHub export routes
    const github = this.getPlugin<GithubExportPlugin>("github-export");
    if (github?.createRouter) {
      try {
        app.use(`${prefix}/export/github`, github.createRouter());
        logger.info("feature", `Mounted: ${prefix}/export/github`);
      } catch (e: any) {
        logger.error("feature", "Failed to mount GitHub export routes", e.message);
      }
    }
  }
}

export const pluginRegistry = new PluginRegistry();
