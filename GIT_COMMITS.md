# ConfigRuntime Platform — Git Commit Guide

A structured, semantic commit history organized into logical units.
Copy-paste each block in sequence.

---

## STEP 0 — Initialize repo

```bash
cd configruntime
git init
git branch -M main
```

---

## COMMIT 1 — chore: initialize monorepo workspace

**What:** Root scaffolding — workspace config, environment template, ignore rules, and README.

```bash
git add package.json
git add .env.example
git add .gitignore
git add README.md

git commit -m "chore: initialize monorepo workspace

- Add root package.json with npm workspaces (shared, backend, frontend)
- Add concurrently dev script for running all services together
- Add .env.example with DATABASE_URL, JWT_SECRET, PORT, NEXT_PUBLIC_API_URL
- Add .gitignore covering node_modules, .next, dist, .env, prisma migrations
- Add comprehensive README with architecture overview, quick start, config
  reference, field type table, and deployment guide"
```

---

## COMMIT 2 — feat(shared): add Zod config schema — full app config contract

**What:** The single source of truth for ALL config shapes. Zod schemas for
fields, resources, UI, auth, API, DB, i18n, features, and the root AppConfig.

```bash
git add shared/package.json
git add shared/src/schemas/config.schema.ts

git commit -m "feat(shared): add Zod config schema — full app config contract

- FieldSchema: 14 field types (text, email, password, number, boolean,
  select, multiselect, date, datetime, textarea, file, json, relation, uuid)
- ValidationRuleSchema: required, min, max, pattern, email, url, custom
- ResourceSchema: fields, permissions, timestamps, softDelete, searchable,
  sortable, filterable, hooks, displayField
- ResourcePermissionSchema: per-action RBAC (true | false | role[])
- UIConfigSchema: theme, navigation, pages, layout with full defaults
- UINavItemSchema: recursive children support for nested nav
- UIPageSchema: id, path, component, resource, permissions, i18nKey
- AuthConfigSchema: providers, roles, sessionDuration, passwordPolicy,
  allowRegistration, requireEmailVerification, redirects
- RoleSchema: name, label, permissions, isDefault, isAdmin
- APIConfigSchema: prefix, version, rateLimit, cors, pagination
- DatabaseConfigSchema: provider, migrationStrategy, seedOnInit
- I18nConfigSchema: enabled, locales, fallback, translations, date/number format
- FeatureConfigSchema: name, enabled, config, version
- AppConfigSchema: root schema combining all above with passthrough for plugins
- ConfigValidationResult, ConfigError, ConfigWarning output types
- All schemas have safe defaults — system never crashes on partial config"
```

---

## COMMIT 3 — feat(shared): add config engine — parser, migrator, validator, dependency graph

**What:** The brain of the platform. Parses untrusted config, migrates versions,
validates with Zod, infers defaults, cross-validates, builds dependency graph,
and diffs configs.

```bash
git add shared/src/utils/config.engine.ts

git commit -m "feat(shared): add config engine — parser, migrator, validator, dependency graph

ConfigParser:
- In-memory TTL cache (60s) keyed by cache key
- Graceful Zod parse: strips invalid fields individually, falls back to
  all-defaults rather than crashing on bad config
- Returns ConfigValidationResult with errors[], warnings[], normalized config

migrateConfig():
- Version-based migration map (v1 → v2 → ...)
- Each migration is a pure transform function
- Failures are caught per-step and logged as warnings

crossValidate():
- UI page resource references checked against known resources (warning, not error)
- Relation field targets validated (warning on unknown)
- Duplicate resource names → hard error
- Auth provider env var hints (google → warns about missing CLIENT_ID)
- i18n key presence checked against translation map

inferDefaults():
- Resource label = capitalize(name), pluralLabel = label + 's'
- Field label = capitalize(name.replace(/_/g, ' '))
- UI appName falls back to config.name
- Auto-generates navigation from resources if nav is empty
- Auto-generates CRUD pages (list/new/detail/edit) per resource if pages empty

buildDependencyGraph():
- Nodes: db:{name}, api:{name}, ui:{pageId}, auth, feature:{name}
- Edges: api → db, api → relatedDb, ui → api, feature → auth
- Topological sort (cycle-safe)

diffConfigs():
- Detects added/modified/removed resources
- Returns requiresMigration flag for DB changes"
```

---

## COMMIT 4 — feat(shared): add structured logger with categories and levels

**What:** A singleton logger used across backend and frontend (server-side).
Categorized, colored, bounded ring buffer.

```bash
git add shared/src/utils/logger.ts

git commit -m "feat(shared): add structured logger with categories and levels

- LogCategory union: config | validation | runtime | auth | api | db | feature | security
- LogLevel: debug | info | warn | error with numeric ordering
- Colored console output per level (ANSI codes)
- Ring buffer capped at 1000 entries (oldest evicted)
- getLogs(filter?) — filterable by level, category, limit
- Respects LOG_LEVEL env var (defaults to info)
- Singleton export for use across all backend modules"
```

---

## COMMIT 5 — feat(backend): add Prisma schema — system tables + dynamic record storage

