import type { ServiceStatus } from "@/lib/constants/service-status";
import { STATUS_LABELS } from "@/lib/constants/service-status";

export const STATUS_TIMELINE_MESSAGES: Partial<Record<ServiceStatus, string>> = {
  accepted: "Job accepted",
  on_the_way: "Technician on the way",
  visit_started: "Visit started",
  inspection: "Inspection in progress",
  work_in_progress: "Work in progress",
  completed: "Service completed",
  unable_to_resolve: "Marked as unable to resolve",
  requires_parts: "Requires parts",
  customer_not_available: "Customer not available",
  cancelled: "Service cancelled",
};

export function getStatusTimelineMessage(status: ServiceStatus): string {
  return STATUS_TIMELINE_MESSAGES[status] ?? `Status updated to ${STATUS_LABELS[status]}`;
}
