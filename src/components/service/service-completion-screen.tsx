"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils/format";
import type { ServiceRequest } from "@/types/service";
import type { Technician } from "@/types/technician";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ServiceCompletionScreenProps {
  request: ServiceRequest;
  technician: Technician;
  onBackToServices: () => void;
}

export function ServiceCompletionScreen({
  request,
  technician,
  onBackToServices,
}: ServiceCompletionScreenProps) {
  return (
    <div className="mx-auto max-w-lg py-8">
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Service Completed</h2>
        <p className="mt-2 text-sm text-muted">
          Service request {request.service_number} has been successfully
          completed.
        </p>

        <dl className="mt-6 space-y-3 rounded-lg border border-border bg-background p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Completion time</dt>
            <dd className="font-medium">
              {formatDateTime(request.completed_at ?? request.updated_at)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Technician</dt>
            <dd className="font-medium">{technician.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Customer</dt>
            <dd className="font-medium">{request.customer?.name ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Product</dt>
            <dd className="font-medium">{request.product?.model_name ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Final status</dt>
            <dd>
              <StatusBadge status={request.status} />
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/history">
            <Button variant="outline" className="w-full sm:w-auto">
              View Service History
            </Button>
          </Link>
          <Button onClick={onBackToServices} className="w-full sm:w-auto">
            Back to Service Requests
          </Button>
        </div>
      </Card>
    </div>
  );
}
