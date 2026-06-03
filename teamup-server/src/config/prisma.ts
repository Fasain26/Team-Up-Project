import { PrismaClient } from "@prisma/client";

/**
 * Prisma 6 client singleton.
 *
 * Why a singleton? ts-node-dev reloads your code on every save. Without this
 * guard you'd spin up a NEW PrismaClient (and a new DB connection pool) on
 * every reload, eventually exhausting Neon's connection limit. We stash one
 * instance on `globalThis` and reuse it.
 *
 * --- Prisma 7 note ---
 * If you stayed on Prisma 7 instead of downgrading, replace this file with:
 *
 *   import { PrismaClient } from "../generated/prisma/client"; // your output path
 *   import { PrismaPg } from "@prisma/adapter-pg";
 *   const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
 *   ... new PrismaClient({ adapter });
 *
 * and `npm i @prisma/adapter-pg pg`.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
