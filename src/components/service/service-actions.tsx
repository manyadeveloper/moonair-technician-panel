"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  canTransition,
  getPrimaryTransition,
  isTerminalStatus,
  PRIMARY_ACTION_LABELS,
} from "@/lib/constants/service-workflow";
import { STATUS_LABELS, type ServiceStatus } from "@/lib/constants/service-status";
import {
  completeServiceSchema,
  customerUnavailableSchema,
  requiresPartsSchema,
  unableToResolveSchema,
  type CompleteServiceFormValues,
  type CustomerUnavailableFormValues,
  type RequiresPartsFormValues,
  type UnableToResolveFormValues,
} from "@/lib/validations/service";
import type {
  CompleteServicePayload,
  CustomerUnavailablePayload,
  RequiresPartsPayload,
  ServiceRequest,
  UnableToResolvePayload,
} from "@/types/service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  ClipboardCheck,
  MessageSquarePlus,
  Package,
  Play,
  UserX,
  Wrench,
} from "lucide-react";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useForm } from "react-hook-form";

interface ServiceActionsContextValue {
  request: ServiceRequest;
  loading: boolean;
  isLocked: boolean;
  primaryAction: { label: string; status: ServiceStatus } | null;
  openPrimaryAction: () => void;
  openCompleteModal: () => void;
  openRequiresPartsModal: () => void;
  openCustomerUnavailableModal: () => void;
  openUnableToResolveModal: () => void;
  onScrollTo: (section: string) => void;
}

const ServiceActionsContext = createContext<ServiceActionsContextValue | null>(
  null
);

function useServiceActionsContext() {
  const ctx = useContext(ServiceActionsContext);
  if (!ctx) {
    throw new Error(
      "ServiceActions components must be used within ServiceActionsProvider"
    );
  }
  return ctx;
}

interface ServiceActionsProviderProps {
  request: ServiceRequest;
  onStatusUpdate: (status: ServiceStatus) => Promise<void>;
  onComplete: (payload: CompleteServicePayload) => Promise<void>;
  onRequiresParts: (payload: RequiresPartsPayload) => Promise<void>;
  onCustomerUnavailable: (payload: CustomerUnavailablePayload) => Promise<void>;
  onUnableToResolve: (payload: UnableToResolvePayload) => Promise<void>;
  onScrollTo: (section: string) => void;
  onCompleted?: () => void;
  children: ReactNode;
}

