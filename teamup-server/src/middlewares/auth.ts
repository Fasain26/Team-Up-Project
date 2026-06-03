import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

/**
 * Gatekeeper for protected routes. Reads the Bearer access token from the
 * Authorization header, verifies it, and attaches the payload to req.user.
 *
 * Usage:  router.get("/me", requireAuth, controller.me)
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw AppError.unauthorized("Missing or malformed Authorization header");
  }

  const token = header.slice(7); // strip "Bearer "
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    // jwt.verify throws on expired/invalid -> normalize to a 401
    throw AppError.unauthorized("Invalid or expired access token");
  }
}

/**
 * Role guard. Mount AFTER requireAuth.
 * Usage:  router.get("/admin/stats", requireAuth, requireRole("ADMIN"), ...)
 */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw AppError.unauthorized();
    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden("You do not have permission to access this resource");
    }
    next();
  };
}