**What:** Database schema. System tables are fixed; user-defined resources use
the generic DynamicRecord EAV table, avoiding schema migrations per config change.

```bash
git add backend/prisma/schema.prisma
git add backend/tsconfig.json
git add backend/package.json

git commit -m "feat(backend): add Prisma schema — system tables + dynamic record storage

System tables (always present):
- users: id, email, passwordHash, name, role, isActive, metadata, timestamps
- sessions: token (unique), userId, expiresAt, ipAddress, userAgent
- oauth_accounts: provider + providerUserId unique, tokens, metadata
- otp_codes: email, code, expiresAt, used flag
- audit_logs: userId, action, resourceName, recordId, diff, ip, userAgent
- app_config_store: key-value JSON store for config persistence

Dynamic resource storage:
- dynamic_records: resourceName + data (Json) + version + softDelete
- Indexed on resourceName and resourceName+createdAt for list queries
- No schema migration required when resources change in config

Feature tables:
- csv_imports: status, totalRows, successRows, errorRows, errors (Json array)

Backend config:
- tsconfig: strict TS, ES2020, baseUrl + @shared/* path alias
- package.json: express, prisma, bcryptjs, jwt, multer, csv-parse, jszip, zod
  + ts-node-dev, tsconfig-paths for dev"
```

---

## COMMIT 6 — feat(backend): add generic CRUD engine with validation and sanitization

**What:** The core data layer. All resource reads/writes go through this engine.
Config-driven validation, type coercion, field sanitization, soft delete, bulk ops.

```bash
git add backend/src/db/crud.engine.ts

git commit -m "feat(backend): add generic CRUD engine with validation and sanitization

coerceValue(value, field):
- Converts raw input to correct TS type per field.type
- Returns null on conversion failure (non-crashing)

sanitizeRecord(data, fields):
- Drops unknown fields (prevents injection of arbitrary data)
- Skips readonly fields from user input
- Applies defaultValue for missing fields

validateRecord(data, fields, mode):
- Required field check (create mode only for required)
- Per-rule validation: min/max (string length + number), pattern (RegExp),
  email regex, URL (new URL()), custom
- Returns errors keyed by field name with human-readable messages

CRUDEngine.list():
- Paginated (max 100 per page)
- JSON path filters via Prisma path[] equals
- Multi-field search via string_contains on JSON paths
- Sort on createdAt/updatedAt (native) or fallback to createdAt
- Soft delete awareness (excludes deletedAt != null)
- Returns PaginatedResult<RecordData> with total, pages

CRUDEngine.get() / create() / update() / delete():
- Consistent CRUDResult<T> shape: { success, data, error, code }
- update() merges with existing data (PATCH semantics)
- delete() uses soft-delete if resource.softDelete, hard delete otherwise

CRUDEngine.bulkCreate():
- Row-by-row with individual result tracking
- Returns { results[], succeeded, failed } for partial success support"
```

---

## COMMIT 7 — feat(backend): add JWT auth middleware — bearer token, role guards, resource permissions

**What:** All Express middleware for authentication and authorization.
Stateless JWT verification, role checking, per-resource permission enforcement,
simple in-process rate limiter.

```bash
git add backend/src/auth/middleware.ts

git commit -m "feat(backend): add JWT auth middleware — bearer token, role guards, resource permissions

signToken(payload, expiresIn):
- Signs HS256 JWT with JWT_SECRET env var
- Payload: { userId, email, role, sessionId }

verifyToken(token):
- Returns JWTPayload or null (never throws)

requireAuth:
- Reads Bearer header or cookie 'token'
- 401 on missing/invalid token
- Attaches payload to req.user

optionalAuth:
- Same extraction but non-blocking (continues without user)

requireRole(...roles):
- Checks req.user.role against allowed list
- 403 with structured error on mismatch
- Logs warn on denied access

requireAdmin:
- Convenience shorthand for requireRole('admin')

requireResourcePermission(resource, action):
- Reads resource.permissions[action]
- false → always 403
- string[] → checks req.user.role membership
- true/undefined → passes through

simpleRateLimit(windowMs, max):
- In-process Map-based sliding window per IP
- 429 with RATE_LIMITED code on excess
- Auto-resets after windowMs"
```

---

## COMMIT 8 — feat(backend): add auth service — email/password, OTP, sessions, profile

**What:** Business logic for all auth operations. Bcrypt hashing, OTP codes
with expiry, session creation, profile management.

```bash
git add backend/src/auth/service.ts

git commit -m "feat(backend): add auth service — email/password, OTP, sessions, profile

register(email, password, name):
- Guards: allowRegistration flag, email provider enabled
- Password policy enforcement (minLength, uppercase, numbers, symbols)
- Bcrypt hash at cost factor 12
- Assigns default role from config.auth.roles[].isDefault
- Returns { success, user } without password hash

login(email, password):
- Bcrypt compare (constant-time)
- isActive guard (account disabled check)
- Creates session record, returns JWT

sendOTP(email):
- 6-digit random code, 10-minute expiry
- Stored in otp_codes table (not in JWT / memory)
- Dev mode: logs code to console instead of sending email
- Production: ready for email service integration

verifyOTP(email, code):
- Finds unused, unexpired record
- Marks as used atomically
- Upserts user (creates if first login via OTP)
- Returns JWT same as login

createSession(userId):
- Generates crypto.randomBytes(32) token
- Expiry = now + config.auth.sessionDuration seconds

logout(sessionId):
- Deletes session record (invalidates token server-side)

getMe(userId) / updateProfile(userId, data):
- Safe field projection (no passwordHash in response)"
```

