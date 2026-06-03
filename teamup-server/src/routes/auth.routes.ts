import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { requireAuth } from "../middlewares/auth";
import { authLimiter } from "../middlewares/rateLimiter";
import { registerSchema, loginSchema } from "../validators/auth.validator";

const router = Router();

// Notice the pipeline reads top-to-bottom: rate-limit -> validate -> controller.
router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", requireAuth, authController.logout);

export default router;
