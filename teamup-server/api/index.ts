import { createApp } from "../src/app";

/**
 * Vercel serverless entry point.
 *
 * Vercel's Node runtime can serve a default-exported Express app directly —
 * it turns each HTTP request into a function invocation and hands it to Express.
 * We reuse the SAME createApp() used locally, so all routes/middleware/auth
 * behave identically. (server.ts is still used for `npm run dev` locally.)
 */
const app = createApp();

export default app;
