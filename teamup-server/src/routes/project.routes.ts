import { Router } from "express";
import { projectController } from "../controllers/project.controller";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator";

const router = Router();

router.use(requireAuth);

router.get("/", projectController.list);
router.post("/", validate(createProjectSchema), projectController.create);
router.get("/:id", projectController.getById);
router.patch("/:id", validate(updateProjectSchema), projectController.update);
router.delete("/:id", projectController.remove);

export default router;