---

## COMMIT 9 — feat(backend): add auth router — all auth HTTP endpoints

**What:** Express router wiring all auth service methods to HTTP endpoints.
Includes a public /auth/config endpoint for frontend provider detection.

```bash
git add backend/src/auth/router.ts

git commit -m "feat(backend): add auth router — all auth HTTP endpoints

POST /auth/register    — email + password + optional name
POST /auth/login       — returns { token, user }
POST /auth/otp/send    — sends OTP to email
POST /auth/otp/verify  — verifies code, returns { token, user }
POST /auth/logout      — invalidates session (requireAuth)
GET  /auth/me          — current user profile (requireAuth)
PATCH /auth/me         — update name/avatarUrl (requireAuth)
GET  /auth/config      — public: exposes providers, allowRegistration,
                         passwordPolicy for frontend form rendering

Error codes:
- EMAIL_EXISTS → 409
- INVALID_CREDENTIALS → 401
- REGISTRATION_DISABLED → 400
- WEAK_PASSWORD → 400
- INVALID_OTP → 401"
```

---

## COMMIT 10 — feat(backend): add API generator — config-driven REST routes per resource

**What:** Automatically generates full CRUD REST API for every resource in config.
No hardcoding. Mounts routes at /api/v1/{resourceName} with auth + permission guards.

```bash
git add backend/src/api/generator.ts

git commit -m "feat(backend): add API generator — config-driven REST routes per resource

APIGenerator.generateResourceRouter(resource, config):
- GET    /           list with pagination, sort, search, f_* filter params
- GET    /:id        single record
- POST   /           create with 422 on validation error
- PUT    /:id        full replace update
- PATCH  /:id        partial update (same engine)
- DELETE /:id        hard or soft delete per resource.softDelete

All routes protected by:
- requireAuth (JWT validation)
- requireResourcePermission (per-action RBAC from resource.permissions)

Query params for list:
- page, limit (capped at config.api.pagination.maxLimit)
- sortBy, sortOrder (asc|desc)
- search (searches resource.searchable fields)
- f_{fieldName}={value} for exact-match JSON path filters

APIGenerator.mountAll(app, config):
- Iterates all config.resources
- Wraps each router mount in try/catch — one failing resource does not
  prevent others from mounting (graceful degradation)
- Logs mounted path per resource"
```

---

## COMMIT 11 — feat(backend): add CSV import plugin — upload, map, validate, bulk insert

**What:** First feature plugin. Full CSV pipeline with multer upload,
column mapping UI data, row-level error collection, async processing with status polling.

```bash
git add backend/src/features/csv/plugin.ts

git commit -m "feat(backend): add CSV import plugin — upload, map, validate, bulk insert

Plugin lifecycle:
- onRegister → logs registration
- onConfigLoad → stores config reference
- onRuntimeInit → receives { prisma, crud } context
- onError → logs to feature category

POST /:resourceName/upload:
- Multer memory storage, 10MB limit, CSV mimetype guard
- Parses CSV with csv-parse (BOM-stripped, trimmed, string-cast)
- Creates csv_imports record with status=pending
- Returns: importId, headers[], preview (5 rows), totalRows,
  resourceFields (for mapping UI)

POST /:resourceName/import/:importId:
- Accepts { mappings: [{ csvHeader, fieldName }][] }
- Sets status=processing, responds immediately (non-blocking)
- Kicks off async processRows()

processRows():
- Per-row: apply column mappings → crud.create() → collect result
- Partial success: succeeding rows committed, failing rows collected
- Row errors include: row number, error messages[], raw mapped data
- Final status: 'done' (≥1 success) or 'failed' (all failed)
- Updates csv_imports with successRows, errorRows, errors[], completedAt

GET /:resourceName/import/:importId/status — poll for progress
GET /:resourceName/imports — last 20 imports for resource

Security: field names sanitized through crud.sanitizeRecord (no injection)"
```

---

## COMMIT 12 — feat(backend): add i18n plugin — runtime translations, fallback chain, locale API

**What:** Config-driven internationalization. Dot-notation key support,
three-tier fallback (requested → default → fallback → key), locale listing,
batch translate endpoint.

```bash
git add backend/src/features/i18n/plugin.ts

git commit -m "feat(backend): add i18n plugin — runtime translations, fallback chain, locale API

translate(key, locale, params?):
- Tries locale → defaultLocale → fallbackLocale → returns key itself
- Dot-notation: 'nav.contacts' traverses { nav: { contacts: '...' } }
- Logs warn on missing key (non-breaking)
- {{param}} interpolation via regex replace

GET /i18n/locales:
- Lists supportedLocales with human-readable labels
- Returns default and fallback locale

GET /i18n/:locale:
- Returns full translation map for locale merged with fallback
- 404 if locale not in supportedLocales

POST /i18n/translate:
- Batch translate { keys: string[], locale: string }
- Returns { [key]: translatedValue } map
- Useful for frontend pre-fetching on locale switch

Locale labels: 12 built-in (en, es, fr, de, it, pt, ja, zh, ar, ru, ko, nl)
Plugin is no-op when i18n.enabled=false (safe to register always)"
```

