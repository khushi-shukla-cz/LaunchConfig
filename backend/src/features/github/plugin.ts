import { Router, Request, Response } from "express";
import JSZip from "jszip";
import { AppConfig, Resource, Field } from "../../../../shared/src/schemas/config.schema";
import { requireAuth, requireRole } from "../../auth/middleware";
import { logger } from "../../../../shared/src/utils/logger";

export class GithubExportPlugin {
  name = "github-export";
  private config!: AppConfig;

  onRegister(_app: any, config: AppConfig): void {
    this.config = config;
    logger.info("feature", "GitHub Export plugin registered");
  }

  onConfigLoad(config: AppConfig): void {
    this.config = config;
  }

  onRuntimeInit(_context: any): void {}

  onError(error: Error): void {
    logger.error("feature", "GitHub Export plugin error", error.message);
  }

  createRouter(): Router {
    const router = Router();

    // POST /api/v1/export/github/download — generate ZIP
    router.post("/download", requireAuth, requireRole("admin"), async (req: Request, res: Response) => {
      try {
        const config: AppConfig = req.body.config || this.config;
        const zip = await this.generateProjectZip(config);
        const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

        const projectName = config.name.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="${projectName}.zip"`);
        res.send(buffer);

        logger.info("feature", `Project exported by user ${req.user?.userId}`);
      } catch (e: any) {
        logger.error("feature", "GitHub export failed", e.message);
        res.status(500).json({ success: false, error: "Export failed: " + e.message });
      }
    });

    // GET /api/v1/export/github/preview — preview file structure
    router.get("/preview", requireAuth, requireRole("admin"), (_req: Request, res: Response) => {
      const structure = this.getProjectStructure(this.config);
      res.json({ success: true, structure });
    });

    return router;
  }

  private getProjectStructure(config: AppConfig): string[] {
    const files: string[] = [];
    files.push("README.md", "package.json", ".env.example", ".gitignore", "tsconfig.json");
    files.push("frontend/package.json", "frontend/next.config.js", "frontend/tsconfig.json");
    files.push("frontend/src/app/layout.tsx", "frontend/src/app/page.tsx");
    files.push("backend/package.json", "backend/tsconfig.json", "backend/src/index.ts");
    files.push("backend/prisma/schema.prisma");
    files.push("config/app.config.json");
    for (const r of config.resources) {
      files.push(`backend/src/resources/${r.name}.ts`);
    }
    return files;
  }

  private async generateProjectZip(config: AppConfig): Promise<JSZip> {
    const zip = new JSZip();
    const projectName = config.name.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

    // ── Root files ────────────────────────────────────────────────────────────
    zip.file("README.md", this.generateReadme(config));
    zip.file(".gitignore", this.generateGitignore());
    zip.file(".env.example", this.generateEnvExample(config));

    // ── Config ────────────────────────────────────────────────────────────────
    const configFolder = zip.folder("config")!;
    configFolder.file("app.config.json", JSON.stringify(config, null, 2));

    // ── Backend ───────────────────────────────────────────────────────────────
    const backend = zip.folder("backend")!;
    backend.file("package.json", this.generateBackendPackageJson(projectName));
    backend.file("tsconfig.json", this.generateTsConfig());

    const backendSrc = backend.folder("src")!;
    backendSrc.file("index.ts", this.generateBackendIndex(config));

    const prismaFolder = backend.folder("prisma")!;
    prismaFolder.file("schema.prisma", this.generatePrismaSchema(config));

    // Per-resource files
    const resourcesFolder = backendSrc.folder("resources")!;
    for (const resource of config.resources) {
      resourcesFolder.file(`${resource.name}.ts`, this.generateResourceModule(resource, config));
    }

    // ── Frontend ──────────────────────────────────────────────────────────────
    const frontend = zip.folder("frontend")!;
    frontend.file("package.json", this.generateFrontendPackageJson(projectName));
    frontend.file("next.config.js", this.generateNextConfig());
    frontend.file("tsconfig.json", this.generateTsConfig());

    const frontendSrc = frontend.folder("src")!;
    const appFolder = frontendSrc.folder("app")!;

    appFolder.file("layout.tsx", this.generateLayout(config));
    appFolder.file("page.tsx", this.generateHomePage(config));

    // Per-resource pages
    for (const resource of config.resources) {
      const resourcePage = appFolder.folder(resource.name)!;
      resourcePage.file("page.tsx", this.generateListPage(resource, config));
      resourcePage.file("[id]/page.tsx", this.generateDetailPage(resource, config));
    }

    // Auth pages
    const authFolder = appFolder.folder("auth")!;
    authFolder.file("login/page.tsx", this.generateLoginPage(config));

    return zip;
  }

  // ─── File generators ───────────────────────────────────────────────────────

  private generateReadme(config: AppConfig): string {
    return `# ${config.name}

${config.description || "Generated by ConfigRuntime Platform"}

## Setup

\`\`\`bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Setup database
cd backend && npx prisma migrate dev

# Start development
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
\`\`\`

## Resources

${config.resources.map((r) => `- **${r.pluralLabel || r.name}** (\`/${r.name}\`)`).join("\n")}

## Auth

Providers: ${config.auth.providers.join(", ")}

## Generated by ConfigRuntime

Config version: ${config.configVersion}
`;
  }

  private generateGitignore(): string {
    return `node_modules/
.env
.env.local
dist/
.next/
*.log
.DS_Store
prisma/migrations/
`;
  }

  private generateEnvExample(config: AppConfig): string {
    let env = `# Database
DATABASE_URL="postgresql://user:password@localhost:5432/${config.name.replace(/\s/g, "_").toLowerCase()}"

# Auth
JWT_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Backend
PORT=4000
NODE_ENV=development
`;
    if (config.auth.providers.includes("google")) {
      env += `\n# Google OAuth\nGOOGLE_CLIENT_ID=""\nGOOGLE_CLIENT_SECRET=""\n`;
    }
    return env;
  }

  private generateBackendPackageJson(name: string): string {
    return JSON.stringify({
      name: `${name}-backend`,
      version: "1.0.0",
      scripts: {
        dev: "ts-node-dev --respawn src/index.ts",
        build: "tsc",
        start: "node dist/index.js",
        "db:migrate": "prisma migrate dev",
        "db:generate": "prisma generate",
      },
      dependencies: {
        "@prisma/client": "^5.0.0",
        bcryptjs: "^2.4.3",
        cors: "^2.8.5",
        express: "^4.18.2",
        jsonwebtoken: "^9.0.2",
        multer: "^1.4.5-lts.1",
        "csv-parse": "^5.5.0",
        jszip: "^3.10.1",
        zod: "^3.22.0",
        helmet: "^7.0.0",
        "express-rate-limit": "^7.1.0",
      },
      devDependencies: {
        "@types/express": "^4.17.21",
        "@types/bcryptjs": "^2.4.6",
        "@types/jsonwebtoken": "^9.0.5",
        "@types/multer": "^1.4.11",
        "@types/cors": "^2.8.17",
        "@types/node": "^20.0.0",
        prisma: "^5.0.0",
        typescript: "^5.0.0",
        "ts-node-dev": "^2.0.0",
      },
    }, null, 2);
  }

  private generateFrontendPackageJson(name: string): string {
    return JSON.stringify({
      name: `${name}-frontend`,
      version: "1.0.0",
      scripts: { dev: "next dev", build: "next build", start: "next start" },
      dependencies: {
        next: "^14.0.0",
        react: "^18.0.0",
        "react-dom": "^18.0.0",
        "next-auth": "^4.24.0",
        axios: "^1.6.0",
        zod: "^3.22.0",
        "react-hook-form": "^7.49.0",
        "@hookform/resolvers": "^3.3.2",
      },
      devDependencies: {
        "@types/react": "^18.0.0",
        "@types/node": "^20.0.0",
        typescript: "^5.0.0",
        tailwindcss: "^3.4.0",
        autoprefixer: "^10.4.16",
        postcss: "^8.4.32",
      },
    }, null, 2);
  }

  private generateTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        module: "commonjs",
        lib: ["ES2020"],
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        declaration: true,
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist"],
    }, null, 2);
  }

  private generateNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: true },
  env: { NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000' },
};
module.exports = nextConfig;
`;
  }

  private generateBackendIndex(config: AppConfig): string {
    return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { ConfigParser } from './config/parser';
import { CRUDEngine } from './db/crud.engine';
import { APIGenerator } from './api/generator';
import { AuthService } from './auth/service';
import { createAuthRouter } from './auth/router';
import appConfig from '../../config/app.config.json';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

async function bootstrap() {
  const parser = new ConfigParser();
  const result = parser.parse(appConfig);
  
  if (result.errors.length) {
    console.warn('[Config] Warnings:', result.warnings);
  }

  const config = result.normalized;
  const crud = new CRUDEngine(prisma);
  const apiGen = new APIGenerator(crud);
  const authService = new AuthService(prisma, config.auth);

  const apiRouter = express.Router();
  apiGen.mountAll(apiRouter, config);
  apiRouter.use('/auth', createAuthRouter(authService, config));

  app.use('/', apiRouter);

  app.get('/health', (_req, res) => res.json({ status: 'ok', version: config.version }));

  await prisma.$connect();
  app.listen(port, () => console.log(\`Server running on port \${port}\`));
}

bootstrap().catch(console.error);
`;
  }

  private generatePrismaSchema(config: AppConfig): string {
    return `// Auto-generated Prisma schema for ${config.name}
generator client { provider = "prisma-client-js" }
datasource db { provider = "${config.database.provider}"; url = env("DATABASE_URL") }

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String?
  name         String?
  role         String    @default("user")
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  @@map("users")
}

model DynamicRecord {
  id           String    @id @default(uuid())
  resourceName String
  data         Json      @default("{}")
  createdBy    String?
  deletedAt    DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  @@index([resourceName])
  @@map("dynamic_records")
}
`;
  }

  private generateResourceModule(resource: Resource, config: AppConfig): string {
    return `// Auto-generated resource module: ${resource.name}
// Config-driven CRUD — do not edit field definitions here; edit app.config.json instead

import { Router } from 'express';
import { CRUDEngine } from '../db/crud.engine';
import { requireAuth } from '../auth/middleware';

export function create${capitalize(resource.name)}Router(crud: CRUDEngine): Router {
  const router = Router();
  const resource = ${JSON.stringify(resource, null, 2)};

  router.get('/', requireAuth, async (req, res) => {
    const result = await crud.list(resource, { page: Number(req.query.page) || 1 });
    res.json(result);
  });

  router.get('/:id', requireAuth, async (req, res) => {
    const result = await crud.get(resource, req.params.id);
    res.status(result.success ? 200 : 404).json(result);
  });

  router.post('/', requireAuth, async (req, res) => {
    const result = await crud.create(resource, req.body);
    res.status(result.success ? 201 : 422).json(result);
  });

  router.put('/:id', requireAuth, async (req, res) => {
    const result = await crud.update(resource, req.params.id, req.body);
    res.json(result);
  });

  router.delete('/:id', requireAuth, async (req, res) => {
    const result = await crud.delete(resource, req.params.id);
    res.json(result);
  });

  return router;
}
`;
  }

  private generateLayout(config: AppConfig): string {
    return `import type { Metadata } from 'next';
export const metadata: Metadata = { title: '${config.name}', description: '${config.description}' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="${config.i18n.defaultLocale}">
      <body>{children}</body>
    </html>
  );
}
`;
  }

  private generateHomePage(config: AppConfig): string {
    return `export default function HomePage() {
  return (
    <main>
      <h1>${config.name}</h1>
      <p>${config.description || "Welcome"}</p>
      <nav>
        ${config.resources.map((r) => `<a href="/${r.name}">${r.pluralLabel || r.name}</a>`).join("\n        ")}
      </nav>
    </main>
  );
}
`;
  }

  private generateListPage(resource: Resource, _config: AppConfig): string {
    return `'use client';
import { useEffect, useState } from 'react';

export default function ${capitalize(resource.name)}ListPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/api/v1/${resource.name}\`, {
      headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
    })
      .then(r => r.json())
      .then(d => { setRecords(d.data); setLoading(false); });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>${resource.pluralLabel || resource.name}</h1>
      <a href="/${resource.name}/new">+ New</a>
      <table>
        <thead>
          <tr>
            ${resource.fields.filter(f => !f.hidden).slice(0, 5).map(f => `<th>${f.label}</th>`).join("\n            ")}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r: any) => (
            <tr key={r.id}>
              ${resource.fields.filter(f => !f.hidden).slice(0, 5).map(f => `<td>{r.${f.name}}</td>`).join("\n              ")}
              <td><a href={\`/${resource.name}/\${r.id}\`}>View</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`;
  }

  private generateDetailPage(resource: Resource, _config: AppConfig): string {
    return `'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ${capitalize(resource.name)}DetailPage() {
  const { id } = useParams();
  const [record, setRecord] = useState<any>(null);

  useEffect(() => {
    fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/api/v1/${resource.name}/\${id}\`, {
      headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` }
    }).then(r => r.json()).then(d => setRecord(d.data));
  }, [id]);

  if (!record) return <div>Loading...</div>;

  return (
    <div>
      <h1>${resource.label} Detail</h1>
      ${resource.fields.filter(f => !f.hidden).map(f => `<p><strong>${f.label}:</strong> {record.${f.name}}</p>`).join("\n      ")}
      <a href="/${resource.name}/{id}/edit">Edit</a>
    </div>
  );
}
`;
  }

  private generateLoginPage(config: AppConfig): string {
    return `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      router.push('${config.auth.redirectAfterLogin}');
    } else {
      setError(data.error);
    }
  };

  return (
    <main>
      <h1>Sign In to ${config.name}</h1>
      {error && <p style={{color:'red'}}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      ${config.auth.allowRegistration ? '<p><a href="/auth/register">Create account</a></p>' : ""}
    </main>
  );
}
`;
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const githubExportPlugin = new GithubExportPlugin();
