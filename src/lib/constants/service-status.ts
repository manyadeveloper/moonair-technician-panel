export const SERVICE_STATUSES = [
  "new",
  "assigned",
  "accepted",
  "on_the_way",
  "visit_started",
  "inspection",
  "work_in_progress",
  "completed",
  "unable_to_resolve",
  "requires_parts",
  "customer_not_available",
  "cancelled",
] as const;

export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export const STATUS_LABELS: Record<ServiceStatus, string> = {
  new: "New",
  assigned: "Assigned",
  accepted: "Accepted",
  on_the_way: "On the Way",
  visit_started: "Visit Started",
  inspection: "Inspection",
  work_in_progress: "Work in Progress",
  completed: "Completed",
  unable_to_resolve: "Unable to Resolve",
  requires_parts: "Requires Parts",
  customer_not_available: "Customer Not Available",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<
  ServiceStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  new: {
    bg: "bg-[#F3F4F6]",
    text: "text-[#374151]",
    border: "border-[#E5E7EB]",
    dot: "bg-[#6B7280]",
  },
  assigned: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    border: "border-[#FDE68A]",
    dot: "bg-[#D97706]",
  },
  accepted: {
    bg: "bg-[#DBEAFE]",
    text: "text-[#1E40AF]",
    border: "border-[#BFDBFE]",
    dot: "bg-[#2563EB]",
  },
  on_the_way: {
    bg: "bg-[#DBEAFE]",
    text: "text-[#1E40AF]",
    border: "border-[#BFDBFE]",
    dot: "bg-[#2563EB]",
  },
  visit_started: {
    bg: "bg-[#DBEAFE]",
    text: "text-[#1E40AF]",
    border: "border-[#BFDBFE]",
    dot: "bg-[#2563EB]",
  },
  inspection: {
    bg: "bg-[#DBEAFE]",
    text: "text-[#1E40AF]",
    border: "border-[#BFDBFE]",
    dot: "bg-[#2563EB]",
  },
  work_in_progress: {
    bg: "bg-[#DBEAFE]",
    text: "text-[#1E40AF]",
    border: "border-[#BFDBFE]",
    dot: "bg-[#2563EB]",
  },
  completed: {
    bg: "bg-[#DCFCE7]",
    text: "text-[#166534]",
    border: "border-[#BBF7D0]",
    dot: "bg-[#16A34A]",
  },
  unable_to_resolve: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#991B1B]",
    border: "border-[#FECACA]",
    dot: "bg-[#DC2626]",
  },
  requires_parts: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    border: "border-[#FDE68A]",
    dot: "bg-[#D97706]",
  },
  customer_not_available: {
    bg: "bg-[#F3F4F6]",
    text: "text-[#374151]",
    border: "border-[#E5E7EB]",
    dot: "bg-[#6B7280]",
  },
  cancelled: {
    bg: "bg-[#F3F4F6]",
    text: "text-[#374151]",
    border: "border-[#E5E7EB]",
    dot: "bg-[#9CA3AF]",
  },
};

export const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
} as const;

export type Priority = keyof typeof PRIORITY_LABELS;

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string }> = {
  low: { bg: "bg-[#F3F4F6]", text: "text-[#374151]" },
  medium: { bg: "bg-[#F3F4F6]", text: "text-[#374151]" },
  high: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
  urgent: { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]" },
};

export const INSPECTION_OPTIONS = ["pass", "issue_found", "not_checked", "replaced"] as const;
export type InspectionOption = (typeof INSPECTION_OPTIONS)[number];

export const INSPECTION_OPTION_LABELS: Record<InspectionOption, string> = {
  pass: "Normal",
  issue_found: "Issue Found",
  not_checked: "Not Checked",
  replaced: "Replaced",
};

export const PHOTO_TYPES = [
  "before_service",
  "during_service",
  "after_service",
  "product_serial",
  "damaged_part",
] as const;

export type PhotoType = (typeof PHOTO_TYPES)[number];

export const PHOTO_TYPE_LABELS: Record<PhotoType, string> = {
  before_service: "Before Service",
  during_service: "During Service",
  after_service: "After Service",
  product_serial: "Product / Serial Number",
  damaged_part: "Damaged Part",
};

export const ACTIVE_STATUSES: ServiceStatus[] = [
  "assigned",
  "accepted",
  "on_the_way",
  "visit_started",
  "inspection",
  "work_in_progress",
  "requires_parts",
];

export const PENDING_STATUSES: ServiceStatus[] = ["new", "assigned"];
