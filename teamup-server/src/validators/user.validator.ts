import { z } from "zod";

// Treat empty strings as "clear this field" -> null. Otherwise validate URLs.
const optionalUrl = z
  .union([z.url({ error: "Must be a valid URL" }), z.literal("")])
  .optional()
  .transform((v) => (v === "" ? null : v));

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === "" ? null : v));

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(80).optional(),
  bio: optionalText(500),
  university: optionalText(120),
  major: optionalText(120),
  graduationYear: z.coerce.number().int().min(1950).max(2100).optional(),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  websiteUrl: optionalUrl,
  interests: z.array(z.string().trim().min(1)).max(20).optional(),
});

export const addSkillSchema = z.object({
  name: z.string().trim().min(1, { error: "Skill name is required" }).max(40),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddSkillInput = z.infer<typeof addSkillSchema>;
