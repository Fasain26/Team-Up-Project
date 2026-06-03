import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

const REFRESH_COOKIE = "refreshToken";

/**
 * The refresh token lives in an httpOnly cookie — JavaScript on the page
 * (and therefore most XSS payloads) cannot read it. The short-lived access
 * token goes in the JSON body; the frontend keeps it in memory.
 *
 * Day-7 deploy note: Vercel (frontend) and Render (backend) are DIFFERENT
 * domains, so this cookie is cross-site. In production you MUST set
 * sameSite:"none" + secure:true or the browser will silently drop it.
 */
function setRefreshCookie(res: Response, token: string) {
  const isProd = env.NODE_ENV === "production";
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isProd, // HTTPS-only in prod
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/api/auth", // cookie only sent to auth routes
  });
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ user, accessToken });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setRefreshCookie(res, refreshToken);
    res.json({ user, accessToken });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw AppError.unauthorized("No refresh token");

    const { user, accessToken, refreshToken } = await authService.refresh(token);
    setRefreshCookie(res, refreshToken);
    res.json({ user, accessToken });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    // requireAuth populated req.user
    if (req.user) await authService.logout(req.user.userId);
    res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
    res.status(204).send();
  }),
};
