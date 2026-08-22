import type { Priority, PhotoType, ServiceStatus } from "@/lib/constants/service-status";
import type { Customer } from "@/types/customer";
import type { DiagnosisRecord } from "@/types/inspection";
import type { Product } from "@/types/product";
import type { Technician } from "@/types/technician";

export type { PhotoType, Priority, ServiceStatus };

export interface ServiceRequest {
  id: string;
  service_number: string;
  customer_id: string;
  product_id: string;
  technician_id: string | null;
  complaint_type: string;
  complaint_category: string;
  complaint_description: string;
  customer_notes: string | null;
  previous_complaint: string | null;
  service_type: string;
  priority: Priority;
  status: ServiceStatus;
  scheduled_date: string | null;
  scheduled_time?: string | null;
  location: string | null;
  diagnosis: string | null;
  diagnosis_record?: DiagnosisRecord | null;
  work_performed: string | null;
  repair_performed?: string | null;
  testing_performed?: string | null;
  final_observation: string | null;
  recommendation: string | null;
  customer_rating?: number | null;
  customer_comment?: string | null;
  customer_confirmed_at?: string | null;
  customer_confirmation?: CustomerConfirmation | null;
  completed_by?: string | null;
  service_outcome?: ServiceOutcome | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  customer?: Customer;
  product?: Product;
  technician?: Technician;
}

export interface ServiceNote {
  id: string;
  service_request_id: string;
  technician_id: string;
  note: string;
  attachment_url: string | null;
  created_at: string;
  technician?: Pick<Technician, "name" | "technician_code">;
}

export interface ServicePhoto {
  id: string;
  service_request_id: string;
  technician_id: string;
  photo_url: string;
  photo_type: PhotoType;
  file_name?: string | null;
  created_at: string;
}

export interface ServiceTimelineEvent {
  id: string;
  service_request_id: string;
  technician_id: string | null;
  event_type: string;
  description: string;
  created_at: string;
  technician?: Pick<Technician, "name">;
}

export interface ServiceHistoryEntry {
  id: string;
  service_number: string;
  customer_id: string;
  product_id: string;
  service_date: string;
  complaint_type: string;
  work_performed: string;
  final_status: ServiceStatus;
  parts_summary?: string;
}

export interface ServiceFilters {
  search?: string;
  status?: ServiceStatus | "all";
  priority?: Priority | "all";
  service_type?: string;
  product_category?: string;
  date_from?: string;
  date_to?: string;
  assigned?: "assigned" | "unassigned" | "all";
  location?: string;
  sort?: "newest" | "oldest" | "priority" | "scheduled";
  page?: number;
  pageSize?: number;
}

export interface DashboardStats {
  todayJobs: number;
  pending: number;
  inProgress: number;
  completedToday: number;
  urgent: number;
  completedThisWeek: number;
  pendingFollowUps: number;
  requiresParts: number;
}

export interface CompleteServicePayload {
  final_diagnosis: string;
  work_performed: string;
  final_status: ServiceStatus;
  technician_remarks: string;
  customer_feedback?: string;
  recommendation?: string;
}

export interface CustomerConfirmation {
  customer_name: string;
  satisfied: boolean;
  remarks?: string | null;
  signature_recorded?: boolean;
  confirmed_at: string;
}

export interface RequiresPartsPayload {
  part_required: string;
  reason: string;
  urgency: "low" | "medium" | "high";
  technician_remarks: string;
}

export interface CustomerUnavailablePayload {
  attempted_contact: string;
  visit_attempted_at: string;
  technician_remark: string;
  recommended_next_action: string;
}

export interface UnableToResolvePayload {
  reason: string;
  diagnosis: string;
  technician_notes: string;
  recommended_next_action: string;
}

export type ServiceOutcome =
  | { type: "requires_parts"; payload: RequiresPartsPayload }
  | { type: "customer_not_available"; payload: CustomerUnavailablePayload }
  | { type: "unable_to_resolve"; payload: UnableToResolvePayload };

export interface MockAppState {
  serviceRequests: ServiceRequest[];
  timelineEvents: Record<string, ServiceTimelineEvent[]>;
  notes: Record<string, ServiceNote[]>;
  parts: Record<string, import("@/types/parts").ServicePart[]>;
  photos: Record<string, ServicePhoto[]>;
  inspections: Record<string, import("@/types/inspection").ServiceInspection>;
  notifications: import("@/types/notification").Notification[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
