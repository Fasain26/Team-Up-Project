import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { env } from "./config/env";

export function createApp() {
  const app = express();

  // --- core middleware (ORDER MATTERS) ---

  // CORS: allow our frontend origin(s) and send credentials (cookies).
  const allowedOrigins = env.CLIENT_ORIGIN.split(",").map((o) => o.trim());
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true, // required for the httpOnly refresh cookie
    })
  );

  app.use(express.json()); // parse JSON bodies
  app.use(cookieParser()); // populate req.cookies

  // --- routes ---
  app.use("/api", routes);

  // --- tail middleware (must be LAST) ---
  app.use(notFoundHandler); // 404 for anything unmatched
  app.use(errorHandler); // central error handler (4 args)

  return app;
}
