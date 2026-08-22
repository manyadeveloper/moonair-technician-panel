"use client";

import { PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { ServiceRequest } from "@/types/service";
import Link from "next/link";

interface TodayScheduleProps {
  requests: ServiceRequest[];
}

export function TodaySchedule({ requests }: TodayScheduleProps) {
  if (requests.length === 0) {
    return (
      <EmptyState
        title="No jobs scheduled"
        description="You have no service visits scheduled for today."
      />
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <ul className="divide-y divide-border">
        {requests.map((sr) => (
          <li
            key={sr.id}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#F9FAFB]"
          >
            <div className="w-16 shrink-0 text-sm font-medium text-foreground">
              {sr.scheduled_time ?? "—"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-foreground">
                {sr.service_number}
              </p>
              <p className="text-sm text-foreground">
                {sr.customer?.name ?? "—"}
              </p>
              <p className="text-[13px] text-muted">
                {sr.product?.model_name ?? "—"}
              </p>
              <p className="text-[13px] text-secondary">{sr.complaint_type}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <PriorityBadge priority={sr.priority} />
              <Link href={`/services/${sr.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
