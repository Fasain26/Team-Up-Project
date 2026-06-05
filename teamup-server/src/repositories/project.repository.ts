import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

// Lightweight shape for list/cards.
const cardInclude = {
  owner: { select: { id: true, fullName: true, avatarUrl: true, university: true } },
  requiredSkills: { include: { skill: true } },
  _count: { select: { members: true, applications: true } },
} satisfies Prisma.ProjectInclude;

// Full shape for the detail page.
const detailInclude = {
  owner: { select: { id: true, fullName: true, avatarUrl: true, university: true, major: true } },
  requiredSkills: { include: { skill: true } },
  members: {
    include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
  },
  _count: { select: { members: true, applications: true } },
} satisfies Prisma.ProjectInclude;

export const projectRepository = {
  create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({ data, include: detailInclude });
  },

  // Paginated list + total count, run together in one round-trip.
  async findManyPaged(where: Prisma.ProjectWhereInput, opts: {
    skip: number;
    take: number;
    orderBy: Prisma.ProjectOrderByWithRelationInput;
  }) {
    const [items, total] = await prisma.$transaction([
      prisma.project.findMany({ where, include: cardInclude, ...opts }),
      prisma.project.count({ where }),
    ]);
    return { items, total };
  },

  findById(id: string) {
    return prisma.project.findUnique({ where: { id }, include: detailInclude });
  },

  update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({ where: { id }, data, include: detailInclude });
  },

  delete(id: string) {
    return prisma.project.delete({ where: { id } });
  },

  // Replace a project's required-skill links (used on update).
  async setRequiredSkills(projectId: string, skillIds: string[]) {
    await prisma.$transaction([
      prisma.projectSkill.deleteMany({ where: { projectId } }),
      prisma.projectSkill.createMany({
        data: skillIds.map((skillId) => ({ projectId, skillId })),
        skipDuplicates: true,
      }),
    ]);
  },
};
