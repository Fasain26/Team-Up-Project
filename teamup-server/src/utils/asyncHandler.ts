import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler so any thrown error / rejected promise is
 * passed to next() and reaches our central error handler.
 *
 * Express 5 actually forwards rejected promises automatically, so this is
 * partly belt-and-suspenders — but it makes the intent explicit and keeps
 * the code identical if you ever run on Express 4.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
