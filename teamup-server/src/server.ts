import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

/**
 * We keep `createApp()` separate from the listen() call so tests can import
 * the app and hit it with supertest WITHOUT opening a real port.
 */
const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 API running on http://localhost:${env.PORT}/api`);
  console.log(`   Health check: http://localhost:${env.PORT}/api/health`);
});

// Graceful shutdown: close DB connections so we don't leak them on restart.
async function shutdown(signal: string) {
  console.log(`\n${signal} received — shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
