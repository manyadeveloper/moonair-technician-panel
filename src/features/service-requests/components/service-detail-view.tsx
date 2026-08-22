"use client";

import { DiagnosisSection } from "@/components/service/diagnosis-section";
import { CustomerConfirmation } from "@/components/service/customer-confirmation";
import { InspectionForm } from "@/components/service/inspection-form";
import { NotesPanel } from "@/components/service/notes-panel";
import { PartsTable } from "@/components/service/parts-table";
import { PhotoUploader } from "@/components/service/photo-uploader";
import {
  ServiceActionsProvider,
} from "@/components/service/service-actions";
import {
  ServiceActionsDesktopToolbar,
  ServiceActionsMobileBar,
} from "@/components/service/service-actions-mobile";
import { ServiceCompletionScreen } from "@/components/service/service-completion-screen";
import { ServiceHistoryPanel } from "@/components/service/service-history-panel";
import { ServiceProgress } from "@/components/service/service-progress";
import { ServiceSummarySidebar } from "@/components/service/service-summary-sidebar";
import { ServiceTimeline } from "@/components/service/service-timeline";
import { WorkPerformedSection } from "@/components/service/work-performed";
import { Header } from "@/components/layout/header";
import { PageMain } from "@/components/layout/page-main";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { isTerminalStatus, canTransition } from "@/lib/constants/service-workflow";
import type { ServiceStatus } from "@/lib/constants/service-status";
import { openMobileMenu } from "@/lib/utils/mobile-menu";
import { formatDate } from "@/lib/utils/format";
import { isHistoryRecord } from "@/lib/services/history";
import { useAuth } from "@/providers/auth-provider";
import { useServiceData } from "@/providers/service-data-provider";
import type { DiagnosisRecord, InspectionData } from "@/types/inspection";
import type { ServicePart } from "@/types/parts";
import type {
  CompleteServicePayload,
  CustomerConfirmation as CustomerConfirmationType,
  CustomerUnavailablePayload,
  PhotoType,
  RequiresPartsPayload,
  UnableToResolvePayload,
} from "@/types/service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type ServiceDetailVariant = "service" | "history" | "job";

interface ServiceDetailViewProps {
  id: string;
  variant?: ServiceDetailVariant;
}

const BACK_LINKS: Record<
  ServiceDetailVariant,
  { href: string; label: string; headerTitle: string }
> = {
  service: {
    href: "/services",
    label: "Back to Service Requests",
    headerTitle: "Service Request",
  },
  job: {
    href: "/jobs",
    label: "Back to My Jobs",
    headerTitle: "My Jobs",
  },
  history: {
    href: "/history",
    label: "Back to Service History",
    headerTitle: "Service History",
  },
};