---

## COMMIT 13 — feat(backend): add GitHub export plugin — full project ZIP generator

**What:** Third feature plugin. Generates a complete, runnable Next.js + Express +
Prisma project as a downloadable ZIP based on the current (or overridden) config.

```bash
git add backend/src/features/github/plugin.ts

git commit -m "feat(backend): add GitHub export plugin — full project ZIP generator

POST /export/github/download (admin only):
- Accepts optional { config } override in body
- Generates JSZip with full project structure
- Streams ZIP as application/zip download

GET /export/github/preview (admin only):
- Returns file path list without generating ZIP

Generated project structure:
  README.md, .gitignore, .env.example
  config/app.config.json
  backend/
    package.json (all deps pinned)
    tsconfig.json
    prisma/schema.prisma (generated from config.resources)
    src/index.ts (bootstrap with config loading)
    src/resources/{name}.ts (per-resource router module)
  frontend/
    package.json, next.config.js, tsconfig.json
    src/app/layout.tsx, page.tsx
    src/app/{resource}/page.tsx (list)
    src/app/{resource}/[id]/page.tsx (detail)
    src/app/auth/login/page.tsx (config-aware)

All generated files are production-ready TypeScript with no placeholders.
Prisma schema derived from config.resources field types.
Per-resource modules embed the resource config as const for self-contained operation."
```

---

## COMMIT 14 — feat(backend): add plugin registry — lifecycle orchestration for all plugins

**What:** Central plugin manager. Handles registration, deduplication, and
firing all lifecycle hooks with per-plugin error isolation.

```bash
git add backend/src/plugins/registry.ts

git commit -m "feat(backend): add plugin registry — lifecycle orchestration for all plugins

PluginRegistry.register(plugin):
- Deduplication guard (warn + skip on re-register)
- Stores in Map<name, PluginInterface>

registerBuiltins(config):
- Conditionally registers csv-import, i18n, github-export
- Based on config.features[] names or all-enabled if features empty
- i18n registered when config.i18n.enabled OR feature name present

fireOnRegister / fireOnConfigLoad / fireOnRuntimeInit:
- Iterates all plugins in registration order
- Each hook wrapped in try/catch: one plugin failure does not stop others
- Errors forwarded to plugin.onError() callback
- All errors logged to 'feature' category

mountPluginRoutes(app, config):
- Mounts CSV at /api/v1/csv
- Mounts i18n at /api/v1/i18n
- Mounts GitHub export at /api/v1/export/github
- Each mount wrapped in try/catch (graceful degradation)

Singleton export for use in index.ts"
```

---

## COMMIT 15 — feat(backend): add Express server entrypoint — full bootstrap with graceful shutdown

**What:** Main entry point. Wires config loading, all middleware, auth, API
generator, plugins, observability endpoints, and graceful SIGTERM shutdown.

```bash
git add backend/src/index.ts

git commit -m "feat(backend): add Express server entrypoint — full bootstrap with graceful shutdown

loadConfig():
- Reads CONFIG_PATH env var (default: ../../config/app.config.json)
- Catches JSON parse errors → logs + falls back to defaults (no crash)
- Logs resource count, feature count, config version on load

bootstrap():
Security middleware stack:
- helmet() (CSP disabled, handled by Next.js)
- cors() with FRONTEND_URL whitelist (comma-separated)
- express.json() 10MB limit
- cookieParser()
- simpleRateLimit per config.api.rateLimit settings

Plugin initialization order:
1. pluginRegistry.registerBuiltins(config)
2. pluginRegistry.fireOnRegister(apiRouter, config)
3. pluginRegistry.fireOnRuntimeInit({ prisma, crud, config })
4. pluginRegistry.fireOnConfigLoad(config)
5. apiGenerator.mountAll(apiRouter, config)
6. createAuthRouter mounted at /api/v1/auth
7. pluginRegistry.mountPluginRoutes(apiRouter, config)

Admin endpoints:
- GET  /api/v1/config         — full normalized config (sanitized)
- POST /api/v1/config/reload  — hot-reload config from disk
- GET  /api/v1/logs           — structured log query (level, category, limit)

GET /health:
- DB ping via prisma.$queryRaw\`SELECT 1\`
- Returns { status, db, config: { version, resources, features }, uptime }

SIGTERM handler: prisma.$disconnect() then process.exit(0)"
```

---

## COMMIT 16 — feat(frontend): add type-safe API client — all resource, auth, feature endpoints

**What:** Frontend API client. Single fetch wrapper with auth token management,
auto-redirect on 401, and typed methods for every backend endpoint.

