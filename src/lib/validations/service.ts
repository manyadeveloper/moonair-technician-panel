import { z } from "zod";

export const workPerformedSchema = z.object({
  diagnosis: z.string().min(1, "Diagnosis is required"),
  work_performed: z.string().min(1, "Work performed is required"),
  repair_performed: z.string().optional(),
  testing_performed: z.string().optional(),
  final_observation: z.string().optional(),
  recommendation: z.string().optional(),
});

export type WorkPerformedFormValues = z.infer<typeof workPerformedSchema>;

export const addPartSchema = z.object({
  part_name: z.string().min(1, "Part name is required"),
  part_code: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  action: z.enum(["inspected", "cleaned", "repaired", "replaced", "not_used"]),
  remarks: z.string().max(500).optional(),
});

export type AddPartFormValues = z.infer<typeof addPartSchema>;

export const addNoteSchema = z.object({
  note: z.string().min(1, "Note is required").max(2000),
});

export type AddNoteFormValues = z.infer<typeof addNoteSchema>;

export const completeServiceSchema = z.object({
  final_diagnosis: z.string().min(1, "Please enter the diagnosis."),
  work_performed: z.string().min(1, "Work performed is required"),
  technician_remarks: z.string().min(1, "Technician remarks are required"),
  recommendation: z.string().optional(),
});

export type CompleteServiceFormValues = z.infer<typeof completeServiceSchema>;

export const customerConfirmationSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  satisfied: z.enum(["yes", "no"]),
  remarks: z.string().max(1000).optional(),
});

export type CustomerConfirmationFormValues = z.infer<
  typeof customerConfirmationSchema
>;

export const requiresPartsSchema = z.object({
  part_required: z.string().min(1, "Part required is mandatory"),
  reason: z.string().min(1, "Reason is required"),
  urgency: z.enum(["low", "medium", "high"]),
  technician_remarks: z.string().min(1, "Technician remarks are required"),
});

export type RequiresPartsFormValues = z.infer<typeof requiresPartsSchema>;

export const customerUnavailableSchema = z.object({
  attempted_contact: z.string().min(1, "Attempted contact is required"),
  visit_attempted_at: z.string().min(1, "Visit time is required"),
  technician_remark: z.string().min(1, "Technician remark is required"),
  recommended_next_action: z.string().min(1, "Recommended next action is required"),
});

export type CustomerUnavailableFormValues = z.infer<
  typeof customerUnavailableSchema
>;

export const unableToResolveSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  diagnosis: z.string().min(1, "Please enter the diagnosis."),
  technician_notes: z.string().min(1, "Technician notes are required"),
  recommended_next_action: z.string().min(1, "Recommended next action is required"),
});

export type UnableToResolveFormValues = z.infer<typeof unableToResolveSchema>;
