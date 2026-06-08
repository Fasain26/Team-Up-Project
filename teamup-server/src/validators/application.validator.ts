import { z } from "zod";

export const applySchema = z.object({
  message: z.string().trim().max(1000).optional(),
});

export const decideSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"]),
});

export type ApplyInput = z.infer<typeof applySchema>;
export type DecideInput = z.infer<typeof decideSchema>;
