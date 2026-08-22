"use client";

import { createInitialAppState } from "@/lib/mock/data";
import {
  computeDashboardStats,
  enrichRequest,
  filterServiceRequests,
  getCustomerHistory,
  getProductHistory,
  getRecentActivity,
  getTechnician,
  paginateRequests,
} from "@/lib/mock/helpers";
import { getHistoryRecords } from "@/lib/services/history";
import type { ServiceStatus } from "@/lib/constants/service-status";
import { getStatusTimelineMessage } from "@/lib/constants/status-timeline";
import type { DiagnosisRecord, InspectionData, ServiceInspection } from "@/types/inspection";
import type { Notification } from "@/types/notification";
import type { ServicePart } from "@/types/parts";
import type {
  CompleteServicePayload,
  CustomerConfirmation,
  CustomerUnavailablePayload,
  MockAppState,
  PaginatedResult,
  RequiresPartsPayload,
  ServiceFilters,
  ServiceHistoryEntry,
  ServiceNote,
  ServicePhoto,
  ServiceRequest,
  ServiceTimelineEvent,
  UnableToResolvePayload,
} from "@/types/service";
import type { Technician } from "@/types/technician";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ServiceDataContextValue {
  technician: Technician;
  getServiceRequests: (filters?: ServiceFilters) => ServiceRequest[];
  getServiceRequestsPaginated: (
    filters?: ServiceFilters
  ) => PaginatedResult<ServiceRequest>;
  getServiceRequestById: (id: string) => ServiceRequest | null;
  getServiceHistory: (filters?: ServiceFilters) => ServiceRequest[];
  getServiceHistoryPaginated: (
    filters?: ServiceFilters
  ) => PaginatedResult<ServiceRequest>;
  getDashboardStats: () => ReturnType<typeof computeDashboardStats>;
  getTimeline: (serviceRequestId: string) => ServiceTimelineEvent[];
  getNotes: (serviceRequestId: string) => ServiceNote[];
  getParts: (serviceRequestId: string) => ServicePart[];
  getPhotos: (serviceRequestId: string) => ServicePhoto[];
  getInspection: (serviceRequestId: string) => ServiceInspection | null;
  getNotifications: () => Notification[];
  getUnreadNotificationCount: () => number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getCustomerHistory: (customerId: string) => ServiceHistoryEntry[];
  getProductHistory: (productId: string, modelNumber?: string) => ServiceHistoryEntry[];
  getRecentActivity: () => ServiceTimelineEvent[];
  globalSearch: (query: string) => ServiceRequest[];
  updateServiceStatus: (id: string, status: ServiceStatus) => void;
  saveWorkPerformed: (
    id: string,
    data: {
      diagnosis: string;
      work_performed: string;
      repair_performed?: string;
      testing_performed?: string;
      final_observation: string;
      recommendation: string;
    }
  ) => void;
  saveDiagnosis: (id: string, diagnosis: DiagnosisRecord) => void;
  addNote: (serviceRequestId: string, note: string) => void;
  removeNote: (serviceRequestId: string, noteId: string) => void;
  addPart: (
    serviceRequestId: string,
    part: Omit<ServicePart, "id" | "service_request_id" | "created_at">
  ) => void;
  saveInspection: (
    serviceRequestId: string,
    data: InspectionData,
    generalNotes?: string
  ) => void;
  addPhoto: (
    serviceRequestId: string,
    photo: Omit<ServicePhoto, "id" | "service_request_id" | "technician_id" | "created_at">
  ) => void;
  removePart: (serviceRequestId: string, partId: string) => void;
  updatePart: (
    serviceRequestId: string,
    partId: string,
    data: Omit<ServicePart, "id" | "service_request_id" | "created_at">
  ) => void;
  removePhoto: (serviceRequestId: string, photoId: string) => void;
  completeService: (id: string, payload: CompleteServicePayload) => void;
  saveCustomerConfirmation: (
    id: string,
    confirmation: Omit<CustomerConfirmation, "confirmed_at">
  ) => void;
  markRequiresParts: (id: string, payload: RequiresPartsPayload) => void;
  markCustomerUnavailable: (id: string, payload: CustomerUnavailablePayload) => void;
  markUnableToResolve: (id: string, payload: UnableToResolvePayload) => void;
}

const ServiceDataContext = createContext<ServiceDataContextValue | null>(null);

