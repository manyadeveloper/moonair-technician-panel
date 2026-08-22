import {
  filterServiceRequests,
  paginateRequests,
} from "@/lib/mock/helpers";
import type { ServiceFilters, ServiceRequest } from "@/types/service";

// TODO: Replace with Supabase queries during backend integration.

export function getHistoryRecords(
  requests: ServiceRequest[],
  filters?: ServiceFilters
): ServiceRequest[] {
  return filterServiceRequests(requests, filters).filter((sr) =>
    ["completed", "unable_to_resolve", "cancelled"].includes(sr.status)
  );
}

export function getHistoryPaginated(
  requests: ServiceRequest[],
  filters?: ServiceFilters
) {
  const filtered = getHistoryRecords(requests, filters);
  return paginateRequests(
    filtered,
    filters?.page ?? 1,
    filters?.pageSize ?? 10
  );
}

export function isHistoryRecord(request: ServiceRequest): boolean {
  return ["completed", "unable_to_resolve", "cancelled"].includes(
    request.status
  );
}
