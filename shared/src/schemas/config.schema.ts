import { z } from "zod";

// ─── Primitive helpers ──────────────────────────────────────────────────────

const NonEmptyString = z.string().min(1);

// ─── Field Types ────────────────────────────────────────────────────────────

export const FieldTypeSchema = z.enum([
  "text", "email", "password", "number", "boolean",
  "select", "multiselect", "date", "datetime", "textarea",
  "file", "image", "json", "relation", "uuid",
]);
export type FieldType = z.infer<typeof FieldTypeSchema>;

export const ValidationRuleSchema = z.object({
  type: z.enum(["required", "min", "max", "pattern", "email", "url", "custom"]),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  message: z.string().optional(),
});
export type ValidationRule = z.infer<typeof ValidationRuleSchema>;

export const FieldSchema = z.object({
  name: NonEmptyString,
  label: z.string().optional(),
  type: FieldTypeSchema.default("text"),
  required: z.boolean().default(false),
  unique: z.boolean().default(false),
  defaultValue: z.unknown().optional(),
  options: z.array(z.union([
    z.string(),
    z.object({ value: z.string(), label: z.string() }),
  ])).optional(),
  validation: z.array(ValidationRuleSchema).optional(),
  hidden: z.boolean().default(false),
  readonly: z.boolean().default(false),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  relation: z.object({
    resource: NonEmptyString,
    labelField: z.string().default("name"),
    valueField: z.string().default("id"),
  }).optional(),
  i18nKey: z.string().optional(),
}).passthrough();
export type Field = z.infer<typeof FieldSchema>;

// ─── Resource ───────────────────────────────────────────────────────────────

export const ResourcePermissionSchema = z.object({
  create: z.union([z.boolean(), z.array(z.string())]).default(true),
  read: z.union([z.boolean(), z.array(z.string())]).default(true),
  update: z.union([z.boolean(), z.array(z.string())]).default(true),
  delete: z.union([z.boolean(), z.array(z.string())]).default(false),
});
export type ResourcePermission = z.infer<typeof ResourcePermissionSchema>;

export const ResourceSchema = z.object({
  name: NonEmptyString,
  label: z.string().optional(),
  pluralLabel: z.string().optional(),
  icon: z.string().optional(),
  fields: z.array(FieldSchema).min(1),
  timestamps: z.boolean().default(true),
  softDelete: z.boolean().default(false),
  permissions: ResourcePermissionSchema.optional(),
  searchable: z.array(z.string()).optional(),
  sortable: z.array(z.string()).optional(),
  filterable: z.array(z.string()).optional(),
  displayField: z.string().optional(),
  hooks: z.object({
    beforeCreate: z.string().optional(),
    afterCreate: z.string().optional(),
    beforeUpdate: z.string().optional(),
    afterUpdate: z.string().optional(),
    beforeDelete: z.string().optional(),
    afterDelete: z.string().optional(),
  }).optional(),
}).passthrough();
export type Resource = z.infer<typeof ResourceSchema>;

// ─── UI Config ──────────────────────────────────────────────────────────────

export const UIComponentSchema = z.enum([
  "form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom",
]);

export const UIPageSchema = z.object({
  id: NonEmptyString,
  path: NonEmptyString,
  title: z.string().optional(),
  component: UIComponentSchema.default("table"),
  resource: z.string().optional(),
  layout: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  meta: z.record(z.unknown()).optional(),
  i18nKey: z.string().optional(),
}).passthrough();
export type UIPage = z.infer<typeof UIPageSchema>;

export const UINavItemSchema = z.object({
  label: NonEmptyString,
  path: z.string().optional(),
  icon: z.string().optional(),
  children: z.array(z.lazy((): z.ZodType<any> => UINavItemSchema)).optional(),
  permissions: z.array(z.string()).optional(),
  i18nKey: z.string().optional(),
});
export type UINavItem = z.infer<typeof UINavItemSchema>;

export const UIConfigSchema = z.object({
  theme: z.object({
    primaryColor: z.string().default("#6366f1"),
    fontFamily: z.string().default("system-ui"),
    mode: z.enum(["light", "dark", "auto"]).default("light"),
    borderRadius: z.string().default("0.5rem"),
    customCss: z.string().optional(),
  }).default({}),
  navigation: z.array(UINavItemSchema).default([]),
  pages: z.array(UIPageSchema).default([]),
  layout: z.enum(["sidebar", "topnav", "minimal"]).default("sidebar"),
  logo: z.string().optional(),
  appName: z.string().optional(),
  favicon: z.string().optional(),
}).default({});
export type UIConfig = z.infer<typeof UIConfigSchema>;

// ─── Auth Config ─────────────────────────────────────────────────────────────

