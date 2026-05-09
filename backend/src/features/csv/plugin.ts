import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { AppConfig, Resource } from "../../../../shared/src/schemas/config.schema";
import { CRUDEngine } from "../../db/crud.engine";
import { requireAuth } from "../../auth/middleware";
import { logger } from "../../../../shared/src/utils/logger";
import { emailService } from "../email/service";

// Plugin registration interface
export interface Plugin {
  name: string;
  onRegister(app: any, config: AppConfig): void;
  onConfigLoad?(config: AppConfig): void;
  onRuntimeInit?(context: any): void;
  onError?(error: Error): void;
}

// In-memory row store: importId → parsed rows
// Rows are kept in memory for the duration of the import session (cleared after processing)
const rowStore = new Map<string, Record<string, string>[]>();

// ─── CSV Import Plugin ─────────────────────────────────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

interface ColumnMapping {
  csvHeader: string;
  fieldName: string;
}

interface ImportRowError {
  row: number;
  errors: string[];
  data: Record<string, unknown>;
}

export class CSVImportPlugin implements Plugin {
  name = "csv-import";
  private prisma!: PrismaClient;
  private crud!: CRUDEngine;
  private config!: AppConfig;

  onRegister(app: Router, config: AppConfig): void {
    logger.info("feature", "CSV Import plugin registered");
  }

  onConfigLoad(config: AppConfig): void {
    this.config = config;
    logger.info("feature", "CSV Import plugin config loaded");
  }

  onRuntimeInit(context: { prisma: PrismaClient; crud: CRUDEngine }): void {
    this.prisma = context.prisma;
    this.crud = context.crud;
  }

  onError(error: Error): void {
    logger.error("feature", "CSV Import plugin error", error.message);
  }

