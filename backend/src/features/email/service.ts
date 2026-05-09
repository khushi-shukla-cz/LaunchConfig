import nodemailer from "nodemailer";
import { logger } from "../../../shared/src/utils/logger";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
}

// ─── Templates ────────────────────────────────────────────────────────────────

export const EmailTemplates = {
  otp: (code: string, appName = "ConfigRuntime") => ({
    subject: `Your ${appName} verification code`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h2 style="font-size: 20px; font-weight: 600; color: #111; margin: 0 0 8px;">${appName}</h2>
        <p style="color: #666; font-size: 14px; margin: 0 0 32px;">Sign in verification code</p>
        <div style="background: #f5f5f5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="font-size: 13px; color: #666; margin: 0 0 12px;">Your one-time code</p>
          <p style="font-size: 40px; font-weight: 700; color: #4f46e5; letter-spacing: 8px; margin: 0; font-family: monospace;">${code}</p>
          <p style="font-size: 12px; color: #999; margin: 12px 0 0;">Expires in 10 minutes</p>
        </div>
        <p style="color: #666; font-size: 13px; line-height: 1.6; margin: 0;">
          If you didn't request this code, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #999; font-size: 12px; margin: 0;">Sent by ${appName} · Do not reply</p>
      </div>
    `,
    text: `Your ${appName} verification code: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, ignore this email.`,
  }),

  welcome: (name: string, appName = "ConfigRuntime") => ({
    subject: `Welcome to ${appName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h2 style="font-size: 20px; font-weight: 600; color: #111; margin: 0 0 16px;">Welcome to ${appName}, ${name || "there"}! 👋</h2>
        <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
          Your account has been created successfully. You can now sign in and start using the platform.
        </p>
        <p style="color: #999; font-size: 12px; margin: 24px 0 0;">Sent by ${appName}</p>
      </div>
    `,
    text: `Welcome to ${appName}, ${name || "there"}!\n\nYour account has been created. You can now sign in.`,
  }),

  csvImportDone: (fileName: string, successRows: number, errorRows: number, appName = "ConfigRuntime") => ({
    subject: `CSV Import complete — ${fileName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h2 style="font-size: 18px; font-weight: 600; color: #111; margin: 0 0 16px;">Import complete</h2>
        <p style="color: #555; font-size: 14px; margin: 0 0 24px;">Your CSV file <strong>${fileName}</strong> has been processed.</p>
        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
          <div style="flex: 1; background: #f0fdf4; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="font-size: 28px; font-weight: 700; color: #16a34a; margin: 0;">${successRows}</p>
            <p style="font-size: 12px; color: #15803d; margin: 4px 0 0;">Imported</p>
          </div>
          ${errorRows > 0 ? `<div style="flex: 1; background: #fef2f2; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="font-size: 28px; font-weight: 700; color: #dc2626; margin: 0;">${errorRows}</p>
            <p style="font-size: 12px; color: #b91c1c; margin: 4px 0 0;">Failed rows</p>
          </div>` : ""}
        </div>
        <p style="color: #999; font-size: 12px; margin: 0;">Sent by ${appName}</p>
      </div>
    `,
    text: `CSV Import complete: ${fileName}\n\n✅ ${successRows} rows imported\n${errorRows > 0 ? `❌ ${errorRows} rows failed` : ""}`,
  }),
};

// ─── Email Service ────────────────────────────────────────────────────────────

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private appName: string = "ConfigRuntime";
  private fromAddress: string = "noreply@configruntime.dev";
  private isDev: boolean = process.env.NODE_ENV !== "production";

  async init(appName?: string) {
    if (appName) this.appName = appName;
    this.fromAddress = process.env.SMTP_FROM || `noreply@${appName?.toLowerCase().replace(/\s/g, "") || "configruntime"}.dev`;

    if (this.isDev || !process.env.SMTP_HOST) {
      // Development: use Ethereal (fake SMTP) — emails are captured and viewable via URL
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
        logger.info("feature", `Email: using Ethereal test account (${testAccount.user}). Preview emails at https://ethereal.email`);
      } catch {
        // Ethereal unavailable — log-only fallback
        this.transporter = null;
        logger.warn("feature", "Email: Ethereal unavailable, using console-only fallback");
      }
    } else {
      // Production: real SMTP
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      logger.info("feature", `Email: SMTP configured (${process.env.SMTP_HOST}:${process.env.SMTP_PORT})`);
    }
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    const { to, subject, html, text } = message;

    // Always log to console (useful in dev + tests)
    logger.info("feature", `Email → ${to} | ${subject}`);

    if (!this.transporter) {
      // Console-only fallback: print to stdout so tests can capture it
      console.log(`\n📧 EMAIL (console fallback)\n  To: ${to}\n  Subject: ${subject}\n  Body: ${text || "(html only)"}\n`);
      return { success: true, messageId: `console-${Date.now()}` };
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${this.appName}" <${this.fromAddress}>`,
        to,
        subject,
        html,
        text,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
      if (previewUrl) {
        logger.info("feature", `Email preview: ${previewUrl}`);
      }

      return { success: true, messageId: info.messageId, previewUrl: previewUrl || undefined };
    } catch (e: any) {
      logger.error("feature", `Email send failed to ${to}`, e.message);
      return { success: false, error: e.message };
    }
  }

  // ── Convenience methods ────────────────────────────────────────────────────

  async sendOTP(to: string, code: string): Promise<EmailResult> {
    const { subject, html, text } = EmailTemplates.otp(code, this.appName);
    return this.send({ to, subject, html, text });
  }

  async sendWelcome(to: string, name: string): Promise<EmailResult> {
    const { subject, html, text } = EmailTemplates.welcome(name, this.appName);
    return this.send({ to, subject, html, text });
  }

  async sendCSVImportDone(to: string, fileName: string, successRows: number, errorRows: number): Promise<EmailResult> {
    const { subject, html, text } = EmailTemplates.csvImportDone(fileName, successRows, errorRows, this.appName);
    return this.send({ to, subject, html, text });
  }
}

export const emailService = new EmailService();
