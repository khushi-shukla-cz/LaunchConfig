import { Router, Request, Response, NextFunction } from "express";
import { AppConfig, Resource } from "../../../shared/src/schemas/config.schema";
import { CRUDEngine } from "../db/crud.engine";
import { logger } from "../../../shared/src/utils/logger";
import { requireAuth, requireRole, requireResourcePermission } from "../auth/middleware";

// ─── API Generator ────────────────────────────────────────────────────────────

export class APIGenerator {
  constructor(private crud: CRUDEngine) {}

  generateResourceRouter(resource: Resource, config: AppConfig): Router {
    const router = Router();
    const perms = resource.permissions || {};

    // GET /resource — list
    router.get(
      "/",
      requireAuth,
      requireResourcePermission(resource, "read"),
      async (req: Request, res: Response) => {
        try {
          const page = Math.max(1, parseInt(req.query.page as string) || 1);
          const limit = Math.min(
            config.api.pagination.maxLimit,
            parseInt(req.query.limit as string) || config.api.pagination.defaultLimit
          );
          const sortBy = (req.query.sortBy as string) || "createdAt";
          const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";
          const search = req.query.search as string;

          // Extract filter params (prefixed with f_)
          const filters: Record<string, unknown> = {};
          for (const [key, val] of Object.entries(req.query)) {
            if (key.startsWith("f_")) {
              filters[key.slice(2)] = val;
            }
          }

          const result = await this.crud.list(resource, {
            page, limit, sortBy, sortOrder, filters, search,
            searchFields: resource.searchable || [],
          });

          res.json({ success: true, ...result });
        } catch (e: any) {
          logger.error("api", `List error on ${resource.name}`, e.message);
          res.status(500).json({ success: false, error: "Internal server error" });
        }
      }
    );

    // GET /resource/:id — get single
    router.get(
      "/:id",
      requireAuth,
      requireResourcePermission(resource, "read"),
      async (req: Request, res: Response) => {
        const result = await this.crud.get(resource, req.params.id);
        if (!result.success) {
          return res.status(result.code === "NOT_FOUND" ? 404 : 500).json(result);
        }
        res.json({ success: true, data: result.data });
      }
    );

    // POST /resource — create
    router.post(
      "/",
      requireAuth,
      requireResourcePermission(resource, "create"),
      async (req: Request, res: Response) => {
        const result = await this.crud.create(resource, req.body, (req as any).user?.id);
        if (!result.success) {
          return res.status(result.code === "VALIDATION_ERROR" ? 422 : 500).json(result);
        }
        res.status(201).json({ success: true, data: result.data });
      }
    );

    // PUT /resource/:id — full update
    router.put(
      "/:id",
      requireAuth,
      requireResourcePermission(resource, "update"),
      async (req: Request, res: Response) => {
        const result = await this.crud.update(resource, req.params.id, req.body, (req as any).user?.id);
        if (!result.success) {
          const status = result.code === "NOT_FOUND" ? 404 : result.code === "VALIDATION_ERROR" ? 422 : 500;
          return res.status(status).json(result);
        }
        res.json({ success: true, data: result.data });
      }
    );

    // PATCH /resource/:id — partial update
    router.patch(
      "/:id",
      requireAuth,
      requireResourcePermission(resource, "update"),
      async (req: Request, res: Response) => {
        const result = await this.crud.update(resource, req.params.id, req.body, (req as any).user?.id);
        if (!result.success) {
          const status = result.code === "NOT_FOUND" ? 404 : result.code === "VALIDATION_ERROR" ? 422 : 500;
          return res.status(status).json(result);
        }
        res.json({ success: true, data: result.data });
      }
    );

    // DELETE /resource/:id
    router.delete(
      "/:id",
      requireAuth,
      requireResourcePermission(resource, "delete"),
      async (req: Request, res: Response) => {
        const result = await this.crud.delete(resource, req.params.id, (req as any).user?.id);
        if (!result.success) {
          return res.status(result.code === "NOT_FOUND" ? 404 : 500).json(result);
        }
        res.json({ success: true });
      }
    );

    return router;
  }

  mountAll(app: Router, config: AppConfig): void {
    const prefix = `${config.api.prefix}/${config.api.version}`;

    for (const resource of config.resources) {
      try {
        const resourceRouter = this.generateResourceRouter(resource, config);
        app.use(`${prefix}/${resource.name}`, resourceRouter);
        logger.info("api", `Mounted resource API: ${prefix}/${resource.name}`);
      } catch (e: any) {
        logger.error("api", `Failed to mount resource ${resource.name}`, e.message);
        // continue with other resources — graceful degradation
      }
    }
  }
}
