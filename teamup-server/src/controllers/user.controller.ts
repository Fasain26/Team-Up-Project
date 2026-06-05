import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const userController = {
  // GET /users/me
  me: asyncHandler(async (req: Request, res: Response) => {
    const profile = await userService.getProfile(req.user!.userId);
    res.json(profile);
  }),

  // GET /users/:id  (public profile)
  getById: asyncHandler(async (req: Request, res: Response) => {
    const profile = await userService.getProfile(String(req.params.id));
    res.json(profile);
  }),

  // PATCH /users/me
  updateMe: asyncHandler(async (req: Request, res: Response) => {
    const profile = await userService.updateProfile(req.user!.userId, req.body);
    res.json(profile);
  }),

  // POST /users/me/avatar  (multipart: field "avatar")
  uploadAvatar: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw AppError.badRequest("No image file provided (field name: 'avatar')");
    const profile = await userService.updateAvatar(req.user!.userId, req.file);
    res.json(profile);
  }),

  // GET /skills  (catalog)
  skillCatalog: asyncHandler(async (_req: Request, res: Response) => {
    const skills = await userService.listSkillCatalog();
    res.json(skills);
  }),

  // POST /users/me/skills  { name }
  addSkill: asyncHandler(async (req: Request, res: Response) => {
    const profile = await userService.addSkill(req.user!.userId, req.body.name);
    res.status(201).json(profile);
  }),

  // DELETE /users/me/skills/:skillId
  removeSkill: asyncHandler(async (req: Request, res: Response) => {
    const profile = await userService.removeSkill(req.user!.userId, String(req.params.skillId));
    res.json(profile);
  }),
};
