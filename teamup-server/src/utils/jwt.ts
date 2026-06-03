import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

/**
 * The data we embed inside the JWT. Keep it SMALL — it travels on every
 * request and is only base64-encoded, not encrypted. Never put secrets here.
 */
export interface JwtPayload {
  userId: string;
  role: string;
}

type Ttl = SignOptions["expiresIn"];

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL as Ttl,
  });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_TTL as Ttl,
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  // throws if invalid/expired — caller decides how to handle
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}
