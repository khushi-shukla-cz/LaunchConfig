import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { AuthConfig } from "../../../shared/src/schemas/config.schema";
import { signToken } from "./middleware";
import { logger } from "../../../shared/src/utils/logger";
import { emailService } from "../features/email/service";

export class AuthService {
  constructor(private prisma: PrismaClient, private authConfig: AuthConfig) {}

  // ─── Email / Password ──────────────────────────────────────────────────────

  async register(email: string, password: string, name?: string) {
    if (!this.authConfig.allowRegistration) {
      return { success: false, error: "Registration is disabled", code: "REGISTRATION_DISABLED" };
    }

    if (!this.authConfig.providers.includes("email")) {
      return { success: false, error: "Email auth not enabled", code: "PROVIDER_DISABLED" };
    }

    // Password policy
    const policy = this.authConfig.passwordPolicy;
    if (password.length < policy.minLength) {
      return { success: false, error: `Password must be at least ${policy.minLength} characters`, code: "WEAK_PASSWORD" };
    }
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      return { success: false, error: "Password must contain uppercase letters", code: "WEAK_PASSWORD" };
    }
    if (policy.requireNumbers && !/\d/.test(password)) {
      return { success: false, error: "Password must contain numbers", code: "WEAK_PASSWORD" };
    }
    if (policy.requireSymbols && !/[^A-Za-z0-9]/.test(password)) {
      return { success: false, error: "Password must contain symbols", code: "WEAK_PASSWORD" };
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Email already in use", code: "EMAIL_EXISTS" };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const defaultRole = this.authConfig.roles.find((r) => r.isDefault)?.name || "user";

    const user = await this.prisma.user.create({
      data: { email, passwordHash, name, role: defaultRole },
    });

    // Send welcome email (non-blocking)
    emailService.sendWelcome(email, name || email.split("@")[0]).catch((e) =>
      logger.warn("auth", `Welcome email failed: ${e.message}`)
    );

    logger.info("auth", `New user registered: ${email}`);
    return { success: true, user: { id: user.id, email: user.email, role: user.role, name: user.name } };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return { success: false, error: "Invalid credentials", code: "INVALID_CREDENTIALS" };
    }
    if (!user.isActive) {
      return { success: false, error: "Account disabled", code: "ACCOUNT_DISABLED" };
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return { success: false, error: "Invalid credentials", code: "INVALID_CREDENTIALS" };
    }

    const session = await this.createSession(user.id);
    const token = signToken({ userId: user.id, email: user.email, role: user.role, sessionId: session.id });

    logger.info("auth", `User logged in: ${email}`);
    return { success: true, token, user: { id: user.id, email: user.email, role: user.role, name: user.name } };
  }

  // ─── OTP ──────────────────────────────────────────────────────────────────

  async sendOTP(email: string) {
    if (!this.authConfig.providers.includes("otp")) {
      return { success: false, error: "OTP auth not enabled", code: "PROVIDER_DISABLED" };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.prisma.otpCode.create({ data: { email, code, expiresAt } });

    // Send OTP via email service (Ethereal in dev, real SMTP in prod)
    const emailResult = await emailService.sendOTP(email, code);
    if (!emailResult.success) {
      logger.warn("auth", `OTP email failed for ${email}: ${emailResult.error}`);
    }
    if (emailResult.previewUrl) {
      logger.info("auth", `OTP preview URL: ${emailResult.previewUrl}`);
    }

    logger.info("auth", `OTP sent to ${email}`);

    return { success: true, message: "OTP sent to email" };
  }

  async verifyOTP(email: string, code: string) {
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: { email, code, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return { success: false, error: "Invalid or expired OTP", code: "INVALID_OTP" };
    }

    await this.prisma.otpCode.update({ where: { id: otpRecord.id }, data: { used: true } });

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      const defaultRole = this.authConfig.roles.find((r) => r.isDefault)?.name || "user";
      user = await this.prisma.user.create({ data: { email, role: defaultRole, emailVerified: true } });
      logger.info("auth", `New user created via OTP: ${email}`);
    }

    const session = await this.createSession(user.id);
    const token = signToken({ userId: user.id, email: user.email, role: user.role, sessionId: session.id });

    return { success: true, token, user: { id: user.id, email: user.email, role: user.role, name: user.name } };
  }

  // ─── Session Management ────────────────────────────────────────────────────

  async createSession(userId: string) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + this.authConfig.sessionDuration * 1000);

    return this.prisma.session.create({ data: { userId, token, expiresAt } });
  }

  async logout(sessionId: string) {
    try {
      await this.prisma.session.delete({ where: { id: sessionId } });
    } catch {
      // Session may not exist, ignore
    }
    return { success: true };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true, createdAt: true },
    });
    if (!user) return { success: false, error: "User not found", code: "NOT_FOUND" };
    return { success: true, user };
  }

  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name: data.name, avatarUrl: data.avatarUrl },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true },
    });
    return { success: true, user };
  }
}
