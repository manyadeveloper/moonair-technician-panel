"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { ServiceRequest } from "@/types/service";
import Link from "next/link";

interface PriorityRequestsProps {
  requests: ServiceRequest[];
}

export function PriorityRequests({ requests }: PriorityRequestsProps) {
  if (requests.length === 0) {
    return (
      <EmptyState
        title="No priority requests"
        description="No urgent or high-priority jobs at the moment."
      />
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((sr) => (
        <Link key={sr.id} href={`/services/${sr.id}`} className="block">
          <Card className="transition-colors hover:bg-card-hover">
            <p
              className={`text-[10px] font-semibold uppercase tracking-wide ${
                sr.priority === "urgent"
                  ? "text-[#991B1B]"
                  : "text-[#92400E]"
              }`}
            >
              {sr.priority === "urgent" ? "Urgent" : "High Priority"}
            </p>
            <p className="mt-2 text-[13px] font-semibold text-foreground">
              {sr.service_number}
            </p>
            <p className="mt-0.5 text-sm text-secondary">
              {sr.complaint_type}
            </p>
            <p className="mt-2 text-[13px] text-foreground">
              {sr.customer?.name}
            </p>
            <p className="text-[13px] text-muted">{sr.scheduled_time ?? "—"}</p>
            <p className="mt-3 text-sm font-medium text-accent">
              View →
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
