import { JwtPayload } from "../utils/jwt";

/**
 * Tell TypeScript that `req.user` may exist on a Request.
 * Our auth middleware populates it after verifying the access token, so
 * downstream controllers get full type-safety on `req.user.userId`.
 *
 * This file has no runtime output — it only extends Express's types.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
