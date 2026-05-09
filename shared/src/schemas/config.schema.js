"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigSchema = exports.DatabaseConfigSchema = exports.APIConfigSchema = exports.I18nConfigSchema = exports.FeatureConfigSchema = exports.AuthConfigSchema = exports.RoleSchema = exports.AuthProviderSchema = exports.UIConfigSchema = exports.UINavItemSchema = exports.UIPageSchema = exports.UIComponentSchema = exports.ResourceSchema = exports.ResourcePermissionSchema = exports.FieldSchema = exports.ValidationRuleSchema = exports.FieldTypeSchema = void 0;
const zod_1 = require("zod");
// ─── Primitive helpers ──────────────────────────────────────────────────────
const NonEmptyString = zod_1.z.string().min(1);
// ─── Field Types ────────────────────────────────────────────────────────────
exports.FieldTypeSchema = zod_1.z.enum([
    "text", "email", "password", "number", "boolean",
    "select", "multiselect", "date", "datetime", "textarea",
    "file", "image", "json", "relation", "uuid",
]);
exports.ValidationRuleSchema = zod_1.z.object({
    type: zod_1.z.enum(["required", "min", "max", "pattern", "email", "url", "custom"]),
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean()]).optional(),
    message: zod_1.z.string().optional(),
});
exports.FieldSchema = zod_1.z.object({
    name: NonEmptyString,
    label: zod_1.z.string().optional(),
    type: exports.FieldTypeSchema.default("text"),
    required: zod_1.z.boolean().default(false),
    unique: zod_1.z.boolean().default(false),
    defaultValue: zod_1.z.unknown().optional(),
    options: zod_1.z.array(zod_1.z.union([
        zod_1.z.string(),
        zod_1.z.object({ value: zod_1.z.string(), label: zod_1.z.string() }),
    ])).optional(),
    validation: zod_1.z.array(exports.ValidationRuleSchema).optional(),
    hidden: zod_1.z.boolean().default(false),
    readonly: zod_1.z.boolean().default(false),
    placeholder: zod_1.z.string().optional(),
    helpText: zod_1.z.string().optional(),
    relation: zod_1.z.object({
        resource: NonEmptyString,
        labelField: zod_1.z.string().default("name"),
        valueField: zod_1.z.string().default("id"),
    }).optional(),
    i18nKey: zod_1.z.string().optional(),
}).passthrough();
// ─── Resource ───────────────────────────────────────────────────────────────
exports.ResourcePermissionSchema = zod_1.z.object({
    create: zod_1.z.union([zod_1.z.boolean(), zod_1.z.array(zod_1.z.string())]).default(true),
    read: zod_1.z.union([zod_1.z.boolean(), zod_1.z.array(zod_1.z.string())]).default(true),
    update: zod_1.z.union([zod_1.z.boolean(), zod_1.z.array(zod_1.z.string())]).default(true),
    delete: zod_1.z.union([zod_1.z.boolean(), zod_1.z.array(zod_1.z.string())]).default(false),
});
exports.ResourceSchema = zod_1.z.object({
    name: NonEmptyString,
    label: zod_1.z.string().optional(),
    pluralLabel: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    fields: zod_1.z.array(exports.FieldSchema).min(1),
    timestamps: zod_1.z.boolean().default(true),
    softDelete: zod_1.z.boolean().default(false),
    permissions: exports.ResourcePermissionSchema.optional(),
    searchable: zod_1.z.array(zod_1.z.string()).optional(),
    sortable: zod_1.z.array(zod_1.z.string()).optional(),
    filterable: zod_1.z.array(zod_1.z.string()).optional(),
    displayField: zod_1.z.string().optional(),
    hooks: zod_1.z.object({
        beforeCreate: zod_1.z.string().optional(),
        afterCreate: zod_1.z.string().optional(),
        beforeUpdate: zod_1.z.string().optional(),
        afterUpdate: zod_1.z.string().optional(),
        beforeDelete: zod_1.z.string().optional(),
        afterDelete: zod_1.z.string().optional(),
    }).optional(),
}).passthrough();
// ─── UI Config ──────────────────────────────────────────────────────────────
exports.UIComponentSchema = zod_1.z.enum([
    "form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom",
]);
exports.UIPageSchema = zod_1.z.object({
    id: NonEmptyString,
    path: NonEmptyString,
    title: zod_1.z.string().optional(),
    component: exports.UIComponentSchema.default("table"),
    resource: zod_1.z.string().optional(),
    layout: zod_1.z.string().optional(),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
    meta: zod_1.z.record(zod_1.z.unknown()).optional(),
    i18nKey: zod_1.z.string().optional(),
}).passthrough();
exports.UINavItemSchema = zod_1.z.object({
    label: NonEmptyString,
    path: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    children: zod_1.z.array(zod_1.z.lazy(() => exports.UINavItemSchema)).optional(),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
    i18nKey: zod_1.z.string().optional(),
});
exports.UIConfigSchema = zod_1.z.object({
    theme: zod_1.z.object({
        primaryColor: zod_1.z.string().default("#6366f1"),
        fontFamily: zod_1.z.string().default("system-ui"),
        mode: zod_1.z.enum(["light", "dark", "auto"]).default("light"),
        borderRadius: zod_1.z.string().default("0.5rem"),
        customCss: zod_1.z.string().optional(),
    }).default({}),
    navigation: zod_1.z.array(exports.UINavItemSchema).default([]),
    pages: zod_1.z.array(exports.UIPageSchema).default([]),
    layout: zod_1.z.enum(["sidebar", "topnav", "minimal"]).default("sidebar"),
    logo: zod_1.z.string().optional(),
    appName: zod_1.z.string().optional(),
    favicon: zod_1.z.string().optional(),
}).default({});
// ─── Auth Config ─────────────────────────────────────────────────────────────
exports.AuthProviderSchema = zod_1.z.enum([
    "email", "google", "github", "otp", "magic-link",
]);
exports.RoleSchema = zod_1.z.object({
    name: NonEmptyString,
    label: zod_1.z.string().optional(),
    permissions: zod_1.z.array(zod_1.z.string()).default([]),
    isDefault: zod_1.z.boolean().default(false),
    isAdmin: zod_1.z.boolean().default(false),
});
exports.AuthConfigSchema = zod_1.z.object({
    enabled: zod_1.z.boolean().default(true),
    providers: zod_1.z.array(exports.AuthProviderSchema).default(["email"]),
    roles: zod_1.z.array(exports.RoleSchema).default([
        { name: "user", label: "User", permissions: [], isDefault: true, isAdmin: false },
        { name: "admin", label: "Administrator", permissions: ["*"], isDefault: false, isAdmin: true },
    ]),
    sessionDuration: zod_1.z.number().default(86400),
    requireEmailVerification: zod_1.z.boolean().default(false),
    allowRegistration: zod_1.z.boolean().default(true),
    passwordPolicy: zod_1.z.object({
        minLength: zod_1.z.number().default(8),
        requireUppercase: zod_1.z.boolean().default(false),
        requireNumbers: zod_1.z.boolean().default(false),
        requireSymbols: zod_1.z.boolean().default(false),
    }).default({}),
    redirectAfterLogin: zod_1.z.string().default("/"),
    redirectAfterLogout: zod_1.z.string().default("/auth/login"),
}).default({});
// ─── Feature / Plugin Config ─────────────────────────────────────────────────
exports.FeatureConfigSchema = zod_1.z.object({
    name: NonEmptyString,
    enabled: zod_1.z.boolean().default(true),
    config: zod_1.z.record(zod_1.z.unknown()).default({}),
    version: zod_1.z.string().optional(),
});
// ─── i18n Config ─────────────────────────────────────────────────────────────
exports.I18nConfigSchema = zod_1.z.object({
    enabled: zod_1.z.boolean().default(false),
    defaultLocale: zod_1.z.string().default("en"),
    supportedLocales: zod_1.z.array(zod_1.z.string()).default(["en"]),
    fallbackLocale: zod_1.z.string().default("en"),
    translations: zod_1.z.record(zod_1.z.record(zod_1.z.string())).default({}),
    dateFormat: zod_1.z.string().default("MM/DD/YYYY"),
    numberFormat: zod_1.z.string().default("en-US"),
}).default({});
// ─── API Config ──────────────────────────────────────────────────────────────
exports.APIConfigSchema = zod_1.z.object({
    prefix: zod_1.z.string().default("/api"),
    version: zod_1.z.string().default("v1"),
    rateLimit: zod_1.z.object({
        enabled: zod_1.z.boolean().default(true),
        windowMs: zod_1.z.number().default(60000),
        max: zod_1.z.number().default(100),
    }).default({}),
    cors: zod_1.z.object({
        enabled: zod_1.z.boolean().default(true),
        origins: zod_1.z.array(zod_1.z.string()).default(["*"]),
    }).default({}),
    pagination: zod_1.z.object({
        defaultLimit: zod_1.z.number().default(20),
        maxLimit: zod_1.z.number().default(100),
    }).default({}),
}).default({});
// ─── Database Config ─────────────────────────────────────────────────────────
exports.DatabaseConfigSchema = zod_1.z.object({
    provider: zod_1.z.enum(["postgresql", "mysql", "sqlite", "mongodb"]).default("postgresql"),
    migrationStrategy: zod_1.z.enum(["auto", "manual", "none"]).default("auto"),
    seedOnInit: zod_1.z.boolean().default(false),
}).default({});
// ─── Root App Config ──────────────────────────────────────────────────────────
exports.AppConfigSchema = zod_1.z.object({
    version: zod_1.z.string().default("1.0.0"),
    configVersion: zod_1.z.number().default(1),
    name: NonEmptyString.default("ConfigRuntime App"),
    description: zod_1.z.string().default(""),
    environment: zod_1.z.enum(["development", "staging", "production"]).default("development"),
    resources: zod_1.z.array(exports.ResourceSchema).default([]),
    ui: exports.UIConfigSchema,
    auth: exports.AuthConfigSchema,
    api: exports.APIConfigSchema,
    database: exports.DatabaseConfigSchema,
    i18n: exports.I18nConfigSchema,
    features: zod_1.z.array(exports.FeatureConfigSchema).default([]),
    plugins: zod_1.z.array(zod_1.z.object({
        name: NonEmptyString,
        path: zod_1.z.string().optional(),
        config: zod_1.z.record(zod_1.z.unknown()).default({}),
    })).default([]),
    metadata: zod_1.z.record(zod_1.z.unknown()).default({}),
}).passthrough();
//# sourceMappingURL=config.schema.js.map