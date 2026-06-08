import { prisma } from "../config/prisma";
import { matchingService } from "./matching.service";

export const dashboardService = {
  async getStudentDashboard(userId: string) {
    // Run the independent counts together.
    const [projectsJoined, applicationsSent, pendingApplications, projectsOwned, recentApps] =
      await Promise.all([
        prisma.projectMember.count({ where: { userId } }),
        prisma.application.count({ where: { userId } }),
        prisma.application.count({ where: { userId, status: "PENDING" } }),
        prisma.project.count({ where: { ownerId: userId } }),
        prisma.application.findMany({
          where: { userId },
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { project: { select: { id: true, title: true } } },
        }),
      ]);

    const recommendations = await matchingService.getRecommendations(userId, 3);

    return {
      stats: { projectsJoined, applicationsSent, pendingApplications, projectsOwned },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentApplications: recentApps.map((a: any) => ({
        id: a.id,
        status: a.status,
        project: a.project,
        createdAt: a.createdAt,
      })),
      recommendations,
    };
  },
};
