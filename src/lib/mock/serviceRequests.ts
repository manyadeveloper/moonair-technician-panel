import { createInitialAppState } from "@/lib/mock/data";
import {
  computeDashboardStats,
  enrichRequest,
  filterServiceRequests,
  getRecentActivity,
  getTechnician,
} from "@/lib/mock/helpers";
import type {
  DashboardStats,
  ServiceFilters,
  ServiceRequest,
  ServiceTimelineEvent,
} from "@/types/service";
import type { Technician } from "@/types/technician";

const TODAY = "2026-08-22";

function getState() {
  return createInitialAppState();
}

export function getServiceRequests(filters?: ServiceFilters): ServiceRequest[] {
  return filterServiceRequests(getState().serviceRequests, filters);
}

export function getServiceRequestById(id: string): ServiceRequest | null {
  const sr = getState().serviceRequests.find(
    (s) => s.id === id || s.service_number === id
  );
  return sr ? enrichRequest(sr) : null;
}

export function getTodaysJobs(): ServiceRequest[] {
  return filterServiceRequests(getState().serviceRequests).filter(
    (sr) => sr.scheduled_date === TODAY && sr.status !== "completed"
  );
}

export function getPriorityRequests(): ServiceRequest[] {
  return filterServiceRequests(getState().serviceRequests).filter(
    (sr) =>
      ["urgent", "high"].includes(sr.priority) && sr.status !== "completed"
  );
}

export function getRecentActivityEvents(): ServiceTimelineEvent[] {
  return getRecentActivity(getState().timelineEvents);
}

export function getDashboardStats(): DashboardStats {
  return computeDashboardStats(getState().serviceRequests);
}

export function getTechnicianProfile(): Technician {
  return getTechnician();
}