```bash
git add frontend/src/lib/api/client.ts

git commit -m "feat(frontend): add type-safe API client — all resource, auth, feature endpoints

ApiClient:
- Bearer token from localStorage (cr_token key)
- setToken()/getToken() with localStorage sync
- Auto-redirect to /auth/login on 401 response
- Network errors return { success: false, error, code: NETWORK_ERROR }

Resource CRUD:
- listRecords(name, params): builds URLSearchParams from params object
- getRecord(name, id), createRecord(name, data)
- updateRecord(name, id, data), deleteRecord(name, id)

Auth:
- login() — stores token on success
- register(), logout() — clears token
- getMe(), getAuthConfig() — public config for form rendering

Config:
- getAppConfig() — typed AppConfig response

i18n:
- getTranslations(locale) — full translation map with fallback merged
- getSupportedLocales() — locale list with labels

CSV Import:
- uploadCSV(resourceName, file) — multipart/form-data via native fetch
- executeImport(resourceName, importId, mappings)
- getImportStatus(resourceName, importId) — for polling

GitHub Export:
- downloadProjectZip(config?) — POST, triggers browser download via
  URL.createObjectURL + anchor click

Singleton export for use across all components"
```

---

## COMMIT 17 — feat(frontend): add Zustand store — config, auth, i18n, per-resource state

**What:** All client state in one file. Global config+auth+i18n store,
plus a factory that creates isolated per-resource stores with full CRUD actions.

```bash
git add frontend/src/lib/store/index.ts

git commit -m "feat(frontend): add Zustand store — config, auth, i18n, per-resource state

useConfigStore (global):
Config slice:
- loadConfig() → apiClient.getAppConfig() → sets config
- updateConfig(config) → live config mutation (used by admin editor)
- configLoading, configError states

Auth slice:
- login(email, password) → returns { success, error }
- register(email, password, name) → returns { success, error }
- logout() → clears token + user
- loadUser() → GET /auth/me → populates user or clears on 401
- Reads initial token from localStorage (cr_token)

i18n slice:
- locale persisted to localStorage (cr_locale)
- setLocale(code) → fetches translations from API → updates store
- t(key, params?) → dot-notation lookup with {{param}} interpolation
  Falls back to key string if translation missing

useResourceStore(resourceName) factory:
- One store instance per resource, cached in Map<name, store>
- State: records[], total, page, pages, loading, error, selected,
  filters{}, search, sortBy, sortOrder
- fetch(params?) → listRecords with current state params
- fetchOne(id) → getRecord, sets selected
- create(data) / update(id, data) → returns { success, data?, error?, errors? }
  Re-fetches list on success
- remove(id) → deleteRecord, re-fetches on success
- setPage, setSearch, setFilter, clearFilters, setSort → each triggers fetch()"
```

---

## COMMIT 18 — feat(frontend): add DynamicForm — renders all 12 field types from config

**What:** The universal form renderer. Reads resource.fields[] and renders
the appropriate input for each type. Client-side + server-side error display.

```bash
git add frontend/src/components/forms/DynamicForm.tsx

git commit -m "feat(frontend): add DynamicForm — renders all 12 field types from config

FieldInput component (per field.type):
- text/email/uuid → <input type=text|email>
- password → <input type=password>
- number → <input type=number> with valueAsNumber
- textarea → <textarea rows=4>
- boolean → custom toggle switch with transition
- select → <select> with options from field.options (string | {value,label})
- multiselect → checkbox list, scrollable, max-h-40
- date → <input type=date>
- datetime → <input type=datetime-local>
- json → <textarea> with JSON.parse on change, font-mono
- unknown types → falls back to text input (graceful degradation)

Features:
- i18nKey support: label resolved via t(field.i18nKey) when present
- required indicator (*) in label
- helpText below input
- Error state: red border + error message below field
- readonly + hidden field exclusion
- disabled state during submission

DynamicForm:
- Two-column responsive grid (md:grid-cols-2)
- textarea/json fields span full width (md:col-span-2)
- Client validation on submit: required check per field
- Server error merging: serverErrors prop overlays on field errors
- Clears field error on any change to that field
- mode prop: 'create' | 'edit' changes submit button label"
```

---

## COMMIT 19 — feat(frontend): add DynamicTable — sort, search, paginate, skeleton, delete confirm

**What:** The universal list renderer. Config-driven columns, full interactivity,
skeleton loading states, two-step delete confirmation.

```bash
git add frontend/src/components/tables/DynamicTable.tsx

git commit -m "feat(frontend): add DynamicTable — sort, search, paginate, skeleton, delete confirm

CellValue renderer (per field.type):
- boolean → colored pill (green Yes / gray No)
- date → toLocaleDateString()
- datetime → toLocaleString()
- select → indigo pill badge
- email → mailto: anchor
- json → JSON.stringify truncated at 50 chars, font-mono
- default → string, truncated at 50 chars with title tooltip

Toolbar:
- Search input with magnifier icon, queries resource.searchable fields
- Record count display
- 'New {resource.label}' button (calls onNew prop)

Table:
- Columns: visible fields (hidden=false), max 6
- Sortable columns: click header → toggles asc/desc on same col, asc on new col
  (only if field.name in resource.sortable)
- Sort indicator arrow in header
- Skeleton rows (5 rows × n cols) during loading state
- Empty state: inbox icon + 'No {resource.name} found'
- Row click → navigate to /{resource}/[id]

Action column:
- Edit button → /{resource}/[id]/edit (shown if permissions.update !== false)
- Delete button → two-step confirm (Confirm / Cancel inline)
  (shown if permissions.delete !== false)
- customActions prop for extensible per-row actions

Pagination:
- Prev/Next buttons + page number buttons (max 5 shown, centered on current)
- Hidden when pages ≤ 1"
```

