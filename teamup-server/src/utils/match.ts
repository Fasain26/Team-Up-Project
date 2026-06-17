/**
 * Pure skill-matching logic — no database, no I/O. Keeping it pure makes it
 * trivially unit-testable and lets the service layer stay thin.
 *
 *   score = (matching skills / required skills) * 100
 */

export function normalizeSkillNames(
  skills: Array<{ name: string } | { skill: { name: string } }>
): Set<string> {
  return new Set(
    skills.map((s) => ("skill" in s ? s.skill.name : s.name).toLowerCase().trim())
  );
}

export function computeMatchScore(userSkills: Set<string>, requiredSkillNames: string[]): number {
  if (requiredSkillNames.length === 0) return 0;
  const matched = requiredSkillNames.filter((r) =>
    userSkills.has(r.toLowerCase().trim())
  ).length;
  return Math.round((matched / requiredSkillNames.length) * 100);
}
