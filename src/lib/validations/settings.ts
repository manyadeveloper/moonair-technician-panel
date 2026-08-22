import { z } from "zod";

export const notificationSettingsSchema = z.object({
  new_service: z.boolean(),
  urgent_service: z.boolean(),
  schedule_change: z.boolean(),
  reminder: z.boolean(),
});

export type NotificationSettingsFormValues = z.infer<
  typeof notificationSettingsSchema
>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
