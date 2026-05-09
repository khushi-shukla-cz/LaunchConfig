import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Resource } from "../../../shared/src/schemas/config.schema";
import { logger } from "../../../shared/src/utils/logger";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// ─── JWT Helpers ──────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export function signToken(payload: JWTPayload, expiresIn = "24h"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, error: "Authentication required", code: "UNAUTHORIZED" });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: "Invalid or expired token", code: "INVALID_TOKEN" });
  }

  req.user = payload;
  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies?.token;

  if (token) {
    const payload = verifyToken(token);
    if (payload) req.user = payload;
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      logger.warn("auth", `Role check failed: user ${req.user.userId} has role ${req.user.role}, required ${roles.join("|")}`);
      return res.status(403).json({ success: false, error: "Insufficient permissions", code: "FORBIDDEN" });
    }
    next();
  };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Admin access required", code: "FORBIDDEN" });
  }
  next();
}

export function requireResourcePermission(resource: Resource, action: "create" | "read" | "update" | "delete") {
  return (req: Request, res: Response, next: NextFunction) => {
    const perm = resource.permissions?.[action];

    if (perm === false) {
      return res.status(403).json({ success: false, error: `${action} is not allowed on ${resource.name}`, code: "FORBIDDEN" });
    }

    if (Array.isArray(perm)) {
      const userRole = req.user?.role || "anonymous";
      if (!perm.includes(userRole)) {
        logger.warn("auth", `Resource permission denied: ${action} on ${resource.name} for role ${userRole}`);
        return res.status(403).json({ success: false, error: "Insufficient permissions", code: "FORBIDDEN" });
      }
    }

    next();
  };
}

// ─── Rate limiting helper ─────────────────────────────────────────────────────

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function simpleRateLimit(windowMs: number, max: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      return res.status(429).json({ success: false, error: "Too many requests", code: "RATE_LIMITED" });
    }

    entry.count++;
    next();
  };
}
