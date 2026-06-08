import { projectRepository } from "../repositories/project.repository";
import { userMatchRepository } from "../repositories/user.repository";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";

/**
 * THE MATCHING FORMULA (from the spec):
 *   score = (matching skills / required skills) * 100
 *
 * "matching" = how many of the project's required skills the user has.
 * A project with no required skills can't be scored, so we return 0.
 * Names are compared case-insensitively.
 */
function scoreFit(userSkillNames: Set<string>, requiredNames: string[]): number {
  if (requiredNames.length === 0) return 0;
  const matched = requiredNames.filter((r) => userSkillNames.has(r.toLowerCase())).length;
  return Math.round((matched / requiredNames.length) * 100);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function skillNameSet(skills: any[]): Set<string> {
  return new Set((skills ?? []).map((s) => (s.skill?.name ?? s.name).toLowerCase()));
}

export const matchingService = {
  /**
   * GET /projects/:id/matches
   * Score every student against this project's required skills. Excludes the
   * owner and existing members. Sorted best-fit first.
   */
  async getProjectMatches(projectId: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) throw AppError.notFound("Project not found");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const required = (project as any).requiredSkills.map((rs: any) => rs.skill.name as string);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const memberIds = new Set((project as any).members.map((m: any) => m.user.id as string));

    const students = await userMatchRepository.listStudentsWithSkills();

    return students
      .filter((u: any) => u.id !== (project as any).ownerId && !memberIds.has(u.id)) // eslint-disable-line @typescript-eslint/no-explicit-any
      .map((u: any) => ({
        user: { id: u.id, fullName: u.fullName, avatarUrl: u.avatarUrl, university: u.university },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        matchScore: scoreFit(skillNameSet((u as any).skills), required),
      }))
      .filter((m: any) => m.matchScore > 0)
      .sort((a: any, b: any) => b.matchScore - a.matchScore)
      .slice(0, 20);
  },

  /**
   * GET /users/me/recommendations
   * Score all OPEN projects against MY skills, best fit first. Excludes my own
   * projects. Returns the project card enriched with a matchScore.
   */
  async getRecommendations(userId: string, limit = 6) {
    const me = await userRepository.findProfileById(userId);
    if (!me) throw AppError.notFound("User not found");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mySkills = skillNameSet((me as any).skills);

    const projects = await projectRepository.listOpenWithSkills();

    return projects
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((p: any) => p.ownerId !== userId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((p: any) => {
        const required = p.requiredSkills.map((rs: any) => rs.skill.name as string); // eslint-disable-line @typescript-eslint/no-explicit-any
        return {
          id: p.id,
          title: p.title,
          category: p.category,
          difficulty: p.difficulty,
          requiredSkills: p.requiredSkills.map((rs: any) => ({ id: rs.skill.id, name: rs.skill.name })), // eslint-disable-line @typescript-eslint/no-explicit-any
          memberCount: p._count?.members ?? 0,
          maxMembers: p.maxMembers,
          matchScore: scoreFit(mySkills, required),
        };
      })
      .sort((a: any, b: any) => b.matchScore - a.matchScore)
      .slice(0, limit);
  },

  /** Score a single project for a single user (used on the detail page). */
  async scoreProjectForUser(projectId: string, userId: string) {
    const [project, me] = await Promise.all([
      projectRepository.findById(projectId),
      userRepository.findProfileById(userId),
    ]);
    if (!project || !me) return { matchScore: 0 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const required = (project as any).requiredSkills.map((rs: any) => rs.skill.name as string);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { matchScore: scoreFit(skillNameSet((me as any).skills), required) };
  },
};
