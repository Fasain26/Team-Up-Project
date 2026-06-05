import { prisma } from "../config/prisma";

export const skillRepository = {
  // The full catalog, alphabetical — powers the "add skill" dropdown.
  listAll() {
    return prisma.skill.findMany({ orderBy: { name: "asc" } });
  },

  /**
   * Find a skill by name, or create it if new. This is "create-or-connect":
   * the catalog grows organically as users type skills we don't have yet.
   * We normalize on a case-insensitive match so "react" and "React" don't
   * become two rows.
   */
  async findOrCreateByName(rawName: string) {
    const name = rawName.trim();
    const existing = await prisma.skill.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existing) return existing;
    return prisma.skill.create({ data: { name } });
  },

  // Attach a skill to a user (idempotent — ignores duplicates via the
  // composite PK). Returns nothing meaningful; caller re-fetches the profile.
  async addToUser(userId: string, skillId: string) {
    await prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId } },
      create: { userId, skillId },
      update: {},
    });
  },

  async removeFromUser(userId: string, skillId: string) {
    await prisma.userSkill.deleteMany({ where: { userId, skillId } });
  },
};
