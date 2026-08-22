"use client";

import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils/format";
import type { ServiceTimelineEvent } from "@/types/service";
import { cn } from "@/lib/utils/cn";

interface RecentActivityProps {
  events: ServiceTimelineEvent[];
}

export function RecentActivity({ events }: RecentActivityProps) {
  if (events.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">No recent activity.</p>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <ul className="px-5 py-4">
        {events.map((event, index) => (
          <li key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  index === 0 ? "bg-accent" : "bg-[#D1D5DB]"
                )}
              />
              {index < events.length - 1 && (
                <div className="my-1 w-px flex-1 bg-[#D1D5DB]" />
              )}
            </div>
            <div className={cn("pb-4", index === events.length - 1 && "pb-0")}>
              <p className="text-xs text-muted">
                {formatDateTime(event.created_at).split(", ").pop()}
              </p>
              <p className="mt-0.5 text-sm text-foreground">
                {event.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