  createRouter(): Router {
    const router = Router();

    // POST /api/v1/csv/:resourceName/upload
    router.post(
      "/:resourceName/upload",
      requireAuth,
      upload.single("file"),
      async (req: Request, res: Response) => {
        const { resourceName } = req.params;
        const resource = this.config.resources.find((r) => r.name === resourceName);

        if (!resource) {
          return res.status(404).json({ success: false, error: `Resource "${resourceName}" not found` });
        }

        if (!req.file) {
          return res.status(400).json({ success: false, error: "No file uploaded" });
        }

        try {
          const fileContent = req.file.buffer.toString("utf-8");
          const rows = this.parseCSV(fileContent);

          if (rows.length === 0) {
            return res.status(400).json({ success: false, error: "CSV file is empty" });
          }

          // Create import record with rows stored in rawData for crash safety
          const importRecord = await this.prisma.csvImport.create({
            data: {
              resourceName,
              fileName: req.file.originalname,
              status: "pending",
              totalRows: rows.length,
              uploadedBy: req.user?.userId,
              rawData: rows as any, // DB-persisted fallback
            },
          });

          // ✅ Also store in memory for fast async access
          rowStore.set(importRecord.id, rows);

          // Auto-evict from memory after 30 minutes
          setTimeout(() => rowStore.delete(importRecord.id), 30 * 60 * 1000);

          // Return preview for mapping
          const headers = rows[0] ? Object.keys(rows[0]) : [];
          const previewRows = rows.slice(0, 5);

          res.json({
            success: true,
            importId: importRecord.id,
            headers,
            preview: previewRows,
            totalRows: rows.length,
            resourceFields: resource.fields.filter((f) => !f.hidden).map((f) => ({
              name: f.name,
              label: f.label,
              type: f.type,
              required: f.required,
            })),
          });
        } catch (e: any) {
          logger.error("feature", "CSV upload error", e.message);
          res.status(400).json({ success: false, error: `CSV parse error: ${e.message}` });
        }
      }
    );

    // POST /api/v1/csv/:resourceName/import/:importId — execute import with mapping
    router.post(
      "/:resourceName/import/:importId",
      requireAuth,
      async (req: Request, res: Response) => {
        const { resourceName, importId } = req.params;
        const { mappings }: { mappings: ColumnMapping[] } = req.body;

        if (!mappings || !Array.isArray(mappings)) {
          return res.status(400).json({ success: false, error: "Column mappings are required" });
        }

        const resource = this.config.resources.find((r) => r.name === resourceName);
        if (!resource) {
          return res.status(404).json({ success: false, error: `Resource "${resourceName}" not found` });
        }

        const importRecord = await this.prisma.csvImport.findUnique({ where: { id: importId } });
        if (!importRecord) {
          return res.status(404).json({ success: false, error: "Import record not found" });
        }

        // Update status to processing
        await this.prisma.csvImport.update({
          where: { id: importId },
          data: { status: "processing", startedAt: new Date() },
        });

        res.json({ success: true, message: "Import started", importId });

        // Process asynchronously
        this.processImport(importId, resource, mappings, req.user?.userId).catch((e) => {
          logger.error("feature", `Import ${importId} failed`, e.message);
        });
      }
    );

    // GET /api/v1/csv/:resourceName/import/:importId/status
    router.get(
      "/:resourceName/import/:importId/status",
      requireAuth,
      async (req: Request, res: Response) => {
        const { importId } = req.params;
        const importRecord = await this.prisma.csvImport.findUnique({ where: { id: importId } });

        if (!importRecord) {
          return res.status(404).json({ success: false, error: "Import not found" });
        }

        res.json({ success: true, data: importRecord });
      }
    );

    // GET /api/v1/csv/:resourceName/imports — list past imports
    router.get("/:resourceName/imports", requireAuth, async (req: Request, res: Response) => {
      const { resourceName } = req.params;
      const imports = await this.prisma.csvImport.findMany({
        where: { resourceName },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      res.json({ success: true, data: imports });
    });

    return router;
  }

  private parseCSV(content: string): Record<string, string>[] {
    // Sanitize: remove BOM
    const cleaned = content.replace(/^\uFEFF/, "").trim();

    return parse(cleaned, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      cast: false, // keep as strings, we coerce later
    });
  }

  private async processImport(
    importId: string,
    resource: Resource,
    mappings: ColumnMapping[],
    userId?: string
  ) {
    // Try memory store first (fast path)
    let rows = rowStore.get(importId);

    // Fallback: load from DB rawData (handles server restart between upload and import)
    if (!rows || rows.length === 0) {
      const record = await this.prisma.csvImport.findUnique({ where: { id: importId } });
      const rawData = record?.rawData as Record<string, string>[] | null;
      if (rawData && Array.isArray(rawData) && rawData.length > 0) {
        rows = rawData;
        logger.info("feature", `Import ${importId}: loaded ${rows.length} rows from DB fallback`);
      } else {
        await this.prisma.csvImport.update({
          where: { id: importId },
          data: {
            status: "failed",
            errors: [{ message: "Row data not found. Please re-upload the file." }] as any,
            completedAt: new Date(),
          },
        });
        logger.warn("feature", `Import ${importId}: rows not found in store or DB`);
        return;
      }
    }

    try {
      const result = await this.processRows(importId, resource, rows, mappings, userId);

      // Clean up memory after processing
      rowStore.delete(importId);

      // Send email notification to uploader if we can find their email
      if (userId) {
        try {
          const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
          if (user?.email) {
            const importRecord = await this.prisma.csvImport.findUnique({ where: { id: importId } });
            await emailService.sendCSVImportDone(user.email, importRecord?.fileName || "file.csv", result.successRows, result.errorRows);
          }
        } catch (emailErr: any) {
          logger.warn("feature", `Import notification email failed: ${emailErr.message}`);
        }
      }

      logger.info("feature", `Import ${importId} completed: ${result.successRows} success, ${result.errorRows} errors`);
    } catch (e: any) {
      rowStore.delete(importId);
      await this.prisma.csvImport.update({
        where: { id: importId },
        data: { status: "failed", errors: [{ message: e.message }] as any, completedAt: new Date() },
      });
      throw e;
    }
  }

  // Public method to process rows directly (used when file buffer is available)
  async processRows(
    importId: string,
    resource: Resource,
    rows: Record<string, string>[],
    mappings: ColumnMapping[],
    userId?: string
  ) {
    const rowErrors: ImportRowError[] = [];
    let successRows = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      // Apply column mappings
      const mapped: Record<string, unknown> = {};
      for (const mapping of mappings) {
        if (mapping.csvHeader in row) {
          mapped[mapping.fieldName] = row[mapping.csvHeader];
        }
      }

      // Attempt to create record
      const result = await this.crud.create(resource, mapped, userId);

      if (result.success) {
        successRows++;
      } else {
        rowErrors.push({
          row: i + 2, // 1-indexed + header row
          errors: result.code === "VALIDATION_ERROR"
            ? Object.values(result.data as Record<string, string[]>).flat()
            : [result.error || "Unknown error"],
          data: mapped,
        });
      }
    }

    await this.prisma.csvImport.update({
      where: { id: importId },
      data: {
        status: rowErrors.length === rows.length ? "failed" : "done",
        successRows,
        errorRows: rowErrors.length,
        errors: rowErrors as any,
        completedAt: new Date(),
      },
    });

    return { successRows, errorRows: rowErrors.length, errors: rowErrors };
  }
}

export const csvImportPlugin = new CSVImportPlugin();
