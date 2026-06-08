import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import projectRoutes from "./project.routes";
import engagementRoutes from "./engagement.routes";
import { userController } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth";

/**
 * Single place where feature routers get mounted.
 */
const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

// Skills catalog is a top-level read (still requires auth).
router.get("/skills", requireAuth, userController.skillCatalog);

router.use("/projects", projectRoutes);
router.use("/", engagementRoutes); // /applications/me, /dashboard, /users/me/recommendations

export default router;