---

## COMMIT 20 — feat(frontend): add DynamicPageRenderer — routes component types, extensible registry

**What:** The orchestration layer. Maps page.component values to React components.
Falls back to a visual error card for unknown types. Extensible component registry.

```bash
git add frontend/src/components/core/DynamicPageRenderer.tsx

git commit -m "feat(frontend): add DynamicPageRenderer — routes component types, extensible registry

COMPONENT_REGISTRY (mutable Map):
- 'table' → TablePage
- 'form' → FormPage
- 'detail' → DetailPage
- Unknown key → UnknownComponent (graceful fallback)

registerComponent(type, component):
- Public API for adding custom component types at runtime
- No modification of core system required (Open/Closed principle)

TablePage:
- Looks up resource by page.resource name
- Missing resource → amber warning card (not a crash)
- Delegates to DynamicTable with onNew → router.push

FormPage:
- Detects create vs edit via params.id
- Fetches existing record on edit (via store.fetchOne)
- Skeleton loading during fetch
- Handles server validation errors (sets serverErrors → DynamicForm)
- On success → router.push to resource list

DetailPage:
- Fetches record on mount
- Two-column dl/dt/dd layout per visible field
- Handles json type with <pre> block
- Edit and Back navigation buttons

UnknownComponent:
- Shows component type name in amber warning box
- Renders full page config as JSON for debugging
- Does not crash surrounding layout"
```

---

## COMMIT 21 — feat(frontend): add AppShell — config-driven sidebar, mobile nav, theme

**What:** The application chrome. Sidebar navigation driven entirely from
config.ui.navigation with recursive children support, locale switcher, user menu.

```bash
git add frontend/src/components/layout/AppShell.tsx

git commit -m "feat(frontend): add AppShell — config-driven sidebar, mobile nav, theme

NavItem (recursive):
- Renders leaf as <Link> with active state detection
- Renders parent with children as collapsible accordion (open/close toggle)
- Active: pathname === path or pathname.startsWith(path + '/')
- i18nKey support: resolves via t() when present
- ICON_MAP: database, home, users, settings, chart → SVG icons
  Unknown icons fall back to database icon

Sidebar sections:
- Logo: custom logo URL or initial letter avatar
- Navigation: maps config.ui.navigation[] → NavItem components
- Admin section: conditionally rendered for role === 'admin'
  Links: Export Project, Config editor, Logs
- Footer: LanguageSwitcher (when i18n.enabled), User card with logout

User card:
- Avatar: initial letter in indigo circle
- Name (or email), role badge
- Logout button → calls store.logout() + router.push('/auth/login')

Mobile:
- Sidebar hidden on mobile (hidden md:flex)
- Hamburger menu button in topbar
- Slide-in overlay with dark backdrop
- Auto-closes on route change (useEffect on pathname)

Topbar:
- Dynamic page title resolved from config.ui.pages matching current pathname
  (supports [param] segments via regex)
- Falls back to config.ui.appName"
```

---

## COMMIT 22 — feat(frontend): add AuthPage — config-driven providers, OTP flow, registration

**What:** Login/register UI. Reads config.auth to determine which providers
to show, password policy hints, and registration toggle.

```bash
git add frontend/src/components/auth/AuthPage.tsx

git commit -m "feat(frontend): add AuthPage — config-driven providers, OTP flow, registration

Modes: login | register | otp (state machine)

Provider tabs (shown when providers.length > 1):
- 'Password' tab for email provider
- 'OTP / Magic' tab for otp provider

Email/Password form:
- register mode: adds name field
- Password policy hint (min length from config)
- 403 errors displayed inline

OTP flow (2-step):
- Step 1: email input → POST /auth/otp/send
- Step 2: 6-digit code input → POST /auth/otp/verify
- 'Use different email' resets to step 1
- Imports apiClient dynamically (code-split)

Registration toggle:
- Hidden when config.auth.allowRegistration === false
- Switch between login ↔ register preserves email field

Post-login:
- Redirects to config.auth.redirectAfterLogin (default: '/')
- useEffect guard redirects already-logged-in users

UI:
- Centered card layout, max-w-md, gradient background
- App initial letter avatar
- All error states shown with red/green alert boxes"
```

---

## COMMIT 23 — feat(frontend): add AppProviders — initializes config, auth, i18n on boot

**What:** The top-level provider component. Runs async initialization before
rendering children. Shows a loading spinner while platform boots.

