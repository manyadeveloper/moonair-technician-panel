import { z } from "zod";

const inspectionFieldSchema = z.object({
  value: z.enum(["pass", "issue_found", "not_checked", "replaced"]),
  remarks: z.string().max(500).optional(),
});

export const inspectionSchema = z.object({
  cooling: z.object({
    cooling_performance: inspectionFieldSchema,
    water_circulation: inspectionFieldSchema,
    cooling_pads: inspectionFieldSchema,
    water_pump: inspectionFieldSchema,
  }),
  electrical: z.object({
    motor: inspectionFieldSchema,
    pump: inspectionFieldSchema,
    wiring: inspectionFieldSchema,
    power_supply: inspectionFieldSchema,
  }),
  mechanical: z.object({
    fan: inspectionFieldSchema,
    louvers: inspectionFieldSchema,
    wheels: inspectionFieldSchema,
    noise: inspectionFieldSchema,
    vibration: inspectionFieldSchema,
    body: inspectionFieldSchema,
  }),
  general_notes: z.string().max(1000).optional(),
});

export const diagnosisSchema = z.object({
  problem_identified: z.string().min(1, "Please enter the diagnosis."),
  root_cause: z.string().min(1, "Root cause is required."),
  severity: z.enum(["minor", "moderate", "major", "critical"]),
  recommended_action: z.string().min(1, "Recommended action is required."),
});

export type InspectionFormValues = z.infer<typeof inspectionSchema>;
export type DiagnosisFormValues = z.infer<typeof diagnosisSchema>;
