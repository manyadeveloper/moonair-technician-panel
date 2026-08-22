import type { ServiceStatus } from "@/lib/constants/service-status";

export const WORKFLOW_PROGRESS_STEPS: ServiceStatus[] = [
  "assigned",
  "accepted",
  "on_the_way",
  "visit_started",
  "inspection",
  "work_in_progress",
  "completed",
];

export const TERMINAL_STATUSES: ServiceStatus[] = [
  "completed",
  "unable_to_resolve",
  "cancelled",
  "customer_not_available",
];

export const PAUSED_STATUSES: ServiceStatus[] = ["requires_parts"];

const VALID_TRANSITIONS: Partial<Record<ServiceStatus, ServiceStatus[]>> = {
  assigned: ["accepted"],
  accepted: ["on_the_way"],
  on_the_way: ["visit_started"],
  visit_started: ["inspection", "customer_not_available"],
  inspection: ["work_in_progress"],
  work_in_progress: ["completed", "requires_parts", "unable_to_resolve"],
  requires_parts: ["work_in_progress", "completed", "unable_to_resolve"],
};

export function getValidNextStatuses(status: ServiceStatus): ServiceStatus[] {
  return VALID_TRANSITIONS[status] ?? [];
}

export function canTransition(from: ServiceStatus, to: ServiceStatus): boolean {
  return getValidNextStatuses(from).includes(to);
}

export function isTerminalStatus(status: ServiceStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function isWorkflowLocked(status: ServiceStatus): boolean {
  return isTerminalStatus(status) || status === "requires_parts";
}

export function getPrimaryTransition(
  status: ServiceStatus
): ServiceStatus | null {
  const next = VALID_TRANSITIONS[status];
  if (!next?.length) return null;
  return next[0];
}

export const PRIMARY_ACTION_LABELS: Partial<Record<ServiceStatus, string>> = {
  assigned: "Accept Job",
  accepted: "Start Journey",
  on_the_way: "Start Visit",
  visit_started: "Start Inspection",
  inspection: "Start Work",
  work_in_progress: "Complete Service",
  requires_parts: "Resume Work",
};

export const CONFIRMATION_REQUIRED: ServiceStatus[] = [
  "accepted",
  "visit_started",
  "completed",
  "unable_to_resolve",
  "customer_not_available",
];

export function getWorkflowStepIndex(status: ServiceStatus): number {
  if (status === "requires_parts") {
    return WORKFLOW_PROGRESS_STEPS.indexOf("work_in_progress");
  }
  if (status === "unable_to_resolve" || status === "customer_not_available") {
    return WORKFLOW_PROGRESS_STEPS.indexOf("visit_started");
  }
  const idx = WORKFLOW_PROGRESS_STEPS.indexOf(status);
  return idx >= 0 ? idx : 0;
}
