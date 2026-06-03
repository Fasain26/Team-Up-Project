import { Router } from "express";
import authRoutes from "./auth.routes";

/**
 * The single place where feature routers get mounted. As you add modules
 * (users, projects, applications...) you register them here, and app.ts
 * stays clean.
 */
const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

router.use("/auth", authRoutes);
// router.use("/users", userRoutes);       <- Day 3/4
// router.use("/projects", projectRoutes);  <- Day 5

export default router;
