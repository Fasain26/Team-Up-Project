import { describe, it, expect } from "vitest";
import { computeMatchScore, normalizeSkillNames } from "../utils/match";

describe("computeMatchScore", () => {
  it("returns the spec example: 2 of 3 required skills = 67%", () => {
    const userSkills = normalizeSkillNames([{ name: "React" }, { name: "PostgreSQL" }]);
    const required = ["React", "Node.js", "PostgreSQL"];
    expect(computeMatchScore(userSkills, required)).toBe(67);
  });

  it("returns 100 when the user has every required skill", () => {
    const userSkills = normalizeSkillNames([{ name: "React" }, { name: "Node.js" }]);
    expect(computeMatchScore(userSkills, ["React", "Node.js"])).toBe(100);
  });

  it("returns 0 when there are no overlapping skills", () => {
    const userSkills = normalizeSkillNames([{ name: "Python" }]);
    expect(computeMatchScore(userSkills, ["React", "Vue"])).toBe(0);
  });

  it("returns 0 when the project requires no skills (not scoreable)", () => {
    const userSkills = normalizeSkillNames([{ name: "React" }]);
    expect(computeMatchScore(userSkills, [])).toBe(0);
  });

  it("is case-insensitive", () => {
    const userSkills = normalizeSkillNames([{ name: "react" }]);
    expect(computeMatchScore(userSkills, ["REACT"])).toBe(100);
  });

  it("accepts the nested { skill: { name } } shape from Prisma includes", () => {
    const userSkills = normalizeSkillNames([{ skill: { name: "React" } }]);
    expect(computeMatchScore(userSkills, ["React"])).toBe(100);
  });
});
