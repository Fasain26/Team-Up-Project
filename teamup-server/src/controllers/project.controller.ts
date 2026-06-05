import { Request, Response } from "express";
import { projectService } from "../services/project.service";
import { asyncHandler } from "../utils/asyncHandler";
import { listProjectsSchema } from "../validators/project.validator";

export const projectController = {
  // POST /projects
  create: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.create(req.user!.userId, req.body);
    res.status(201).json(project);
  }),

  // GET /projects?q=&category=&page=&limit=&sort=...
  list: asyncHandler(async (req: Request, res: Response) => {
    // Query params are validated/coerced HERE (Express 5 makes req.query
    // read-only, so we can't use the body-validation middleware for it).
    const query = listProjectsSchema.parse(req.query);
    const result = await projectService.list(query);
    res.json(result);
  }),

  // GET /projects/:id
  getById: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.getById(String(req.params.id));
    res.json(project);
  }),

  // PATCH /projects/:id
  update: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.update(
      String(req.params.id),
      req.user!.userId,
      req.body
    );
    res.json(project);
  }),

  // DELETE /projects/:id
  remove: asyncHandler(async (req: Request, res: Response) => {
    await projectService.remove(String(req.params.id), req.user!.userId);
    res.status(204).send();
  }),
};
