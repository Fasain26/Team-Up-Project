import "dotenv/config";
import { z } from "zod";

/**
 * Validate environment variables ONCE at startup.
 * If something is missing, we crash immediately with a clear message
 * instead of getting a confusing `undefined` error deep in a request later.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_ACCESS_SECRET: z.string().min(10, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(10, "JWT_REFRESH_SECRET is required"),

  // token lifetimes (string form, e.g. "15m", "7d")
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL: z.string().default("7d"),

  // comma-separated list of allowed frontend origins for CORS
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // z.treeifyError gives a readable picture of what's missing/invalid
  console.error("❌ Invalid environment variables:", z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
