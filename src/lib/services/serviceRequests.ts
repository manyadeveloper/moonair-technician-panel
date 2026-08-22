export { useServiceData } from "@/providers/service-data-provider";

export {
  getServiceRequests,
  getServiceRequestById as getServiceRequest,
  getTodaysJobs,
  getPriorityRequests,
  getRecentActivityEvents as getRecentActivity,
  getDashboardStats,
  getTechnicianProfile as getTechnician,
} from "@/lib/mock/serviceRequests";

export type { ServiceMutationService } from "@/lib/services/serviceMutations";

export type {
  ServiceRequest,
  ServiceFilters,
  DashboardStats,
  CompleteServicePayload,
  CustomerConfirmation,
  RequiresPartsPayload,
  CustomerUnavailablePayload,
  UnableToResolvePayload,
  ServiceTimelineEvent,
} from "@/types/service";

// TODO: Replace mock implementation with Supabase query.
// Future table: service_requests

// TODO: Persist timeline event to Supabase.
// Future table: service_timeline

// TODO: Upload file to Supabase Storage.
// Future bucket: service-photos
