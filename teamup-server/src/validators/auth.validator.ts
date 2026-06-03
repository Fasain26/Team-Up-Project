import { z } from "zod";

const currentYear = new Date().getFullYear();

/**
 * Strong-password rule: 8+ chars, at least one lowercase, one uppercase,
 * and one digit. Tweak to taste, but document whatever you choose.
 */
const passwordSchema = z
  .string()
  .min(8, { error: "Password must be at least 8 characters" })
  .regex(/[a-z]/, { error: "Password must contain a lowercase letter" })
  .regex(/[A-Z]/, { error: "Password must contain an uppercase letter" })
  .regex(/[0-9]/, { error: "Password must contain a number" });

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, { error: "Full name is too short" }).max(80),
  email: z.email({ error: "A valid email is required" }).toLowerCase().trim(),
  password: passwordSchema,
  university: z.string().trim().max(120).optional(),
  major: z.string().trim().max(120).optional(),
  graduationYear: z.coerce
    .number()
    .int()
    .min(1950)
    .max(currentYear + 10)
    .optional(),
});

export const loginSchema = z.object({
  email: z.email({ error: "A valid email is required" }).toLowerCase().trim(),
  password: z.string().min(1, { error: "Password is required" }),
});

// Inferred TS types — reuse these in services/controllers so the shape
// stays in sync with validation automatically.
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