```bash
git add frontend/src/components/core/AppProviders.tsx

git commit -m "feat(frontend): add AppProviders — initializes config, auth, i18n on boot

Initialization sequence (async, parallel where possible):
1. loadConfig() — fetches AppConfig from backend
2. loadUser() — GET /auth/me if cr_token exists in localStorage
3. setLocale(locale) — loads translations if i18n.enabled

initialized flag:
- false → full-screen loading spinner (centered, indigo spinner)
- true → renders children normally

i18n locale load triggered reactively when config.i18n.enabled changes
(handles cases where config loads after initial mount)

No prop drilling — all state lives in Zustand stores"
```

---

## COMMIT 24 — feat(frontend): add LanguageSwitcher and CSVImport feature components

**What:** Two self-contained feature UI components plugged into the AppShell
and resource list pages respectively.

```bash
git add frontend/src/components/features/LanguageSwitcher.tsx
git add frontend/src/components/features/CSVImport.tsx

git commit -m "feat(frontend): add LanguageSwitcher and CSVImport feature components

LanguageSwitcher:
- Hidden when supportedLocales.length <= 1 (zero-config safe)
- Flag emoji + ISO code labels (12 locales built-in)
- Click-outside-safe dropdown (uses state toggle)
- Active locale highlighted in indigo
- On select: calls store.setLocale() → fetches translations → updates all t() calls

CSVImport (4-step state machine):
step='upload':
- Drag-and-drop zone with visual dragging state
- Click-to-browse fallback via hidden file input ref
- CSV-only mimetype/extension guard
- POST /csv/:resource/upload → gets importId, headers[], preview, resourceFields
- Shows expected fields with required (*) highlighted

step='map':
- Preview table (first 3 data rows)
- Auto-mapping: normalizes header and field names (lowercase, strip _- space)
  and matches on exact normalized equality
- Per-header <select> → field name or '— Skip —'
- Required field coverage check: import button disabled until all required
  fields are mapped
- Shows which required fields are still unmapped

step='importing':
- Spinner + 'This may take a moment' text
- Polls GET /csv/:resource/import/:id/status every 1.5s

step='done':
- Success/partial/failure badge with counts
- Row error list (max 20 shown, overflow count)
- 'Import Another' resets state
- 'View Records' calls onComplete prop"
```

---

## COMMIT 25 — feat(frontend): add Next.js app pages — home, auth, dynamic catch-all, admin

**What:** All page routes. A single catch-all segment handles every resource
dynamically. Admin pages for config editing and project export.

```bash
git add frontend/src/app/layout.tsx
git add frontend/src/app/globals.css
git add frontend/src/app/page.tsx
git add frontend/src/app/auth/login/page.tsx
git add frontend/src/app/[...segments]/page.tsx
git add frontend/src/app/admin/config/page.tsx
git add frontend/src/app/admin/export/page.tsx

git commit -m "feat(frontend): add Next.js app pages — home, auth, dynamic catch-all, admin

layout.tsx:
- RootLayout wraps children in <AppProviders>
- lang attr set to 'en', suppressHydrationWarning

globals.css:
- Tailwind base/components/utilities imports
- Custom scrollbar-thin utility class
- System font stack on body

page.tsx (home /):
- Auth guard → /auth/login if no user
- Redirects to first resource list if no explicit home page in config
- Welcome card with user name
- Resource cards grid (max 4) linking to resource lists
- Quick action buttons (New per resource, Export for admin)
- Dev mode amber banner with config stats

auth/login/page.tsx:
- Thin wrapper rendering <AuthPage />

[...segments]/page.tsx (catch-all router):
Route interpretation from segments[]:
- [resource]              → list (table + CSV import tabs)
- [resource, 'new']       → create form
- [resource, id]          → detail view
- [resource, id, 'edit']  → edit form
- Unknown resource        → amber 'Resource not found' card with config hint

- Per-page title in header
- Back button for non-list views
- CSV Import tab toggle on list view

admin/config/page.tsx:
- Full-height JSON textarea (font-mono, 600px)
- Validate button → ConfigParser.parse() client-side
- Error/Warning panels with path + message + code
- Apply → updateConfig() in store + POST /config/reload on backend
- 'Load current config' button pre-populates textarea
- Config structure reference sidebar

admin/export/page.tsx:
- Feature grid (6 items: frontend, backend, DB, auth, resources, config)
- Optional config override textarea
- 'Load current config' pre-fill
- Preview Files → GET /export/github/preview → shows file tree
- Download ZIP → POST /export/github/download → browser download
- Progress spinner during generation"
```

---

## COMMIT 26 — feat(frontend): add Next.js config, Tailwind, tsconfig with path aliases

