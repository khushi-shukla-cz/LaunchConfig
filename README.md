# ConfigRuntime Platform

> **A production-grade, config-driven application runtime.** Drop in a JSON config → get a fully working app with UI, APIs, database, auth, and plugins.

---

## 🎯 What Is This?

ConfigRuntime is a **meta-platform** — it doesn't hard-code any UI, API routes, or database schema. Instead, it reads a JSON config file and dynamically generates:

| Layer | What's Generated |
|-------|-----------------|
| **Frontend** | Forms, tables, dashboards, navigation, auth pages |
| **Backend** | REST APIs with full CRUD per resource |
| **Database** | Dynamic record storage (config-driven schema) |
| **Auth** | Email/password + OTP login, role-based access |
| **Features** | CSV Import, Multi-language (i18n), GitHub Export |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Install dependencies
```bash
git clone <repo>
cd configruntime
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET
```

### 3. Set up database
```bash
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run migrations
```

### 4. Choose a sample config
```bash
# CRM (default)
cp config/app.config.json config/app.config.json

# Or use one of the samples:
cp sample-configs/taskflow.config.json config/app.config.json
cp sample-configs/storefront.config.json config/app.config.json
```

### 5. Start development
```bash
npm run dev
# Backend: http://localhost:4000
# Frontend: http://localhost:3000
```

### 6. Create an admin user
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123","name":"Admin"}'
```

Then update the user's role to "admin" in the database or via Prisma Studio:
```bash
npm run db:studio
```

---

## 📁 Project Structure

```
configruntime/
├── config/
│   └── app.config.json          ← Your app config (edit this!)
├── sample-configs/
│   ├── crm.config.json          ← CRM demo
│   ├── taskflow.config.json     ← Project management demo
│   └── storefront.config.json   ← E-commerce demo
├── shared/                      ← Shared types & schemas (Zod)
│   └── src/
│       ├── schemas/config.schema.ts
│       └── utils/config.engine.ts
├── backend/                     ← Express + TypeScript API
│   ├── src/
│   │   ├── index.ts             ← Entry point
│   │   ├── api/generator.ts     ← Auto-generates REST routes
│   │   ├── auth/                ← JWT auth + sessions
│   │   ├── db/crud.engine.ts    ← Generic CRUD
│   │   ├── features/
│   │   │   ├── csv/             ← CSV Import plugin
│   │   │   ├── i18n/            ← i18n plugin
│   │   │   └── github/          ← GitHub Export plugin
│   │   └── plugins/registry.ts  ← Plugin lifecycle manager
│   └── prisma/schema.prisma
└── frontend/                    ← Next.js 14 App Router
    └── src/
        ├── app/                 ← Pages (dynamic catch-all)
        ├── components/
        │   ├── core/            ← DynamicPageRenderer, AppProviders
        │   ├── forms/           ← DynamicForm (all field types)
        │   ├── tables/          ← DynamicTable (sort, filter, paginate)
        │   ├── layout/          ← AppShell (config-driven sidebar)
        │   ├── auth/            ← AuthPage (config-driven providers)
        │   └── features/        ← CSVImport, LanguageSwitcher
        └── lib/
            ├── api/client.ts    ← Type-safe API client
            └── store/index.ts   ← Zustand state (config + auth + i18n)
