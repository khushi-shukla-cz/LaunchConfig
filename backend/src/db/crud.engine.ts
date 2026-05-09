import { PrismaClient } from "@prisma/client";
import { Resource, Field } from "../../../shared/src/schemas/config.schema";
import { logger } from "../../../shared/src/utils/logger";

export type RecordData = Record<string, unknown>;

export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, unknown>;
  search?: string;
  searchFields?: string[];
  includeDeleted?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CRUDResult<T = RecordData> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// ─── Type coercion ────────────────────────────────────────────────────────────

function coerceValue(value: unknown, field: Field): unknown {
  if (value === null || value === undefined) return null;

  try {
    switch (field.type) {
      case "number":
        return typeof value === "number" ? value : Number(value);
      case "boolean":
        if (typeof value === "boolean") return value;
        return value === "true" || value === "1";
      case "date":
      case "datetime":
        if (value instanceof Date) return value;
        const d = new Date(value as string);
        return isNaN(d.getTime()) ? null : d;
      case "json":
        return typeof value === "string" ? JSON.parse(value) : value;
      default:
        return typeof value === "string" ? value : String(value);
    }
  } catch {
    return null;
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateRecord(
  data: RecordData,
  fields: Field[],
  mode: "create" | "update" = "create"
): { valid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};

  for (const field of fields) {
    if (field.hidden && field.readonly) continue;
    const value = data[field.name];
    const fieldErrors: string[] = [];

    if (field.required && mode === "create") {
      if (value === null || value === undefined || value === "") {
        fieldErrors.push(`${field.label || field.name} is required`);
      }
    }

    if (value !== null && value !== undefined && value !== "") {
      for (const rule of field.validation || []) {
        switch (rule.type) {
          case "min":
            if (typeof value === "string" && value.length < Number(rule.value)) {
              fieldErrors.push(rule.message || `Minimum length is ${rule.value}`);
            } else if (typeof value === "number" && value < Number(rule.value)) {
              fieldErrors.push(rule.message || `Minimum value is ${rule.value}`);
            }
            break;
          case "max":
            if (typeof value === "string" && value.length > Number(rule.value)) {
              fieldErrors.push(rule.message || `Maximum length is ${rule.value}`);
            } else if (typeof value === "number" && value > Number(rule.value)) {
              fieldErrors.push(rule.message || `Maximum value is ${rule.value}`);
            }
            break;
          case "pattern":
            try {
              if (!new RegExp(rule.value as string).test(String(value))) {
                fieldErrors.push(rule.message || `Invalid format`);
              }
            } catch {}
            break;
          case "email":
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
              fieldErrors.push(rule.message || `Invalid email address`);
            }
            break;
          case "url":
            try {
              new URL(String(value));
            } catch {
              fieldErrors.push(rule.message || `Invalid URL`);
            }
            break;
        }
      }
    }

    if (fieldErrors.length > 0) errors[field.name] = fieldErrors;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ─── Sanitize input ───────────────────────────────────────────────────────────

export function sanitizeRecord(data: RecordData, fields: Field[]): RecordData {
  const sanitized: RecordData = {};
  const allowed = new Set(fields.map((f) => f.name));

  for (const [key, value] of Object.entries(data)) {
    if (!allowed.has(key)) continue; // drop unknown fields
    const field = fields.find((f) => f.name === key)!;
    if (field.readonly && !field.hidden) continue; // skip readonly fields from user input
    sanitized[key] = coerceValue(value, field);
  }

  // Apply defaults for missing required fields
  for (const field of fields) {
    if (!(field.name in sanitized) && field.defaultValue !== undefined) {
      sanitized[field.name] = field.defaultValue;
    }
  }

  return sanitized;
}

// ─── CRUD Engine ──────────────────────────────────────────────────────────────

export class CRUDEngine {
  constructor(private prisma: PrismaClient) {}

  async list(
    resource: Resource,
    options: QueryOptions = {}
  ): Promise<PaginatedResult<RecordData>> {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
      filters = {},
      search,
      searchFields = [],
      includeDeleted = false,
    } = options;

    const offset = (page - 1) * Math.min(limit, 100);

    // Build JSON path filters
    const whereConditions: any[] = [{ resourceName: resource.name }];

    if (!includeDeleted && resource.softDelete) {
      whereConditions.push({ deletedAt: null });
    } else if (!includeDeleted) {
      whereConditions.push({ deletedAt: null });
    }

    // Filter by JSON data fields using Prisma's JSON filtering
    for (const [key, value] of Object.entries(filters)) {
      whereConditions.push({
        data: {
          path: [key],
          equals: value,
        },
      });
    }

    // Search
    if (search && searchFields.length > 0) {
      const searchConditions = searchFields.map((field) => ({
        data: {
          path: [field],
          string_contains: search,
        },
      }));
      whereConditions.push({ OR: searchConditions });
    }

    const where = { AND: whereConditions };

    try {
      const [records, total] = await Promise.all([
        this.prisma.dynamicRecord.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: sortBy === "createdAt" || sortBy === "updatedAt"
            ? { [sortBy]: sortOrder }
            : { createdAt: sortOrder },
        }),
        this.prisma.dynamicRecord.count({ where }),
      ]);

      return {
        data: records.map((r) => ({ id: r.id, ...((r.data as RecordData) || {}), _createdAt: r.createdAt, _updatedAt: r.updatedAt })),
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      };
    } catch (e: any) {
      logger.error("db", `List failed for ${resource.name}`, e.message);
      return { data: [], total: 0, page, limit, pages: 0 };
    }
  }

  async get(resource: Resource, id: string): Promise<CRUDResult> {
    try {
      const record = await this.prisma.dynamicRecord.findFirst({
        where: { id, resourceName: resource.name, deletedAt: null },
      });

      if (!record) return { success: false, error: "Record not found", code: "NOT_FOUND" };

      return {
        success: true,
        data: { id: record.id, ...((record.data as RecordData) || {}), _createdAt: record.createdAt, _updatedAt: record.updatedAt },
      };
    } catch (e: any) {
      logger.error("db", `Get failed for ${resource.name}/${id}`, e.message);
      return { success: false, error: "Database error", code: "DB_ERROR" };
    }
  }

  async create(resource: Resource, rawData: RecordData, userId?: string): Promise<CRUDResult> {
    const sanitized = sanitizeRecord(rawData, resource.fields);
    const validation = validateRecord(sanitized, resource.fields, "create");

    if (!validation.valid) {
      return { success: false, error: "Validation failed", code: "VALIDATION_ERROR", data: validation.errors as any };
    }

    try {
      const record = await this.prisma.dynamicRecord.create({
        data: {
          resourceName: resource.name,
          data: sanitized as any,
          createdBy: userId,
          updatedBy: userId,
        },
      });

      logger.info("runtime", `Created ${resource.name} record`, { id: record.id });

      return {
        success: true,
        data: { id: record.id, ...sanitized, _createdAt: record.createdAt },
      };
    } catch (e: any) {
      logger.error("db", `Create failed for ${resource.name}`, e.message);
      return { success: false, error: "Database error", code: "DB_ERROR" };
    }
  }

  async update(resource: Resource, id: string, rawData: RecordData, userId?: string): Promise<CRUDResult> {
    const existing = await this.get(resource, id);
    if (!existing.success) return existing;

    const sanitized = sanitizeRecord(rawData, resource.fields);
    const validation = validateRecord(sanitized, resource.fields, "update");

    if (!validation.valid) {
      return { success: false, error: "Validation failed", code: "VALIDATION_ERROR", data: validation.errors as any };
    }

    const merged = { ...(existing.data || {}), ...sanitized };
    // Remove internal fields
    delete merged._createdAt;
    delete merged._updatedAt;
    delete merged.id;

    try {
      const record = await this.prisma.dynamicRecord.update({
        where: { id },
        data: { data: merged as any, version: { increment: 1 }, updatedBy: userId },
      });

      return {
        success: true,
        data: { id: record.id, ...merged, _updatedAt: record.updatedAt },
      };
    } catch (e: any) {
      logger.error("db", `Update failed for ${resource.name}/${id}`, e.message);
      return { success: false, error: "Database error", code: "DB_ERROR" };
    }
  }

  async delete(resource: Resource, id: string, userId?: string): Promise<CRUDResult> {
    const existing = await this.get(resource, id);
    if (!existing.success) return existing;

    try {
      if (resource.softDelete) {
        await this.prisma.dynamicRecord.update({
          where: { id },
          data: { deletedAt: new Date(), updatedBy: userId },
        });
      } else {
        await this.prisma.dynamicRecord.delete({ where: { id } });
      }

      logger.info("runtime", `Deleted ${resource.name} record`, { id });
      return { success: true };
    } catch (e: any) {
      logger.error("db", `Delete failed for ${resource.name}/${id}`, e.message);
      return { success: false, error: "Database error", code: "DB_ERROR" };
    }
  }

  async bulkCreate(resource: Resource, rows: RecordData[], userId?: string) {
    const results: Array<{ index: number; success: boolean; id?: string; errors?: unknown }> = [];

    for (let i = 0; i < rows.length; i++) {
      const result = await this.create(resource, rows[i], userId);
      results.push({
        index: i,
        success: result.success,
        id: result.data?.id as string,
        errors: result.success ? undefined : result.data,
      });
    }

    const succeeded = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    return { results, succeeded, failed };
  }
}
