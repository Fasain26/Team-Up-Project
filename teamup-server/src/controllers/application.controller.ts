import { Request, Response } from "express";
import { applicationService } from "../services/application.service";
import { matchingService } from "../services/matching.service";
import { dashboardService } from "../services/dashboard.service";
import { asyncHandler } from "../utils/asyncHandler";

export const applicationController = {
  // POST /projects/:id/apply
  apply: asyncHandler(async (req: Request, res: Response) => {
    const app = await applicationService.apply(
      String(req.params.id),
      req.user!.userId,
      req.body.message
    );
    res.status(201).json(app);
  }),

  // GET /applications/me
  mine: asyncHandler(async (req: Request, res: Response) => {
    res.json(await applicationService.listMine(req.user!.userId));
  }),

  // GET /projects/:id/applications  (owner)
  forProject: asyncHandler(async (req: Request, res: Response) => {
    res.json(await applicationService.listForProject(String(req.params.id), req.user!.userId));
  }),

  // PATCH /applications/:id  { status }
  decide: asyncHandler(async (req: Request, res: Response) => {
    const result = await applicationService.decide(
      String(req.params.id),
      req.user!.userId,
      req.body.status
    );
    res.json(result);
  }),
};

export const matchingController = {
  // GET /projects/:id/matches
  projectMatches: asyncHandler(async (req: Request, res: Response) => {
    res.json(await matchingService.getProjectMatches(String(req.params.id)));
  }),

  // GET /projects/:id/my-score
  myScore: asyncHandler(async (req: Request, res: Response) => {
    res.json(await matchingService.scoreProjectForUser(String(req.params.id), req.user!.userId));
  }),

  // GET /users/me/recommendations
  recommendations: asyncHandler(async (req: Request, res: Response) => {
    res.json(await matchingService.getRecommendations(req.user!.userId));
  }),
};

export const dashboardController = {
  // GET /dashboard
  me: asyncHandler(async (req: Request, res: Response) => {
    res.json(await dashboardService.getStudentDashboard(req.user!.userId));
  }),
};
