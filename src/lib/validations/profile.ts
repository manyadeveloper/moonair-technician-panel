import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required").max(80),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Enter a valid email"),
  address: z.string().max(200).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
