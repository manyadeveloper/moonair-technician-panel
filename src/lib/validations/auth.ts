import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Technician ID or email is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
