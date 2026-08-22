import { z } from "zod";

export const addPartSchema = z.object({
  part_name: z.string().min(1, "Part name is required").max(120),
  part_code: z.string().max(40).optional(),
  quantity: z.number().min(1, "Quantity must be at least 1").max(99),
  action: z.enum(["inspected", "cleaned", "repaired", "replaced", "not_used"]),
  remarks: z.string().max(200).optional(),
});

export type AddPartFormValues = z.infer<typeof addPartSchema>;
