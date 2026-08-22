import type { InspectionOption } from "@/lib/constants/service-status";

export interface InspectionField {
  value: InspectionOption;
  remarks?: string;
}

export interface InspectionData {
  cooling: {
    cooling_performance: InspectionField;
    water_circulation: InspectionField;
    cooling_pads: InspectionField;
    water_pump: InspectionField;
  };
  electrical: {
    motor: InspectionField;
    pump: InspectionField;
    wiring: InspectionField;
    power_supply: InspectionField;
  };
  mechanical: {
    fan: InspectionField;
    louvers: InspectionField;
    wheels: InspectionField;
    noise: InspectionField;
    vibration: InspectionField;
    body: InspectionField;
  };
}

export interface DiagnosisRecord {
  problem_identified: string;
  root_cause: string;
  severity: "minor" | "moderate" | "major" | "critical";
  recommended_action: string;
}

export interface ServiceInspection {
  id: string;
  service_request_id: string;
  technician_id: string;
  inspection_data: InspectionData;
  diagnosis: DiagnosisRecord | null;
  general_notes?: string | null;
  created_at: string;
}