export function ServiceDetailView({
  id,
  variant = "service",
}: ServiceDetailViewProps) {
  const data = useServiceData();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const request = data.getServiceRequestById(id);
  const [showCompletion, setShowCompletion] = useState(false);

  const inspectionRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const partsRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);

  if (!request) {
    notFound();
  }

  useEffect(() => {
    if (variant === "history" && !isHistoryRecord(request)) {
      router.replace(`/services/${request.id}`);
    }
  }, [variant, request, router]);

  const backLink = BACK_LINKS[variant];
  const readOnly =
    variant === "history" || isTerminalStatus(request.status);
  const timeline = data.getTimeline(request.id);
  const notes = data.getNotes(request.id);
  const parts = data.getParts(request.id);
  const photos = data.getPhotos(request.id);
  const inspection = data.getInspection(request.id);
  const customerHistory = data.getCustomerHistory(request.customer_id);
  const productHistory = data.getProductHistory(
    request.product_id,
    request.product?.model_number
  );

  const handleStatusUpdate = async (status: ServiceStatus) => {
    if (!canTransition(request.status, status)) {
      toast("This status change is not allowed.", "error");
      return;
    }
    data.updateServiceStatus(request.id, status);
    toast("Service status updated.", "success");
  };

  const handleComplete = async (payload: CompleteServicePayload) => {
    data.completeService(request.id, payload);
    data.addNote(request.id, payload.technician_remarks);
    toast("Service marked as completed.", "success");
    setShowCompletion(true);
  };

  const handleRequiresParts = async (payload: RequiresPartsPayload) => {
    data.markRequiresParts(request.id, payload);
    toast("Service marked as requires parts. Follow-up required.", "success");
  };

  const handleCustomerUnavailable = async (payload: CustomerUnavailablePayload) => {
    data.markCustomerUnavailable(request.id, payload);
    toast("Customer unavailability recorded.", "success");
  };

  const handleUnableToResolve = async (payload: UnableToResolvePayload) => {
    data.markUnableToResolve(request.id, payload);
    toast("Service marked as unable to resolve.", "success");
  };

  const handleAddNote = async (note: string) => {
    data.addNote(request.id, note);
    toast("Note saved.", "success");
  };

  const handleAddPart = async (
    part: Omit<ServicePart, "id" | "service_request_id" | "created_at">
  ) => {
    data.addPart(request.id, part);
    toast("Part added.", "success");
  };

  const handleRemoveNote = async (noteId: string) => {
    data.removeNote(request.id, noteId);
    toast("Note removed.", "success");
  };

  const handleUpdatePart = async (
    partId: string,
    part: Omit<ServicePart, "id" | "service_request_id" | "created_at">
  ) => {
    data.updatePart(request.id, partId, part);
    toast("Part updated.", "success");
  };

  const handleRemovePart = async (partId: string) => {
    data.removePart(request.id, partId);
    toast("Part removed.", "success");
  };

  const handleSaveInspection = async (
    inspectionData: InspectionData,
    generalNotes?: string
  ) => {
    data.saveInspection(request.id, inspectionData, generalNotes);
    toast("Inspection saved.", "success");
  };

  const handleSaveDiagnosis = async (diagnosis: DiagnosisRecord) => {
    data.saveDiagnosis(request.id, diagnosis);
    toast("Diagnosis saved successfully.", "success");
  };

  const handleSaveWork = async (work: {
    diagnosis: string;
    work_performed: string;
    repair_performed?: string;
    testing_performed?: string;
    final_observation?: string;
    recommendation?: string;
  }) => {
    data.saveWorkPerformed(request.id, {
      diagnosis: work.diagnosis,
      work_performed: work.work_performed,
      repair_performed: work.repair_performed ?? "",
      testing_performed: work.testing_performed ?? "",
      final_observation: work.final_observation ?? "",
      recommendation: work.recommendation ?? "",
    });
    toast("Work details saved.", "success");
  };

  const handleSaveCustomerConfirmation = async (
    confirmation: Omit<CustomerConfirmationType, "confirmed_at">
  ) => {
    data.saveCustomerConfirmation(request.id, confirmation);
    toast("Customer confirmation recorded.", "success");
  };

  const handleUploadPhoto = async (file: File, photoType: PhotoType) => {
    const url = URL.createObjectURL(file);
    data.addPhoto(request.id, {
      photo_url: url,
      photo_type: photoType,
      file_name: file.name,
    });
    toast("Photo added.", "success");
  };

  const handleRemovePhoto = async (photoId: string) => {
    data.removePhoto(request.id, photoId);
    toast("Photo removed.", "success");
  };

  if (showCompletion && request.status === "completed" && variant !== "history") {
    return (
      <>
        <Header
          title={backLink.headerTitle}
          description={`#${request.service_number}`}
          technician={data.technician}
          unreadNotifications={data.getUnreadNotificationCount()}
          onMenuClick={openMobileMenu}
        />
        <PageMain>
          <ServiceCompletionScreen
            request={request}
            technician={data.technician}
            onBackToServices={() => router.push("/services")}
          />
        </PageMain>
      </>
    );
  }

  const detailBody = (
    <>
      <Header
        title={backLink.headerTitle}
        description={`#${request.service_number}`}
        technician={data.technician}
        unreadNotifications={data.getUnreadNotificationCount()}
        onMenuClick={openMobileMenu}
      />

      <PageMain className="pb-24 lg:pb-8">
        <Link
          href={backLink.href}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLink.label}
        </Link>

        {variant === "history" && (
          <p className="mb-4 rounded-lg border border-border bg-[#F9FAFB] px-4 py-2 text-sm text-secondary">
            This is a completed service record. Editing is disabled.
          </p>
        )}

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Service Request
            </p>
            <h2 className="text-[30px] font-semibold leading-9 text-foreground">
              #{request.service_number}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
            </div>
            <p className="mt-2 text-[13px] text-muted">
              Scheduled{" "}
              {request.scheduled_date
                ? `${formatDate(request.scheduled_date)}${request.scheduled_time ? ` · ${request.scheduled_time}` : ""}`
                : "—"}
            </p>
          </div>
          {!readOnly && <ServiceActionsDesktopToolbar />}
        </div>

        <div className="mb-6">
          <ServiceProgress status={request.status} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-5">
            <Card className="border-border shadow-none">
              <CardHeader>
                <CardTitle>Reported Issue</CardTitle>
              </CardHeader>
              <blockquote className="border-l-2 border-accent pl-4 text-sm leading-relaxed text-foreground">
                {request.complaint_description}
              </blockquote>
              <dl className="mt-4 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted">Complaint Type</dt>
                  <dd className="mt-0.5 font-medium">{request.complaint_type}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Priority</dt>
                  <dd className="mt-0.5">
                    <PriorityBadge priority={request.priority} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Reported</dt>
                  <dd className="mt-0.5">{formatDate(request.created_at)}</dd>
                </div>
                {request.customer_notes && (
                  <div className="sm:col-span-3">
                    <dt className="text-xs text-muted">Customer Notes</dt>
                    <dd className="mt-0.5 text-muted">{request.customer_notes}</dd>
                  </div>
                )}
              </dl>
            </Card>

            <div ref={inspectionRef}>
              <InspectionForm
                initialData={inspection?.inspection_data}
                initialGeneralNotes={inspection?.general_notes ?? undefined}
                onSave={handleSaveInspection}
                readOnly={readOnly}
              />
            </div>

            <DiagnosisSection
              initialDiagnosis={
                inspection?.diagnosis ?? request.diagnosis_record ?? null
              }
              onSave={handleSaveDiagnosis}
              readOnly={readOnly}
            />

            <div ref={workRef}>
              <WorkPerformedSection
                request={request}
                onSave={handleSaveWork}
                readOnly={readOnly}
              />
            </div>

            <div ref={partsRef}>
              <PartsTable
                parts={parts}
                onAddPart={handleAddPart}
                onUpdatePart={handleUpdatePart}
                onRemovePart={handleRemovePart}
                readOnly={readOnly}
              />
            </div>

            <div ref={photosRef}>
              <PhotoUploader
                photos={photos}
                onUpload={handleUploadPhoto}
                onRemove={handleRemovePhoto}
                readOnly={readOnly}
              />
            </div>

            <div ref={notesRef}>
              <NotesPanel
                notes={notes}
                onAddNote={handleAddNote}
                onRemoveNote={handleRemoveNote}
                currentTechnicianId={user?.technician.id}
                readOnly={readOnly}
              />
            </div>

            <CustomerConfirmation
              request={request}
              customerName={request.customer?.name ?? ""}
              onConfirm={handleSaveCustomerConfirmation}
              readOnly={readOnly}
            />

            <ServiceTimeline events={timeline} />
          </div>

          <aside className="space-y-3 lg:sticky lg:top-[84px] lg:self-start">
            <ServiceSummarySidebar
              request={request}
              technician={data.technician}
            />
            <ServiceHistoryPanel
              title="Previous Customer Services"
              entries={customerHistory}
            />
            <ServiceHistoryPanel
              title="Product Service History"
              entries={productHistory}
            />
          </aside>
        </div>
      </PageMain>

      {!readOnly && <ServiceActionsMobileBar />}
    </>
  );

  if (readOnly) {
    return detailBody;
  }

  return (
    <ServiceActionsProvider
      request={request}
      onStatusUpdate={handleStatusUpdate}
      onComplete={handleComplete}
      onRequiresParts={handleRequiresParts}
      onCustomerUnavailable={handleCustomerUnavailable}
      onUnableToResolve={handleUnableToResolve}
      onScrollTo={() => {}}
      onCompleted={() => setShowCompletion(true)}
    >
      {detailBody}
    </ServiceActionsProvider>
  );
}
