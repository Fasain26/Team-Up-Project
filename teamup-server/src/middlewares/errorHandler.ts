import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

/**
 * 404 handler — mounted AFTER all routes. If we got here, no route matched.
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

/**
 * Central error handler. MUST have 4 args for Express to recognize it as an
 * error handler, and MUST be mounted LAST. Every `throw` in the app funnels
 * here, so error responses have ONE consistent shape: { message, errors? }.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  // 1) Zod validation errors -> 422 with field-level detail
  if (err instanceof ZodError) {
    return res.status(422).json({
      message: "Validation failed",
      errors: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
  }

  // 2) Prisma unique-constraint violation -> 409 (e.g. duplicate email)
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    const field = (err.meta?.target as string[])?.join(", ") ?? "field";
    return res.status(409).json({ message: `A record with that ${field} already exists` });
  }

  // 3) Our own predictable errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // 4) Anything else = unexpected bug. Log it; hide details in production.
  console.error("🔥 Unexpected error:", err);
  return res.status(500).json({
    message: env.NODE_ENV === "production" ? "Internal server error" : String(err),
  });
}
