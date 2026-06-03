import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

/**
 * Validate req.body against a Zod schema BEFORE the controller runs.
 * On success it REPLACES req.body with the parsed (and coerced/trimmed) data,
 * so controllers always receive clean, typed input.
 * On failure it throws the ZodError, which errorHandler turns into a 422.
 *
 * Usage:  router.post("/register", validate(registerSchema), controller.register)
 */
export const validate =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
