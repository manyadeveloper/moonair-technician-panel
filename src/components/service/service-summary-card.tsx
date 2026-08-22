import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatDateTime } from "@/lib/utils/format";
import type { ServiceRequest } from "@/types/service";
import type { Technician } from "@/types/technician";

interface ServiceSummaryCardProps {
  request: ServiceRequest;
  technician: Technician;
}

export function ServiceSummaryCard({
  request,
  technician,
}: ServiceSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Summary</CardTitle>
      </CardHeader>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs text-muted">Current Status</dt>
          <dd className="mt-1">
            <StatusBadge status={request.status} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Priority</dt>
          <dd className="mt-1">
            <PriorityBadge priority={request.priority} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Assigned Technician</dt>
          <dd className="mt-0.5 font-medium">{technician.name}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Service Type</dt>
          <dd className="mt-0.5">{request.service_type}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Scheduled</dt>
          <dd className="mt-0.5">
            {request.scheduled_date
              ? `${formatDate(request.scheduled_date)}${request.scheduled_time ? ` · ${request.scheduled_time}` : ""}`
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Last Updated</dt>
          <dd className="mt-0.5">{formatDateTime(request.updated_at)}</dd>
        </div>
        {request.location && (
          <div>
            <dt className="text-xs text-muted">Location</dt>
            <dd className="mt-0.5">{request.location}</dd>
          </div>
        )}
      </dl>
    </Card>
  );
}
