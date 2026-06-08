import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { decideSchema } from "../validators/application.validator";
import {
  applicationController,
  dashboardController,
  matchingController,
} from "../controllers/application.controller";

const router = Router();
router.use(requireAuth);

// Applications I've sent / decisions on a single application
router.get("/applications/me", applicationController.mine);
router.patch("/applications/:id", validate(decideSchema), applicationController.decide);

// Recommendations for me + my dashboard
router.get("/users/me/recommendations", matchingController.recommendations);
router.get("/dashboard", dashboardController.me);

export default router;