**What:** Frontend build configuration with @/* and @shared/* path aliases.

```bash
git add frontend/package.json
git add frontend/next.config.js
git add frontend/tsconfig.json
git add frontend/tailwind.config.js

git commit -m "feat(frontend): add Next.js config, Tailwind, tsconfig with path aliases

package.json:
- next 14, react 18, zustand 4, zod 3
- tailwindcss 3 + autoprefixer + postcss as devDeps
- Scripts: dev (port 3000), build, start, lint, typecheck

next.config.js:
- reactStrictMode: true
- serverActions enabled with allowedOrigins: ['*']
- NEXT_PUBLIC_API_URL env var injection (default: http://localhost:4000)
- Remote image patterns: https /** (permissive for dev)

tsconfig.json:
- moduleResolution: bundler (Next 14 recommended)
- strict: true
- paths: @/* → ./src/*, @shared/* → ../shared/src/*
- Plugins: ['next'] for IDE support

tailwind.config.js:
- Content: src/app/**, src/components/**
- Extended indigo color palette (50–900)
- Custom border radius: xl, 2xl, 3xl
- fadeIn animation (translateY -4px → 0, 150ms)"
```

---

## COMMIT 27 — feat(config): add 3 sample app configs — CRM, TaskFlow, StoreFront

**What:** Demo-ready configurations proving the platform works for
3 completely different application domains with zero code changes.

```bash
git add config/app.config.json
git add sample-configs/taskflow.config.json
git add sample-configs/storefront.config.json

git commit -m "feat(config): add 3 sample app configs — CRM, TaskFlow, StoreFront

config/app.config.json (Acme CRM — default):
- Resources: contacts (9 fields, softDelete, permissions), deals (7 fields,
  relation to contacts), activities (6 fields, relation to contacts)
- Auth: email + OTP, registration open, 2 roles (Sales Rep / Sales Manager)
- i18n: EN/ES/FR with translated nav labels
- Features: csv-import, i18n, github-export

sample-configs/taskflow.config.json (TaskFlow):
- Resources: projects (9 fields, multiselect tags), tasks (8 fields, relation
  to projects, multiselect tags), team_members (7 fields)
- Auth: email only, open registration
- i18n: disabled
- Proves different auth config + no i18n works correctly

sample-configs/storefront.config.json (StoreFront Inventory):
- Resources: products (13 fields including json metadata, imageUrl with URL
  validation), orders (11 fields, permissions.delete=false), categories (6 fields)
- Auth: email + OTP, registration DISABLED, strict password policy
  (minLength:10, requireUppercase, requireNumbers)
- i18n: EN/ES
- Proves admin-only access, no-registration mode, strict validation"
```

---

## COMMIT 28 — chore: add shared package.json

```bash
git add shared/package.json

git commit -m "chore: add shared package.json for zod dependency and typecheck script

Workspace package configuring shared/src/index.ts as main entry.
Declares zod as runtime dep for schema validation used by both
backend (runtime validation) and frontend (client-side config parsing)."
```

---

## Final: push to remote

```bash
git remote add origin https://github.com/YOUR_USERNAME/configruntime-platform.git
git push -u origin main
```

---

## Summary

| # | Commit | Files |
|---|--------|-------|
| 1 | chore: initialize monorepo | package.json, .env.example, .gitignore, README.md |
| 2 | feat(shared): Zod config schema | shared/src/schemas/config.schema.ts |
| 3 | feat(shared): config engine | shared/src/utils/config.engine.ts |
| 4 | feat(shared): structured logger | shared/src/utils/logger.ts |
| 5 | feat(backend): Prisma schema + backend config | prisma/schema.prisma, tsconfig, package.json |
| 6 | feat(backend): CRUD engine | backend/src/db/crud.engine.ts |
| 7 | feat(backend): auth middleware | backend/src/auth/middleware.ts |
| 8 | feat(backend): auth service | backend/src/auth/service.ts |
| 9 | feat(backend): auth router | backend/src/auth/router.ts |
| 10 | feat(backend): API generator | backend/src/api/generator.ts |
| 11 | feat(backend): CSV import plugin | backend/src/features/csv/plugin.ts |
| 12 | feat(backend): i18n plugin | backend/src/features/i18n/plugin.ts |
| 13 | feat(backend): GitHub export plugin | backend/src/features/github/plugin.ts |
| 14 | feat(backend): plugin registry | backend/src/plugins/registry.ts |
| 15 | feat(backend): server entrypoint | backend/src/index.ts |
| 16 | feat(frontend): API client | frontend/src/lib/api/client.ts |
| 17 | feat(frontend): Zustand store | frontend/src/lib/store/index.ts |
| 18 | feat(frontend): DynamicForm | frontend/src/components/forms/DynamicForm.tsx |
| 19 | feat(frontend): DynamicTable | frontend/src/components/tables/DynamicTable.tsx |
| 20 | feat(frontend): DynamicPageRenderer | frontend/src/components/core/DynamicPageRenderer.tsx |
| 21 | feat(frontend): AppShell | frontend/src/components/layout/AppShell.tsx |
| 22 | feat(frontend): AuthPage | frontend/src/components/auth/AuthPage.tsx |
| 23 | feat(frontend): AppProviders | frontend/src/components/core/AppProviders.tsx |
| 24 | feat(frontend): LanguageSwitcher + CSVImport | 2 feature components |
| 25 | feat(frontend): all app pages | 7 page files |
| 26 | feat(frontend): build config | package.json, next.config.js, tsconfig.json, tailwind.config.js |
| 27 | feat(config): 3 sample configs | app.config.json, taskflow, storefront |
| 28 | chore: shared package.json | shared/package.json |

**Total: 28 commits · 45 files · ~4,200 lines of production TypeScript**
