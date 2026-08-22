import type { ServiceStatus } from "@/lib/constants/service-status";
import type { DiagnosisRecord, InspectionData } from "@/types/inspection";
import type { ServicePart } from "@/types/parts";
import type {
  CompleteServicePayload,
  CustomerConfirmation,
  CustomerUnavailablePayload,
  RequiresPartsPayload,
  ServicePhoto,
  ServiceRequest,
  UnableToResolvePayload,
} from "@/types/service";

export interface ServiceMutationService {
  getServiceRequest(id: string): Promise<ServiceRequest | null>;
  updateServiceStatus(id: string, status: ServiceStatus): Promise<ServiceRequest>;
  saveInspection(
    id: string,
    data: InspectionData,
    generalNotes?: string
  ): Promise<void>;
  saveDiagnosis(id: string, diagnosis: DiagnosisRecord): Promise<void>;
  saveWorkPerformed(
    id: string,
    data: {
      diagnosis: string;
      work_performed: string;
      repair_performed?: string;
      testing_performed?: string;
      final_observation: string;
      recommendation: string;
    }
  ): Promise<void>;
  addServicePart(
    id: string,
    part: Omit<ServicePart, "id" | "service_request_id" | "created_at">
  ): Promise<void>;
  removeServicePart(id: string, partId: string): Promise<void>;
  addServicePhoto(
    id: string,
    photo: Omit<ServicePhoto, "id" | "service_request_id" | "technician_id" | "created_at">
  ): Promise<void>;
  addServiceNote(id: string, note: string): Promise<void>;
  saveCustomerConfirmation(
    id: string,
    confirmation: Omit<CustomerConfirmation, "confirmed_at">
  ): Promise<void>;
  completeService(id: string, payload: CompleteServicePayload): Promise<ServiceRequest>;
  markRequiresParts(id: string, payload: RequiresPartsPayload): Promise<ServiceRequest>;
  markCustomerUnavailable(
    id: string,
    payload: CustomerUnavailablePayload
  ): Promise<ServiceRequest>;
  markUnableToResolve(
    id: string,
    payload: UnableToResolvePayload
  ): Promise<ServiceRequest>;
  getCustomerServiceHistory(customerId: string): Promise<import("@/types/service").ServiceHistoryEntry[]>;
  getProductServiceHistory(
    productId: string,
    modelNumber?: string
  ): Promise<import("@/types/service").ServiceHistoryEntry[]>;
}