export function ServiceDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MockAppState>(() => createInitialAppState());
  const technician = getTechnician();

  const addTimelineEvent = useCallback(
    (
      serviceRequestId: string,
      event: Omit<ServiceTimelineEvent, "id" | "service_request_id" | "created_at">
    ) => {
      const newEvent: ServiceTimelineEvent = {
        id: `tl-${Date.now()}`,
        service_request_id: serviceRequestId,
        created_at: new Date().toISOString(),
        ...event,
      };
      setState((prev) => ({
        ...prev,
        timelineEvents: {
          ...prev.timelineEvents,
          [serviceRequestId]: [
            ...(prev.timelineEvents[serviceRequestId] ?? []),
            newEvent,
          ],
        },
      }));
    },
    []
  );

  const value = useMemo<ServiceDataContextValue>(
    () => ({
      technician,

      getServiceRequests: (filters) =>
        filterServiceRequests(state.serviceRequests, filters),

      getServiceRequestsPaginated: (filters) => {
        const filtered = filterServiceRequests(state.serviceRequests, filters);
        return paginateRequests(
          filtered,
          filters?.page ?? 1,
          filters?.pageSize ?? 10
        );
      },

      getServiceRequestById: (id) => {
        const sr = state.serviceRequests.find(
          (s) => s.id === id || s.service_number === id
        );
        return sr ? enrichRequest(sr) : null;
      },

      getServiceHistory: (filters) =>
        getHistoryRecords(state.serviceRequests, filters),

      getServiceHistoryPaginated: (filters) => {
        const filtered = getHistoryRecords(state.serviceRequests, filters);
        return paginateRequests(
          filtered,
          filters?.page ?? 1,
          filters?.pageSize ?? 10
        );
      },

      getDashboardStats: () => computeDashboardStats(state.serviceRequests),

      getTimeline: (serviceRequestId) =>
        state.timelineEvents[serviceRequestId] ?? [],

      getNotes: (serviceRequestId) => state.notes[serviceRequestId] ?? [],

      getParts: (serviceRequestId) => state.parts[serviceRequestId] ?? [],

      getPhotos: (serviceRequestId) => state.photos[serviceRequestId] ?? [],

      getInspection: (serviceRequestId) =>
        state.inspections[serviceRequestId] ?? null,

      getNotifications: () => state.notifications,

      getUnreadNotificationCount: () =>
        state.notifications.filter((n) => !n.read).length,

      markNotificationRead: (id) => {
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllNotificationsRead: () => {
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      getCustomerHistory: (customerId) => getCustomerHistory(customerId),

      getProductHistory: (productId, modelNumber) =>
        getProductHistory(productId, modelNumber),

      getRecentActivity: () => getRecentActivity(state.timelineEvents),

      globalSearch: (query) =>
        filterServiceRequests(state.serviceRequests, { search: query }),

      updateServiceStatus: (id, status) => {
        setState((prev) => ({
          ...prev,
          serviceRequests: prev.serviceRequests.map((sr) =>
            sr.id === id
              ? { ...sr, status, updated_at: new Date().toISOString() }
              : sr
          ),
        }));
        addTimelineEvent(id, {
          technician_id: technician.id,
          event_type: status,
          description: getStatusTimelineMessage(status),
          technician: { name: technician.name },
        });
      },

      saveWorkPerformed: (id, data) => {
        setState((prev) => ({
          ...prev,
          serviceRequests: prev.serviceRequests.map((sr) =>
            sr.id === id
              ? {
                  ...sr,
                  ...data,
                  updated_at: new Date().toISOString(),
                }
              : sr
          ),
        }));
        addTimelineEvent(id, {
          technician_id: technician.id,
          event_type: "work_in_progress",
          description: "Work performed details updated.",
          technician: { name: technician.name },
        });
      },

      addNote: (serviceRequestId, note) => {
        const newNote: ServiceNote = {
          id: `note-${Date.now()}`,
          service_request_id: serviceRequestId,
          technician_id: technician.id,
          note,
          attachment_url: null,
          created_at: new Date().toISOString(),
          technician: {
            name: technician.name,
            technician_code: technician.technician_code,
          },
        };
        setState((prev) => ({
          ...prev,
          notes: {
            ...prev.notes,
            [serviceRequestId]: [...(prev.notes[serviceRequestId] ?? []), newNote],
          },
        }));
        addTimelineEvent(serviceRequestId, {
          technician_id: technician.id,
          event_type: "note",
          description: "Technician note added.",
          technician: { name: technician.name },
        });
      },

      removeNote: (serviceRequestId, noteId) => {
        setState((prev) => ({
          ...prev,
          notes: {
            ...prev.notes,
            [serviceRequestId]: (prev.notes[serviceRequestId] ?? []).filter(
              (n) => n.id !== noteId
            ),
          },
        }));
      },

      addPart: (serviceRequestId, part) => {
        const newPart: ServicePart = {
          id: `part-${Date.now()}`,
          service_request_id: serviceRequestId,
          created_at: new Date().toISOString(),
          ...part,
        };
        setState((prev) => ({
          ...prev,
          parts: {
            ...prev.parts,
            [serviceRequestId]: [...(prev.parts[serviceRequestId] ?? []), newPart],
          },
        }));
        addTimelineEvent(serviceRequestId, {
          technician_id: technician.id,
          event_type: "parts",
          description: `Part added: ${part.part_name}.`,
          technician: { name: technician.name },
        });
      },

      saveDiagnosis: (id, diagnosis) => {
        setState((prev) => {
          const existingInspection = prev.inspections[id];
          return {
            ...prev,
            inspections: existingInspection
              ? {
                  ...prev.inspections,
                  [id]: { ...existingInspection, diagnosis },
                }
              : prev.inspections,
            serviceRequests: prev.serviceRequests.map((sr) =>
              sr.id === id
                ? {
                    ...sr,
                    diagnosis_record: diagnosis,
                    diagnosis: diagnosis.problem_identified,
                    updated_at: new Date().toISOString(),
                  }
                : sr
            ),
          };
        });
        addTimelineEvent(id, {
          technician_id: technician.id,
          event_type: "diagnosis",
          description: "Diagnosis recorded.",
          technician: { name: technician.name },
        });
      },

      saveInspection: (serviceRequestId, data, generalNotes) => {
        setState((prev) => {
          const existingDiagnosis = prev.inspections[serviceRequestId]?.diagnosis ?? null;
          const inspection: ServiceInspection = {
            id: prev.inspections[serviceRequestId]?.id ?? `insp-${Date.now()}`,
            service_request_id: serviceRequestId,
            technician_id: technician.id,
            inspection_data: data,
            diagnosis: existingDiagnosis,
            general_notes: generalNotes ?? null,
            created_at:
              prev.inspections[serviceRequestId]?.created_at ??
              new Date().toISOString(),
          };
          return {
            ...prev,
            inspections: { ...prev.inspections, [serviceRequestId]: inspection },
            serviceRequests: prev.serviceRequests.map((sr) =>
              sr.id === serviceRequestId
                ? { ...sr, updated_at: new Date().toISOString() }
                : sr
            ),
          };
        });
        addTimelineEvent(serviceRequestId, {
          technician_id: technician.id,
          event_type: "inspection",
          description: "Inspection recorded.",
          technician: { name: technician.name },
        });
      },

      addPhoto: (serviceRequestId, photo) => {
        const newPhoto: ServicePhoto = {
          id: `photo-${Date.now()}`,
          service_request_id: serviceRequestId,
          technician_id: technician.id,
          created_at: new Date().toISOString(),
          ...photo,
        };
        setState((prev) => ({
          ...prev,
          photos: {
            ...prev.photos,
            [serviceRequestId]: [...(prev.photos[serviceRequestId] ?? []), newPhoto],
          },
        }));
        addTimelineEvent(serviceRequestId, {
          technician_id: technician.id,
          event_type: "photo",
          description: "Service photo uploaded.",
          technician: { name: technician.name },
        });
      },

      removePart: (serviceRequestId, partId) => {
        setState((prev) => ({
          ...prev,
          parts: {
            ...prev.parts,
            [serviceRequestId]: (prev.parts[serviceRequestId] ?? []).filter(
              (p) => p.id !== partId
            ),
          },
        }));
      },

      updatePart: (serviceRequestId, partId, data) => {
        setState((prev) => ({
          ...prev,
          parts: {
            ...prev.parts,
            [serviceRequestId]: (prev.parts[serviceRequestId] ?? []).map((p) =>
              p.id === partId ? { ...p, ...data } : p
            ),
          },
        }));
        addTimelineEvent(serviceRequestId, {
          technician_id: technician.id,
          event_type: "parts",
          description: `Part updated: ${data.part_name}.`,
          technician: { name: technician.name },
        });
      },

      removePhoto: (serviceRequestId, photoId) => {
        setState((prev) => ({
          ...prev,
          photos: {
            ...prev.photos,
            [serviceRequestId]: (prev.photos[serviceRequestId] ?? []).filter(
              (p) => p.id !== photoId
            ),
          },
        }));
      },

      saveCustomerConfirmation: (id, confirmation) => {
        const record: CustomerConfirmation = {
          ...confirmation,
          confirmed_at: new Date().toISOString(),
        };
        setState((prev) => ({
          ...prev,
          serviceRequests: prev.serviceRequests.map((sr) =>
            sr.id === id
              ? {
                  ...sr,
                  customer_confirmed_at: record.confirmed_at,
                  customer_confirmation: record,
                  customer_comment: confirmation.remarks ?? sr.customer_comment,
                  updated_at: new Date().toISOString(),
                }
              : sr
          ),
        }));
        addTimelineEvent(id, {
          technician_id: technician.id,
          event_type: "customer_confirmation",
          description: "Customer confirmation recorded.",
          technician: { name: technician.name },
        });
      },

      markRequiresParts: (id, payload) => {
        setState((prev) => ({
          ...prev,
          serviceRequests: prev.serviceRequests.map((sr) =>
            sr.id === id
              ? {
                  ...sr,
                  status: "requires_parts" as ServiceStatus,
                  service_outcome: { type: "requires_parts", payload },
                  updated_at: new Date().toISOString(),
                }
              : sr
          ),
        }));
        addTimelineEvent(id, {
          technician_id: technician.id,
          event_type: "requires_parts",
          description: `Requires parts: ${payload.part_required}. Follow-up required.`,
          technician: { name: technician.name },
        });
      },

      markCustomerUnavailable: (id, payload) => {
        setState((prev) => ({
          ...prev,
          serviceRequests: prev.serviceRequests.map((sr) =>
            sr.id === id
              ? {
                  ...sr,
                  status: "customer_not_available" as ServiceStatus,
                  service_outcome: { type: "customer_not_available", payload },
                  updated_at: new Date().toISOString(),
                }
              : sr
          ),
        }));
        addTimelineEvent(id, {
          technician_id: technician.id,
          event_type: "customer_not_available",
          description: "Customer not available during visit.",
          technician: { name: technician.name },
        });
      },

      markUnableToResolve: (id, payload) => {
        setState((prev) => ({
          ...prev,
          serviceRequests: prev.serviceRequests.map((sr) =>
            sr.id === id
              ? {
                  ...sr,
                  status: "unable_to_resolve" as ServiceStatus,
                  diagnosis: payload.diagnosis,
                  service_outcome: { type: "unable_to_resolve", payload },
                  completed_at: new Date().toISOString(),
                  completed_by: technician.id,
                  updated_at: new Date().toISOString(),
                }
              : sr
          ),
        }));
        addTimelineEvent(id, {
          technician_id: technician.id,
          event_type: "unable_to_resolve",
          description: getStatusTimelineMessage("unable_to_resolve"),
          technician: { name: technician.name },
        });
      },

      completeService: (id, payload) => {
        setState((prev) => ({
          ...prev,
          serviceRequests: prev.serviceRequests.map((sr) =>
            sr.id === id
              ? {
                  ...sr,
                  status: payload.final_status,
                  diagnosis: payload.final_diagnosis,
                  work_performed: payload.work_performed,
                  recommendation: payload.recommendation ?? null,
                  customer_comment:
                    payload.customer_feedback ?? sr.customer_comment,
                  completed_at: new Date().toISOString(),
                  completed_by: technician.id,
                  updated_at: new Date().toISOString(),
                }
              : sr
          ),
        }));
        addTimelineEvent(id, {
          technician_id: technician.id,
          event_type: payload.final_status,
          description: getStatusTimelineMessage(payload.final_status),
          technician: { name: technician.name },
        });
      },
    }),
    [state, technician, addTimelineEvent]
  );

  return (
    <ServiceDataContext.Provider value={value}>
      {children}
    </ServiceDataContext.Provider>
  );
}

export function useServiceData() {
  const ctx = useContext(ServiceDataContext);
  if (!ctx) {
    throw new Error("useServiceData must be used within ServiceDataProvider");
  }
  return ctx;
}
