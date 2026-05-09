import { Router, Request, Response } from "express";
import { AuthService } from "./service";
import { requireAuth } from "./middleware";
import { AppConfig } from "../../../shared/src/schemas/config.schema";

export function createAuthRouter(authService: AuthService, config: AppConfig): Router {
  const router = Router();

  // POST /auth/register
  router.post("/register", async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const result = await authService.register(email, password, name);
    if (!result.success) {
      return res.status(result.code === "EMAIL_EXISTS" ? 409 : 400).json(result);
    }
    res.status(201).json(result);
  });

  // POST /auth/login
  router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const result = await authService.login(email, password);
    if (!result.success) {
      return res.status(401).json(result);
    }
    res.json(result);
  });

  // POST /auth/otp/send
  router.post("/otp/send", async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: "Email is required" });

    const result = await authService.sendOTP(email);
    res.json(result);
  });

  // POST /auth/otp/verify
  router.post("/otp/verify", async (req: Request, res: Response) => {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, error: "Email and code are required" });
    }

    const result = await authService.verifyOTP(email, code);
    if (!result.success) return res.status(401).json(result);
    res.json(result);
  });

  // POST /auth/logout
  router.post("/logout", requireAuth, async (req: Request, res: Response) => {
    const sessionId = req.user!.sessionId;
    await authService.logout(sessionId);
    res.json({ success: true });
  });

  // GET /auth/me
  router.get("/me", requireAuth, async (req: Request, res: Response) => {
    const result = await authService.getMe(req.user!.userId);
    if (!result.success) return res.status(404).json(result);
    res.json(result);
  });

  // PATCH /auth/me
  router.patch("/me", requireAuth, async (req: Request, res: Response) => {
    const { name, avatarUrl } = req.body;
    const result = await authService.updateProfile(req.user!.userId, { name, avatarUrl });
    res.json(result);
  });

  // GET /auth/config — public, exposes auth UI config
  router.get("/config", (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        providers: config.auth.providers,
        allowRegistration: config.auth.allowRegistration,
        requireEmailVerification: config.auth.requireEmailVerification,
        redirectAfterLogin: config.auth.redirectAfterLogin,
        passwordPolicy: config.auth.passwordPolicy,
      },
    });
  });

  return router;
}