export const AuthProviderSchema = z.enum([
  "email", "google", "github", "otp", "magic-link",
]);

export const RoleSchema = z.object({
  name: NonEmptyString,
  label: z.string().optional(),
  permissions: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false),
  isAdmin: z.boolean().default(false),
});
export type Role = z.infer<typeof RoleSchema>;

export const AuthConfigSchema = z.object({
  enabled: z.boolean().default(true),
  providers: z.array(AuthProviderSchema).default(["email"]),
  roles: z.array(RoleSchema).default([
    { name: "user", label: "User", permissions: [], isDefault: true, isAdmin: false },
    { name: "admin", label: "Administrator", permissions: ["*"], isDefault: false, isAdmin: true },
  ]),
  sessionDuration: z.number().default(86400),
  requireEmailVerification: z.boolean().default(false),
  allowRegistration: z.boolean().default(true),
  passwordPolicy: z.object({
    minLength: z.number().default(8),
    requireUppercase: z.boolean().default(false),
    requireNumbers: z.boolean().default(false),
    requireSymbols: z.boolean().default(false),
  }).default({}),
  redirectAfterLogin: z.string().default("/"),
  redirectAfterLogout: z.string().default("/auth/login"),
}).default({});
export type AuthConfig = z.infer<typeof AuthConfigSchema>;

// ─── Feature / Plugin Config ─────────────────────────────────────────────────

export const FeatureConfigSchema = z.object({
  name: NonEmptyString,
  enabled: z.boolean().default(true),
  config: z.record(z.unknown()).default({}),
  version: z.string().optional(),
});
export type FeatureConfig = z.infer<typeof FeatureConfigSchema>;

// ─── i18n Config ─────────────────────────────────────────────────────────────

export const I18nConfigSchema = z.object({
  enabled: z.boolean().default(false),
  defaultLocale: z.string().default("en"),
  supportedLocales: z.array(z.string()).default(["en"]),
  fallbackLocale: z.string().default("en"),
  translations: z.record(z.record(z.string())).default({}),
  dateFormat: z.string().default("MM/DD/YYYY"),
  numberFormat: z.string().default("en-US"),
}).default({});
export type I18nConfig = z.infer<typeof I18nConfigSchema>;

// ─── API Config ──────────────────────────────────────────────────────────────

export const APIConfigSchema = z.object({
  prefix: z.string().default("/api"),
  version: z.string().default("v1"),
  rateLimit: z.object({
    enabled: z.boolean().default(true),
    windowMs: z.number().default(60000),
    max: z.number().default(100),
  }).default({}),
  cors: z.object({
    enabled: z.boolean().default(true),
    origins: z.array(z.string()).default(["*"]),
  }).default({}),
  pagination: z.object({
    defaultLimit: z.number().default(20),
    maxLimit: z.number().default(100),
  }).default({}),
}).default({});
export type APIConfig = z.infer<typeof APIConfigSchema>;

// ─── Database Config ─────────────────────────────────────────────────────────

export const DatabaseConfigSchema = z.object({
  provider: z.enum(["postgresql", "mysql", "sqlite", "mongodb"]).default("postgresql"),
  migrationStrategy: z.enum(["auto", "manual", "none"]).default("auto"),
  seedOnInit: z.boolean().default(false),
}).default({});
export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

// ─── Root App Config ──────────────────────────────────────────────────────────

export const AppConfigSchema = z.object({
  version: z.string().default("1.0.0"),
  configVersion: z.number().default(1),
  name: NonEmptyString.default("ConfigRuntime App"),
  description: z.string().default(""),
  environment: z.enum(["development", "staging", "production"]).default("development"),

  resources: z.array(ResourceSchema).default([]),
  ui: UIConfigSchema,
  auth: AuthConfigSchema,
  api: APIConfigSchema,
  database: DatabaseConfigSchema,
  i18n: I18nConfigSchema,
  features: z.array(FeatureConfigSchema).default([]),
  plugins: z.array(z.object({
    name: NonEmptyString,
    path: z.string().optional(),
    config: z.record(z.unknown()).default({}),
  })).default([]),

  metadata: z.record(z.unknown()).default({}),
}).passthrough();

export type AppConfig = z.infer<typeof AppConfigSchema>;

// ─── Config Validation Result ─────────────────────────────────────────────────

export interface ConfigValidationResult {
  valid: boolean;
  errors: ConfigError[];
  warnings: ConfigWarning[];
  normalized: AppConfig;
}

export interface ConfigError {
  path: string;
  message: string;
  code: string;
  severity: "error" | "warning" | "info";
  value?: unknown;
}

export interface ConfigWarning {
  path: string;
  message: string;
  code: string;
}
