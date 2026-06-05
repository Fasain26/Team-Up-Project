import { Prisma } from "@prisma/client";
import { projectRepository } from "../repositories/project.repository";
import { skillRepository } from "../repositories/skill.repository";
import { AppError } from "../utils/AppError";
import {
  CreateProjectInput,
  UpdateProjectInput,
  ListProjectsQuery,
} from "../validators/project.validator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCard(p: any) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    difficulty: p.difficulty,
    duration: p.duration,
    status: p.status,
    isRemote: p.isRemote,
    maxMembers: p.maxMembers,
    memberCount: p._count?.members ?? 0,
    applicationCount: p._count?.applications ?? 0,
    owner: p.owner,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requiredSkills: (p.requiredSkills ?? []).map((rs: any) => ({
      id: rs.skill.id,
      name: rs.skill.name,
    })),
    createdAt: p.createdAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDetail(p: any) {
  return {
    ...toCard(p),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    members: (p.members ?? []).map((m: any) => ({
      id: m.id,
      role: m.role,
      user: m.user,
    })),
    ownerId: p.ownerId,
  };
}

// Turn a list of skill NAMES into skill IDs (creating any new ones).
async function resolveSkillIds(names: string[]): Promise<string[]> {
  const ids: string[] = [];
  for (const name of names) {
    const skill = await skillRepository.findOrCreateByName(name);
    ids.push(skill.id);
  }
  return ids;
}

export const projectService = {
  async create(ownerId: string, input: CreateProjectInput) {
    const skillIds = await resolveSkillIds(input.requiredSkills);

    const project = await projectRepository.create({
      title: input.title,
      description: input.description,
      category: input.category,
      difficulty: input.difficulty,
      duration: input.duration,
      maxMembers: input.maxMembers,
      isRemote: input.isRemote,
      owner: { connect: { id: ownerId } },
      requiredSkills: { create: skillIds.map((skillId) => ({ skillId })) },
      // The creator is automatically the LEADER member.
      members: { create: { userId: ownerId, role: "LEADER" } },
    });

    return toDetail(project);
  },

  async list(query: ListProjectsQuery) {
    const where: Prisma.ProjectWhereInput = {};

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } },
      ];
    }
    if (query.category) where.category = query.category;
    if (query.difficulty) where.difficulty = query.difficulty;
    if (query.status) where.status = query.status;
    if (query.isRemote !== undefined) where.isRemote = query.isRemote;
    if (query.skill) {
      where.requiredSkills = {
        some: { skill: { name: { equals: query.skill, mode: "insensitive" } } },
      };
    }

    const { items, total } = await projectRepository.findManyPaged(where, {
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: query.sort === "oldest" ? "asc" : "desc" },
    });

    return {
      items: items.map(toCard),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async getById(id: string) {
    const project = await projectRepository.findById(id);
    if (!project) throw AppError.notFound("Project not found");
    return toDetail(project);
  },

  async update(id: string, userId: string, input: UpdateProjectInput) {
    const existing = await projectRepository.findById(id);
    if (!existing) throw AppError.notFound("Project not found");
    if (existing.ownerId !== userId) throw AppError.forbidden("You don't own this project");

    // Pull requiredSkills out — it needs special handling via the join table.
    const { requiredSkills, ...scalars } = input;

    const updated = await projectRepository.update(id, scalars);

    if (requiredSkills) {
      const skillIds = await resolveSkillIds(requiredSkills);
      await projectRepository.setRequiredSkills(id, skillIds);
      return this.getById(id); // re-fetch with fresh skills
    }

    return toDetail(updated);
  },

  async remove(id: string, userId: string) {
    const existing = await projectRepository.findById(id);
    if (!existing) throw AppError.notFound("Project not found");
    if (existing.ownerId !== userId) throw AppError.forbidden("You don't own this project");
    await projectRepository.delete(id);
  },
};
