import type { ServiceFilters, ServiceRequest } from "@/types/service";
import type { ServiceMutationService } from "@/lib/services/serviceMutations";

export async function getServiceRequestsFromDb(
  filters?: ServiceFilters
): Promise<ServiceRequest[]> {
  void filters;
  throw new Error("Supabase integration is not enabled.");
}

export async function getServiceRequestByIdFromDb(
  id: string
): Promise<ServiceRequest | null> {
  void id;
  throw new Error("Supabase integration is not enabled.");
}

export function createServiceMutationService(): ServiceMutationService {
  throw new Error("Supabase integration is not enabled.");
}
