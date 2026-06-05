import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { uploadImage } from "../middlewares/upload";
import { updateProfileSchema, addSkillSchema } from "../validators/user.validator";

const router = Router();

// Everything here requires being logged in.
router.use(requireAuth);

// --- current user ---
router.get("/me", userController.me);
router.patch("/me", validate(updateProfileSchema), userController.updateMe);
router.post("/me/avatar", uploadImage.single("avatar"), userController.uploadAvatar);

// --- current user's skills ---
router.post("/me/skills", validate(addSkillSchema), userController.addSkill);
router.delete("/me/skills/:skillId", userController.removeSkill);

// --- public profile by id (keep AFTER /me so "me" isn't treated as an id) ---
router.get("/:id", userController.getById);

export default router;
