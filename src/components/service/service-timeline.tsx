import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/utils/format";
import type { ServiceTimelineEvent } from "@/types/service";
import { cn } from "@/lib/utils/cn";

interface ServiceTimelineProps {
  events: ServiceTimelineEvent[];
}

export function ServiceTimeline({ events }: ServiceTimelineProps) {
  if (events.length === 0) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Service Timeline</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">No timeline events recorded yet.</p>
      </Card>
    );
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Service Timeline</CardTitle>
      </CardHeader>
      <div className="relative pl-1">
        {sorted.map((event, index) => (
          <div key={event.id} className="relative flex gap-4 pb-5 last:pb-0">
            {index < sorted.length - 1 && (
              <div className="absolute left-[5px] top-2 h-[calc(100%-4px)] w-px bg-[#D1D5DB]" />
            )}
            <div
              className={cn(
                "relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-card",
                index === 0 ? "bg-accent" : "bg-[#D1D5DB]"
              )}
            />
            <div className="min-w-0 flex-1 pt-0">
              <p className="text-xs tabular-nums text-muted">
                {formatTime(event.created_at)}
              </p>
              <p className="mt-0.5 text-sm text-foreground">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
