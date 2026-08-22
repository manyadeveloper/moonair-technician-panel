import {
  MOCK_LOCATIONS,
  MOCK_PRODUCT_CATEGORIES,
  MOCK_SERVICE_TYPES,
  MOCK_TECHNICIAN,
  customers,
  products,
} from "@/lib/mock/data";
import {
  customerServiceHistory,
  productServiceHistory,
} from "@/lib/mock/serviceHistory";
import { STATUS_LABELS, type ServiceStatus } from "@/lib/constants/service-status";
import type { DiagnosisRecord, InspectionData } from "@/types/inspection";
import type { Notification } from "@/types/notification";
import type {
  DashboardStats,
  PaginatedResult,
  ServiceFilters,
  ServiceHistoryEntry,
  ServiceRequest,
} from "@/types/service";
import type { Technician } from "@/types/technician";

export function enrichRequest(sr: ServiceRequest): ServiceRequest {
  const customer = customers.find((c) => c.id === sr.customer_id);
  const product = products.find((p) => p.id === sr.product_id);
  return { ...sr, customer, product, technician: MOCK_TECHNICIAN };
}

export function filterServiceRequests(
  requests: ServiceRequest[],
  filters?: ServiceFilters
): ServiceRequest[] {
  let results = requests.map(enrichRequest);

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (sr) =>
        sr.service_number.toLowerCase().includes(q) ||
        sr.customer?.name.toLowerCase().includes(q) ||
        sr.customer?.phone.includes(q) ||
        sr.product?.model_name.toLowerCase().includes(q) ||
        sr.product?.model_number.toLowerCase().includes(q) ||
        sr.product?.serial_number.toLowerCase().includes(q) ||
        sr.complaint_type.toLowerCase().includes(q)
    );
  }

  if (filters?.status && filters.status !== "all") {
    results = results.filter((sr) => sr.status === filters.status);
  }

  if (filters?.priority && filters.priority !== "all") {
    results = results.filter((sr) => sr.priority === filters.priority);
  }

  if (filters?.service_type) {
    results = results.filter((sr) => sr.service_type === filters.service_type);
  }

  if (filters?.product_category) {
    results = results.filter(
      (sr) => sr.product?.category === filters.product_category
    );
  }

  if (filters?.location) {
    results = results.filter((sr) => sr.location === filters.location);
  }

  if (filters?.date_from) {
    results = results.filter(
      (sr) => sr.scheduled_date && sr.scheduled_date >= filters.date_from!
    );
  }

  if (filters?.date_to) {
    results = results.filter(
      (sr) => sr.scheduled_date && sr.scheduled_date <= filters.date_to!
    );
  }

  const sort = filters?.sort ?? "newest";
  if (sort === "oldest") {
    results.sort(
      (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
    );
  } else if (sort === "scheduled") {
    results.sort((a, b) =>
      (a.scheduled_date ?? "").localeCompare(b.scheduled_date ?? "")
    );
  } else if (sort === "priority") {
    const order = { urgent: 0, high: 1, medium: 2, low: 3 };
    results.sort((a, b) => order[a.priority] - order[b.priority]);
  } else {
    results.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  return results;
}

export function paginateRequests(
  requests: ServiceRequest[],
  page = 1,
  pageSize = 10
): PaginatedResult<ServiceRequest> {
  const total = requests.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    data: requests.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export function computeDashboardStats(requests: ServiceRequest[]): DashboardStats {
  const today = "2026-08-22";
  const active = requests.filter((sr) => sr.technician_id === MOCK_TECHNICIAN.id);

  const weekStart = "2026-08-18";

  return {
    todayJobs: active.filter((sr) => sr.scheduled_date === today).length,
    pending: active.filter((sr) =>
      ["new", "assigned", "accepted"].includes(sr.status)
    ).length,
    inProgress: active.filter((sr) =>
      [
        "on_the_way",
        "visit_started",
        "inspection",
        "work_in_progress",
        "requires_parts",
      ].includes(sr.status)
    ).length,
    completedToday: active.filter(
      (sr) => sr.status === "completed" && sr.completed_at?.startsWith(today)
    ).length,
    urgent: active.filter(
      (sr) => sr.priority === "urgent" && sr.status !== "completed"
    ).length,
    completedThisWeek: active.filter(
      (sr) =>
        sr.status === "completed" &&
        sr.completed_at &&
        sr.completed_at >= weekStart
    ).length,
    pendingFollowUps: active.filter((sr) =>
      ["requires_parts", "customer_not_available"].includes(sr.status)
    ).length,
    requiresParts: active.filter((sr) => sr.status === "requires_parts").length,
  };
}

export function getTechnician(): Technician {
  return MOCK_TECHNICIAN;
}

export function statusLabel(status: ServiceStatus): string {
  return STATUS_LABELS[status];
}

export function getCustomerHistory(customerId: string): ServiceHistoryEntry[] {
  return customerServiceHistory[customerId] ?? [];
}

export function getProductHistory(
  productId: string,
  modelNumber?: string
): ServiceHistoryEntry[] {
  return [
    ...(productServiceHistory[productId] ?? []),
    ...(modelNumber ? productServiceHistory[modelNumber] ?? [] : []),
  ];
}

export function getRecentActivity(
  timelineEvents: Record<string, import("@/types/service").ServiceTimelineEvent[]>
): import("@/types/service").ServiceTimelineEvent[] {
  return Object.values(timelineEvents)
    .flat()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 8);
}

export function globalSearch(
  requests: ServiceRequest[],
  query: string
): ServiceRequest[] {
  return filterServiceRequests(requests, { search: query });
}

export { MOCK_LOCATIONS, MOCK_SERVICE_TYPES, MOCK_PRODUCT_CATEGORIES };

export type { InspectionData, DiagnosisRecord, Notification };
