import { applicationRepository } from "../repositories/application.repository";
import { projectRepository } from "../repositories/project.repository";
import { AppError } from "../utils/AppError";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toApplicant(a: any) {
  return {
    id: a.id,
    message: a.message,
    status: a.status,
    createdAt: a.createdAt,
    user: {
      id: a.user.id,
      fullName: a.user.fullName,
      avatarUrl: a.user.avatarUrl,
      university: a.user.university,
      major: a.user.major,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      skills: (a.user.skills ?? []).map((us: any) => ({ id: us.skill.id, name: us.skill.name })),
    },
  };
}

export const applicationService = {
  async apply(projectId: string, userId: string, message?: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw AppError.notFound("Project not found");
    if (project.ownerId === userId) throw AppError.badRequest("You can't apply to your own project");
    if (project.status !== "OPEN") throw AppError.badRequest("This project isn't accepting applications");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const alreadyMember = (project as any).members.some((m: any) => m.user.id === userId);
    if (alreadyMember) throw AppError.badRequest("You're already on this team");

    const existing = await applicationRepository.findByUserAndProject(userId, projectId);
    if (existing) throw AppError.conflict("You've already applied to this project");

    return applicationRepository.create(projectId, userId, message);
  },

  async listMine(userId: string) {
    return applicationRepository.listByUser(userId);
  },

  async listForProject(projectId: string, requesterId: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw AppError.notFound("Project not found");
    if (project.ownerId !== requesterId)
      throw AppError.forbidden("Only the project owner can view applicants");
    const apps = await applicationRepository.listByProject(projectId);
    return apps.map(toApplicant);
  },

  async decide(applicationId: string, requesterId: string, decision: "ACCEPTED" | "REJECTED") {
    const app = await applicationRepository.findById(applicationId);
    if (!app) throw AppError.notFound("Application not found");
    if (app.project.ownerId !== requesterId)
      throw AppError.forbidden("Only the project owner can decide on applications");
    if (app.status !== "PENDING")
      throw AppError.badRequest(`This application is already ${app.status.toLowerCase()}`);

    if (decision === "REJECTED") {
      await applicationRepository.reject(applicationId);
      return { status: "REJECTED" as const };
    }

    await applicationRepository.acceptAndAddMember(applicationId, app.projectId, app.userId);
    return { status: "ACCEPTED" as const };
  },
};
