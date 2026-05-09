import { Router, Request, Response } from "express";
import { AppConfig, I18nConfig } from "../../../../shared/src/schemas/config.schema";
import { logger } from "../../../../shared/src/utils/logger";

export class I18nPlugin {
  name = "i18n";
  private config!: AppConfig;

  onRegister(_app: any, config: AppConfig): void {
    this.config = config;
    logger.info("feature", `i18n plugin registered. Locales: ${config.i18n.supportedLocales.join(", ")}`);
  }

  onConfigLoad(config: AppConfig): void {
    this.config = config;
  }

  onRuntimeInit(_context: any): void {}

  onError(error: Error): void {
    logger.error("feature", "i18n plugin error", error.message);
  }

  // ─── Translation resolution ──────────────────────────────────────────────

  translate(key: string, locale: string, params?: Record<string, string>): string {
    const i18n = this.config.i18n;

    if (!i18n.enabled) return key;

    // Try requested locale
    let value = this.getKey(key, locale);

    // Fallback to default locale
    if (!value && locale !== i18n.defaultLocale) {
      value = this.getKey(key, i18n.defaultLocale);
      if (value) {
        logger.warn("feature", `Missing i18n key "${key}" for locale "${locale}", using default`);
      }
    }

    // Fallback to fallback locale
    if (!value && locale !== i18n.fallbackLocale) {
      value = this.getKey(key, i18n.fallbackLocale);
    }

    // Last resort: return the key itself
    if (!value) {
      logger.warn("feature", `Missing i18n key "${key}" in all locales`);
      return key;
    }

    // Parameter interpolation
    if (params) {
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(new RegExp(`{{${k}}}`, "g"), v),
        value
      );
    }

    return value;
  }

  private getKey(key: string, locale: string): string | null {
    const translations = this.config.i18n.translations[locale];
    if (!translations) return null;

    // Support dot-notation keys
    const parts = key.split(".");
    let current: any = translations;
    for (const part of parts) {
      if (typeof current !== "object" || current === null) return null;
      current = current[part];
    }

    return typeof current === "string" ? current : null;
  }

  getAllTranslations(locale: string): Record<string, string> {
    return this.config.i18n.translations[locale] || {};
  }

  getSupportedLocales(): Array<{ code: string; label: string }> {
    const localeLabels: Record<string, string> = {
      en: "English", es: "Español", fr: "Français", de: "Deutsch",
      it: "Italiano", pt: "Português", ja: "日本語", zh: "中文",
      ar: "العربية", ru: "Русский", ko: "한국어", nl: "Nederlands",
    };

    return this.config.i18n.supportedLocales.map((code) => ({
      code,
      label: localeLabels[code] || code,
    }));
  }

  createRouter(): Router {
    const router = Router();

    // GET /api/v1/i18n/locales — list supported locales
    router.get("/locales", (_req: Request, res: Response) => {
      res.json({
        success: true,
        data: {
          supported: this.getSupportedLocales(),
          default: this.config.i18n.defaultLocale,
          fallback: this.config.i18n.fallbackLocale,
        },
      });
    });

    // GET /api/v1/i18n/:locale — get all translations for a locale
    router.get("/:locale", (req: Request, res: Response) => {
      const { locale } = req.params;

      if (!this.config.i18n.supportedLocales.includes(locale)) {
        return res.status(404).json({
          success: false,
          error: `Locale "${locale}" is not supported`,
          supported: this.config.i18n.supportedLocales,
        });
      }

      const translations = this.getAllTranslations(locale);
      const fallbackTranslations = this.getAllTranslations(this.config.i18n.fallbackLocale);

      // Merge with fallback so client has complete set
      const merged = { ...fallbackTranslations, ...translations };

      res.json({ success: true, locale, data: merged });
    });

    // POST /api/v1/i18n/translate — batch translate keys
    router.post("/translate", (req: Request, res: Response) => {
      const { keys, locale } = req.body;

      if (!Array.isArray(keys) || !locale) {
        return res.status(400).json({ success: false, error: "keys (array) and locale are required" });
      }

      const result: Record<string, string> = {};
      for (const key of keys) {
        result[key] = this.translate(key, locale);
      }

      res.json({ success: true, locale, translations: result });
    });

    return router;
  }
}

export const i18nPlugin = new I18nPlugin();
