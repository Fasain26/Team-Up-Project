import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

/**
 * Repository layer = the ONLY place that talks to Prisma for the User model.
 * Keeps ORM details out of the business logic (separation of concerns).
 */

// Reusable "include" so every profile query returns skills in the same shape.
const profileInclude = {
  skills: { include: { skill: true } },
} satisfies Prisma.UserInclude;

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  // Full profile incl. skills — used by GET /users/me and GET /users/:id
  findProfileById(id: string) {
    return prisma.user.findUnique({ where: { id }, include: profileInclude });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data, include: profileInclude });
  },

  setRefreshToken(userId: string, hashedToken: string | null) {
    return prisma.user.update({ where: { id: userId }, data: { refreshToken: hashedToken } });
  },
};

// Appended Day 6: all students with their skills (for project->user matching).
export const userMatchRepository = {
  listStudentsWithSkills() {
    return prisma.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        university: true,
        major: true,
        skills: { include: { skill: true } },
      },
    });
  },
};
