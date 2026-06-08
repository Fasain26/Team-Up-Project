import { Router } from "express";
import { projectController } from "../controllers/project.controller";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator";
import { applySchema } from "../validators/application.validator";
import { applicationController, matchingController } from "../controllers/application.controller";

const router = Router();

router.use(requireAuth);

router.get("/", projectController.list);
router.post("/", validate(createProjectSchema), projectController.create);
router.get("/:id", projectController.getById);
router.patch("/:id", validate(updateProjectSchema), projectController.update);
router.delete("/:id", projectController.remove);

// --- Day 6: applications + matching (nested under a project) ---
router.post("/:id/apply", validate(applySchema), applicationController.apply);
router.get("/:id/applications", applicationController.forProject);
router.get("/:id/matches", matchingController.projectMatches);
router.get("/:id/my-score", matchingController.myScore);

export default router;
