import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

import { ConfigParser } from "../../shared/src/utils/config.engine";
import { CRUDEngine } from "./db/crud.engine";
import { APIGenerator } from "./api/generator";
import { AuthService } from "./auth/service";
import { createAuthRouter } from "./auth/router";
import { pluginRegistry } from "./plugins/registry";
import { simpleRateLimit } from "./auth/middleware";
import { logger } from "../../shared/src/utils/logger";
import { emailService } from "./features/email/service";

// ─── Prisma ───────────────────────────────────────────────────────────────────

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

// ─── Config Loading ───────────────────────────────────────────────────────────

function loadConfig() {
  const configPath = process.env.CONFIG_PATH || path.resolve(__dirname, "../../config/app.config.json");

  let rawConfig: unknown = {};

  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, "utf-8");
      rawConfig = JSON.parse(content);
      logger.info("config", `Loaded config from ${configPath}`);
    } catch (e: any) {
      logger.error("config", `Failed to parse config file: ${e.message}`);
      logger.warn("config", "Falling back to empty config with defaults");
    }
  } else {
    logger.warn("config", `Config file not found at ${configPath}, using defaults`);
  }

  const parser = new ConfigParser();
  const result = parser.parse(rawConfig, "main");

  if (result.errors.length) {
    logger.warn("config", `Config has ${result.errors.length} error(s)`, result.errors);
  }
  if (result.warnings.length) {
    logger.warn("config", `Config has ${result.warnings.length} warning(s)`, result.warnings);
  }

  logger.info("config", `Config loaded: ${result.normalized.resources.length} resources, version ${result.normalized.configVersion}`);

  return result;
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

async function bootstrap() {
  const configResult = loadConfig();
  const config = configResult.normalized;

  const app = express();

  // ── Security & Parsing ──────────────────────────────────────────────────────
  app.use(helmet({ contentSecurityPolicy: false })); // CSP handled by Next.js
  app.use(cors({
    origin: process.env.FRONTEND_URL?.split(",") || "*",
    credentials: true,
  }));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // ── Rate limiting ───────────────────────────────────────────────────────────
  if (config.api.rateLimit.enabled) {
    app.use(
      `${config.api.prefix}`,
      simpleRateLimit(config.api.rateLimit.windowMs, config.api.rateLimit.max)
    );
  }

  // ── Request logging ─────────────────────────────────────────────────────────
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.debug("api", `${req.method} ${req.path}`);
    next();
  });

  // ── Core services ───────────────────────────────────────────────────────────
  const crud = new CRUDEngine(prisma);
  const authService = new AuthService(prisma, config.auth);
  const apiGenerator = new APIGenerator(crud);

  // ── Email service ────────────────────────────────────────────────────────────
  await emailService.init(config.ui.appName || config.name);

  // ── Plugins: register & init ────────────────────────────────────────────────
  const apiRouter = express.Router();

  pluginRegistry.registerBuiltins(config);
  pluginRegistry.fireOnRegister(apiRouter, config);
  pluginRegistry.fireOnRuntimeInit({ prisma, crud, config });
  pluginRegistry.fireOnConfigLoad(config);

  // ── Mount resource APIs ─────────────────────────────────────────────────────
  apiGenerator.mountAll(apiRouter, config);

  // ── Mount auth ──────────────────────────────────────────────────────────────
  const prefix = `${config.api.prefix}/${config.api.version}`;
  apiRouter.use(`${prefix}/auth`, createAuthRouter(authService, config));

  // ── Mount plugin routes ─────────────────────────────────────────────────────
  pluginRegistry.mountPluginRoutes(apiRouter, config);

  app.use("/", apiRouter);

  // ── Config API (admin) ──────────────────────────────────────────────────────
  app.get(`${prefix}/config`, (_req: Request, res: Response) => {
    // Return sanitized config (no secrets)
    const safe = { ...config };
    res.json({ success: true, data: safe });
  });

  app.post(`${prefix}/config/reload`, async (_req: Request, res: Response) => {
    try {
      const newResult = loadConfig();
      res.json({ success: true, warnings: newResult.warnings, errors: newResult.errors });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // ── Logs API (admin) ────────────────────────────────────────────────────────
  app.get(`${prefix}/logs`, (_req: Request, res: Response) => {
    const { level, category, limit } = _req.query as Record<string, string>;
    const logs = logger.getLogs({
      level: level as any,
      category: category as any,
      limit: limit ? parseInt(limit) : 100,
    });
    res.json({ success: true, data: logs });
  });

  // ── Health check ────────────────────────────────────────────────────────────
  app.get("/health", async (_req: Request, res: Response) => {
    let dbStatus = "ok";
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = "error";
    }

    res.json({
      status: "ok",
      db: dbStatus,
      config: {
        version: config.configVersion,
        resources: config.resources.length,
        features: config.features.length,
      },
      uptime: process.uptime(),
    });
  });

  // ── 404 handler ─────────────────────────────────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, error: "Route not found", code: "NOT_FOUND" });
  });

  // ── Global error handler ─────────────────────────────────────────────────────
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error("runtime", "Unhandled error", { message: err.message, stack: err.stack });
    res.status(500).json({ success: false, error: "Internal server error", code: "SERVER_ERROR" });
  });

  // ── Start ───────────────────────────────────────────────────────────────────
  await prisma.$connect();
  logger.info("runtime", "Database connected");

  const port = parseInt(process.env.PORT || "4000");
  app.listen(port, () => {
    logger.info("runtime", `🚀 ConfigRuntime API running on http://localhost:${port}`);
    logger.info("runtime", `Environment: ${config.environment}`);
    logger.info("runtime", `Resources: ${config.resources.map((r) => r.name).join(", ") || "none"}`);
    logger.info("runtime", `Features: ${pluginRegistry ? "csv-import, i18n, github-export" : "none"}`);
  });

  // ── Graceful shutdown ───────────────────────────────────────────────────────
  process.on("SIGTERM", async () => {
    logger.info("runtime", "SIGTERM received, shutting down");
    await prisma.$disconnect();
    process.exit(0);
  });
}

bootstrap().catch((e) => {
  logger.error("runtime", "Fatal bootstrap error", e.message);
  process.exit(1);
});
