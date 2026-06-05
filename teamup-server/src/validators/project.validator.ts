import { z } from "zod";

// Keep enums in sync with the Prisma schema.
const categoryEnum = z.enum([
  "STARTUP",
  "HACKATHON",
  "COMPETITION",
  "RESEARCH",
  "THESIS",
  "OPEN_SOURCE",
]);
const difficultyEnum = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);
const statusEnum = z.enum(["OPEN", "IN_PROGRESS", "COMPLETED"]);

export const createProjectSchema = z.object({
  title: z.string().trim().min(3, { error: "Title is too short" }).max(120),
  description: z.string().trim().min(10, { error: "Describe your project a bit more" }).max(5000),
  category: categoryEnum,
  difficulty: difficultyEnum,
  duration: z.string().trim().max(60).optional(),
  maxMembers: z.coerce.number().int().min(1).max(50).default(5),
  isRemote: z.boolean().default(false),
  requiredSkills: z.array(z.string().trim().min(1)).max(20).default([]),
});

// All fields optional for PATCH. status is editable here (e.g. mark COMPLETED).
export const updateProjectSchema = createProjectSchema.partial().extend({
  status: statusEnum.optional(),
});

/**
 * Query params arrive as strings, so we coerce. isRemote needs special care:
 * z.coerce.boolean() would turn the string "false" into `true` (any non-empty
 * string is truthy), so we map it explicitly.
 */
export const listProjectsSchema = z.object({
  q: z.string().trim().optional(),
  category: categoryEnum.optional(),
  difficulty: difficultyEnum.optional(),
  status: statusEnum.optional(),
  skill: z.string().trim().optional(),
  isRemote: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  sort: z.enum(["newest", "oldest"]).default("newest"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ListProjectsQuery = z.infer<typeof listProjectsSchema>;
