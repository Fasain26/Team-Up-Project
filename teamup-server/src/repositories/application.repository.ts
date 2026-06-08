import { prisma } from "../config/prisma";

const applicantInclude = {
  user: {
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      university: true,
      major: true,
      skills: { include: { skill: true } },
    },
  },
};

const myAppInclude = {
  project: {
    select: { id: true, title: true, category: true, status: true },
  },
};

export const applicationRepository = {
  findByUserAndProject(userId: string, projectId: string) {
    return prisma.application.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
  },

  create(projectId: string, userId: string, message?: string) {
    return prisma.application.create({ data: { projectId, userId, message } });
  },

  findById(id: string) {
    return prisma.application.findUnique({
      where: { id },
      include: { project: { select: { id: true, ownerId: true, maxMembers: true } } },
    });
  },

  listByProject(projectId: string) {
    return prisma.application.findMany({
      where: { projectId },
      include: applicantInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  listByUser(userId: string) {
    return prisma.application.findMany({
      where: { userId },
      include: myAppInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  reject(id: string) {
    return prisma.application.update({ where: { id }, data: { status: "REJECTED" } });
  },

  /**
   * Accept = mark the application ACCEPTED *and* add the applicant as a member,
   * in ONE transaction so we never end up half-done (accepted but not a member).
   */
  acceptAndAddMember(applicationId: string, projectId: string, userId: string) {
    return prisma.$transaction([
      prisma.application.update({ where: { id: applicationId }, data: { status: "ACCEPTED" } }),
      prisma.projectMember.upsert({
        where: { projectId_userId: { projectId, userId } },
        create: { projectId, userId, role: "FULLSTACK_DEVELOPER" },
        update: {},
      }),
    ]);
  },
};