export function ServiceActionsProvider({
  request,
  onStatusUpdate,
  onComplete,
  onRequiresParts,
  onCustomerUnavailable,
  onUnableToResolve,
  onScrollTo,
  onCompleted,
  children,
}: ServiceActionsProviderProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ServiceStatus | null>(
    null
  );
  const [completeOpen, setCompleteOpen] = useState(false);
  const [requiresPartsOpen, setRequiresPartsOpen] = useState(false);
  const [customerUnavailableOpen, setCustomerUnavailableOpen] = useState(false);
  const [unableToResolveOpen, setUnableToResolveOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLocked = isTerminalStatus(request.status);

  const primaryStatus =
    request.status === "requires_parts"
      ? ("work_in_progress" as ServiceStatus)
      : getPrimaryTransition(request.status);

  const primaryAction =
    !isLocked && primaryStatus
      ? {
          label:
            PRIMARY_ACTION_LABELS[request.status] ??
            PRIMARY_ACTION_LABELS[primaryStatus] ??
            `Mark as ${STATUS_LABELS[primaryStatus]}`,
          status: primaryStatus,
        }
      : null;

  const completeForm = useForm<CompleteServiceFormValues>({
    resolver: zodResolver(completeServiceSchema),
    defaultValues: {
      final_diagnosis: request.diagnosis ?? "",
      work_performed: request.work_performed ?? "",
      technician_remarks: "",
      recommendation: request.recommendation ?? "",
    },
  });

  const requiresPartsForm = useForm<RequiresPartsFormValues>({
    resolver: zodResolver(requiresPartsSchema),
    defaultValues: {
      part_required: "",
      reason: "",
      urgency: "medium",
      technician_remarks: "",
    },
  });

  const customerUnavailableForm = useForm<CustomerUnavailableFormValues>({
    resolver: zodResolver(customerUnavailableSchema),
    defaultValues: {
      attempted_contact: "",
      visit_attempted_at: new Date().toISOString().slice(0, 16),
      technician_remark: "",
      recommended_next_action: "",
    },
  });

  const unableToResolveForm = useForm<UnableToResolveFormValues>({
    resolver: zodResolver(unableToResolveSchema),
    defaultValues: {
      reason: "",
      diagnosis: request.diagnosis ?? "",
      technician_notes: "",
      recommended_next_action: "",
    },
  });

  const openTransitionConfirm = (status: ServiceStatus) => {
    if (!canTransition(request.status, status)) return;
    setPendingStatus(status);
    setConfirmOpen(true);
  };

  const handleConfirmTransition = async () => {
    if (!pendingStatus) return;
    setLoading(true);
    try {
      await onStatusUpdate(pendingStatus);
      setConfirmOpen(false);
      setPendingStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (values: CompleteServiceFormValues) => {
    setLoading(true);
    try {
      await onComplete({
        final_diagnosis: values.final_diagnosis,
        work_performed: values.work_performed,
        final_status: "completed",
        technician_remarks: values.technician_remarks,
        recommendation: values.recommendation,
      });
      setCompleteOpen(false);
      onCompleted?.();
    } finally {
      setLoading(false);
    }
  };

  const getConfirmCopy = () => {
    if (!pendingStatus) {
      return { title: "Confirm", description: "", action: "Confirm" };
    }
    const labels: Partial<Record<ServiceStatus, { title: string; description: string; action: string }>> = {
      accepted: {
        title: "Accept Service",
        description: `Accept service request ${request.service_number}?`,
        action: "Accept Job",
      },
      on_the_way: {
        title: "Start Journey",
        description: "Mark yourself as on the way to the customer location?",
        action: "Start Journey",
      },
      visit_started: {
        title: "Start Visit",
        description: "Confirm that you have arrived at the customer location?",
        action: "Start Visit",
      },
      inspection: {
        title: "Start Inspection",
        description: "Begin the product inspection for this service?",
        action: "Start Inspection",
      },
      work_in_progress: {
        title: "Start Work",
        description: "Begin service work on this product?",
        action: "Start Work",
      },
    };
    return (
      labels[pendingStatus] ?? {
        title: "Update Status",
        description: `Update status to ${STATUS_LABELS[pendingStatus]}?`,
        action: STATUS_LABELS[pendingStatus],
      }
    );
  };

  const confirmCopy = getConfirmCopy();

  const contextValue: ServiceActionsContextValue = {
    request,
    loading,
    isLocked,
    primaryAction,
    openPrimaryAction: () => {
      if (!primaryAction) return;
      if (primaryAction.status === "completed") {
        setCompleteOpen(true);
        return;
      }
      openTransitionConfirm(primaryAction.status);
    },
    openCompleteModal: () => setCompleteOpen(true),
    openRequiresPartsModal: () => setRequiresPartsOpen(true),
    openCustomerUnavailableModal: () => setCustomerUnavailableOpen(true),
    openUnableToResolveModal: () => setUnableToResolveOpen(true),
    onScrollTo,
  };

  return (
    <ServiceActionsContext.Provider value={contextValue}>
      {children}

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={confirmCopy.title}
        description={confirmCopy.description}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmTransition} loading={loading}>
              {confirmCopy.action}
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          This will update the service status and record a timeline event.
        </p>
      </Modal>

      <Modal
        open={completeOpen}
        onClose={() => setCompleteOpen(false)}
        title="Complete Service"
        description="Review the service completion summary before submitting."
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setCompleteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={completeForm.handleSubmit(handleComplete)}
              loading={loading}
            >
              Complete Service
            </Button>
          </>
        }
      >
        <div className="mb-4 space-y-2 rounded-lg border border-border bg-background p-4 text-sm">
          <p>
            <span className="text-muted">Customer:</span>{" "}
            <span className="font-medium">{request.customer?.name}</span>
          </p>
          <p>
            <span className="text-muted">Product:</span>{" "}
            <span className="font-medium">{request.product?.model_name}</span>
          </p>
          <p>
            <span className="text-muted">Issue:</span>{" "}
            {request.complaint_type}
          </p>
          <p>
            <span className="text-muted">Customer confirmation:</span>{" "}
            {request.customer_confirmed_at ? "Confirmed" : "Not recorded"}
          </p>
        </div>
        <div className="space-y-4">
          <Textarea
            label="Final Diagnosis *"
            error={completeForm.formState.errors.final_diagnosis?.message}
            rows={2}
            {...completeForm.register("final_diagnosis")}
          />
          <Textarea
            label="Work Performed *"
            error={completeForm.formState.errors.work_performed?.message}
            rows={3}
            {...completeForm.register("work_performed")}
          />
          <Textarea
            label="Technician Remarks *"
            error={completeForm.formState.errors.technician_remarks?.message}
            rows={2}
            {...completeForm.register("technician_remarks")}
          />
          <Textarea
            label="Recommendation (Optional)"
            rows={2}
            {...completeForm.register("recommendation")}
          />
        </div>
      </Modal>

      <Modal
        open={requiresPartsOpen}
        onClose={() => setRequiresPartsOpen(false)}
        title="Parts Required"
        description="Record parts required before this service can continue."
        footer={
          <>
            <Button variant="outline" onClick={() => setRequiresPartsOpen(false)}>
              Cancel
            </Button>
            <Button
              loading={loading}
              onClick={requiresPartsForm.handleSubmit(async (values) => {
                setLoading(true);
                try {
                  await onRequiresParts(values);
                  setRequiresPartsOpen(false);
                  requiresPartsForm.reset();
                } finally {
                  setLoading(false);
                }
              })}
            >
              Mark Requires Parts
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Part Required *"
            error={requiresPartsForm.formState.errors.part_required?.message}
            {...requiresPartsForm.register("part_required")}
          />
          <Textarea
            label="Reason *"
            error={requiresPartsForm.formState.errors.reason?.message}
            rows={2}
            {...requiresPartsForm.register("reason")}
          />
          <Select
            label="Urgency *"
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
            {...requiresPartsForm.register("urgency")}
          />
          <Textarea
            label="Technician Remarks *"
            error={requiresPartsForm.formState.errors.technician_remarks?.message}
            rows={2}
            {...requiresPartsForm.register("technician_remarks")}
          />
        </div>
      </Modal>

      <Modal
        open={customerUnavailableOpen}
        onClose={() => setCustomerUnavailableOpen(false)}
        title="Customer Not Available"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setCustomerUnavailableOpen(false)}
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              onClick={customerUnavailableForm.handleSubmit(async (values) => {
                setLoading(true);
                try {
                  await onCustomerUnavailable(values);
                  setCustomerUnavailableOpen(false);
                } finally {
                  setLoading(false);
                }
              })}
            >
              Record Unavailability
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Attempted Contact *"
            error={customerUnavailableForm.formState.errors.attempted_contact?.message}
            {...customerUnavailableForm.register("attempted_contact")}
          />
          <Input
            label="Visit Attempted At *"
            type="datetime-local"
            error={customerUnavailableForm.formState.errors.visit_attempted_at?.message}
            {...customerUnavailableForm.register("visit_attempted_at")}
          />
          <Textarea
            label="Technician Remark *"
            error={customerUnavailableForm.formState.errors.technician_remark?.message}
            rows={2}
            {...customerUnavailableForm.register("technician_remark")}
          />
          <Textarea
            label="Recommended Next Action *"
            error={
              customerUnavailableForm.formState.errors.recommended_next_action
                ?.message
            }
            rows={2}
            {...customerUnavailableForm.register("recommended_next_action")}
          />
        </div>
      </Modal>

      <Modal
        open={unableToResolveOpen}
        onClose={() => setUnableToResolveOpen(false)}
        title="Unable to Resolve"
        footer={
          <>
            <Button variant="outline" onClick={() => setUnableToResolveOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={loading}
              onClick={unableToResolveForm.handleSubmit(async (values) => {
                setLoading(true);
                try {
                  await onUnableToResolve(values);
                  setUnableToResolveOpen(false);
                } finally {
                  setLoading(false);
                }
              })}
            >
              Mark Unable to Resolve
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Reason *"
            error={unableToResolveForm.formState.errors.reason?.message}
            options={[
              { value: "Major component failure", label: "Major component failure" },
              { value: "Requires specialist", label: "Requires specialist" },
              { value: "Requires replacement unit", label: "Requires replacement unit" },
              { value: "Spare unavailable", label: "Spare unavailable" },
              { value: "Technical issue unresolved", label: "Technical issue unresolved" },
              { value: "Other", label: "Other" },
            ]}
            {...unableToResolveForm.register("reason")}
          />
          <Textarea
            label="Diagnosis *"
            error={unableToResolveForm.formState.errors.diagnosis?.message}
            rows={2}
            {...unableToResolveForm.register("diagnosis")}
          />
          <Textarea
            label="Technician Notes *"
            error={unableToResolveForm.formState.errors.technician_notes?.message}
            rows={2}
            {...unableToResolveForm.register("technician_notes")}
          />
          <Textarea
            label="Recommended Next Action *"
            error={
              unableToResolveForm.formState.errors.recommended_next_action?.message
            }
            rows={2}
            {...unableToResolveForm.register("recommended_next_action")}
          />
        </div>
      </Modal>
    </ServiceActionsContext.Provider>
  );
}

export function ServiceActionsToolbar() {
  const {
    isLocked,
    primaryAction,
    loading,
    openPrimaryAction,
    openCompleteModal,
    openRequiresPartsModal,
    openCustomerUnavailableModal,
    openUnableToResolveModal,
    request,
  } = useServiceActionsContext();

  if (isLocked) return null;

  const showAlternatives = ["visit_started", "work_in_progress", "requires_parts"].includes(
    request.status
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {primaryAction && (
        <Button onClick={openPrimaryAction} loading={loading}>
          <Play className="h-3.5 w-3.5" />
          {primaryAction.label}
        </Button>
      )}
      {(request.status === "requires_parts") && (
        <Button variant="secondary" onClick={openCompleteModal}>
          <CheckCircle className="h-3.5 w-3.5" />
          Complete Service
        </Button>
      )}
      {showAlternatives && (
        <>
          {(request.status === "work_in_progress" ||
            request.status === "requires_parts") && (
            <Button variant="outline" onClick={openRequiresPartsModal}>
              <Package className="h-3.5 w-3.5" />
              Requires Parts
            </Button>
          )}
          {request.status === "visit_started" && (
            <Button variant="outline" onClick={openCustomerUnavailableModal}>
              <UserX className="h-3.5 w-3.5" />
              Customer Not Available
            </Button>
          )}
          {(request.status === "work_in_progress" ||
            request.status === "requires_parts") && (
            <Button variant="outline" onClick={openUnableToResolveModal}>
              <AlertTriangle className="h-3.5 w-3.5" />
              Unable to Resolve
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export function ServiceActionsQuick() {
  const { isLocked, onScrollTo } = useServiceActionsContext();

  if (isLocked) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => onScrollTo("inspection")}>
          <ClipboardCheck className="h-3.5 w-3.5" />
          Record Inspection
        </Button>
        <Button variant="outline" size="sm" onClick={() => onScrollTo("notes")}>
          <MessageSquarePlus className="h-3.5 w-3.5" />
          Add Note
        </Button>
        <Button variant="outline" size="sm" onClick={() => onScrollTo("parts")}>
          <Package className="h-3.5 w-3.5" />
          Add Part
        </Button>
        <Button variant="outline" size="sm" onClick={() => onScrollTo("photos")}>
          <Camera className="h-3.5 w-3.5" />
          Upload Photo
        </Button>
        <Button variant="outline" size="sm" onClick={() => onScrollTo("work")}>
          <Wrench className="h-3.5 w-3.5" />
          Work Performed
        </Button>
      </div>
    </Card>
  );
}

export { useServiceActionsContext };