```

---

## ⚙️ Config Reference

The entire platform is controlled by `config/app.config.json`. See the [schema](shared/src/schemas/config.schema.ts) for full TypeScript types.

### Minimal config
```json
{
  "name": "My App",
  "resources": [
    {
      "name": "posts",
      "fields": [
        { "name": "title", "type": "text", "required": true },
        { "name": "body", "type": "textarea" },
        { "name": "published", "type": "boolean", "defaultValue": false }
      ]
    }
  ]
}
```

That's it. The platform will generate:
- `GET/POST /api/v1/posts` — list + create
- `GET/PUT/DELETE /api/v1/posts/:id` — detail + update + delete
- `/posts` — table page with search + pagination
- `/posts/new` — create form
- `/posts/:id` — detail page
- `/posts/:id/edit` — edit form

### Resource fields

| Field Type | Description |
|-----------|-------------|
| `text` | Single-line text input |
| `textarea` | Multi-line text |
| `email` | Email with validation |
| `password` | Masked input |
| `number` | Numeric input |
| `boolean` | Toggle switch |
| `select` | Dropdown (single) |
| `multiselect` | Multi-select checkboxes |
| `date` | Date picker |
| `datetime` | Date + time picker |
| `json` | JSON editor |
| `relation` | Foreign key to another resource |
| `file` | File upload |
| `uuid` | UUID field |

### Auth providers

```json
"auth": {
  "providers": ["email", "otp"],
  "roles": [
    { "name": "user", "isDefault": true },
    { "name": "admin", "isAdmin": true }
  ]
}
```

Supported providers: `email`, `otp`, `google` (requires env vars), `magic-link`

### i18n

```json
"i18n": {
  "enabled": true,
  "defaultLocale": "en",
  "supportedLocales": ["en", "es", "fr"],
  "translations": {
    "en": { "nav.contacts": "Contacts" },
    "es": { "nav.contacts": "Contactos" }
  }
}
```

### Permissions per resource

```json
"permissions": {
  "create": ["admin"],
  "read": true,
  "update": ["admin", "user"],
  "delete": false
}
```

---

## 🔌 Features

### CSV Import
Navigate to any resource list → click **CSV Import** tab → upload file → map columns → import.
- Supports partial success (row-level error reporting)
- Auto-maps column headers to field names

### Multi-language (i18n)
- Runtime locale switching via the sidebar language picker
- Translations loaded from config or API
- Missing keys fall back to default locale → fallback locale → key itself

### GitHub Export (Admin only)
Navigate to **Admin → Export Project** → Download ZIP.
Generates a complete, runnable Next.js + Express + Prisma project.

### Live Config Editor (Admin only)
Navigate to **Admin → Config** to edit config in-browser with:
- Syntax validation
- Cross-field consistency checks
- Live apply without restart

---

## 🏗️ Architecture

```
Config JSON
    │
    ▼
ConfigParser (validates, migrates, normalizes, infers defaults)
    │
    ▼
DependencyGraph (UI → API → DB → Features)
    │
    ├─► APIGenerator ──► Express Routes (per resource)
    ├─► CRUDEngine ───► DynamicRecord (PostgreSQL)
    ├─► AuthService ──► JWT + Sessions
    └─► PluginRegistry ► [CSV, i18n, GitHub] lifecycle hooks
    
    Frontend:
    ├─► DynamicPageRenderer (table | form | detail | unknown)
    ├─► DynamicForm (all field types, validation)
    ├─► DynamicTable (sort, search, paginate, delete)
    └─► AppShell (config-driven navigation + theme)
```

---

## 🛡️ Robustness

- **Bad config**: Validates with Zod, strips invalid fields, applies defaults, logs warnings — never crashes
- **Unknown components**: Renders a visual fallback with config info
- **Missing resources**: Shows a clear error with instructions
- **API failures**: Caught at every layer with structured error responses
- **Config mutations**: Hot-reload via `/api/v1/config/reload`

---

## 📊 Observability

```bash
# View structured logs
curl http://localhost:4000/api/v1/logs

# Filter by category
curl "http://localhost:4000/api/v1/logs?category=config&level=warn&limit=50"

# Health check
curl http://localhost:4000/health
```

Log categories: `config`, `validation`, `runtime`, `auth`, `api`, `db`, `feature`, `security`

---

## 🔒 Security

- JWT tokens with configurable expiration
- Bcrypt password hashing (12 rounds)
- Role-based access control per resource and per operation
- Input sanitization — unknown fields are dropped
- Rate limiting (configurable per config)
- Helmet.js security headers

---

## 📦 Deployment

### Docker (recommended)

```dockerfile
# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/dist ./dist
COPY backend/prisma ./prisma
COPY config ./config
CMD ["node", "dist/index.js"]
```

### Environment variables for production

```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=<random-64-char-string>
FRONTEND_URL=https://yourdomain.com
CONFIG_PATH=/app/config/app.config.json
```

---

## 🤝 Adding a New Plugin

```typescript
// backend/src/features/myplugin/plugin.ts
import { PluginInterface } from "../plugins/registry";

export class MyPlugin implements PluginInterface {
  name = "my-plugin";

  onRegister(app, config) { /* register routes */ }
  onConfigLoad(config) { /* react to config */ }
  onRuntimeInit(context) { /* access prisma, crud */ }
  onError(error) { /* handle errors */ }
}
```

Then register in `backend/src/plugins/registry.ts`.

---

## 📄 License

MIT — built with ❤️ by ConfigRuntime Platform
