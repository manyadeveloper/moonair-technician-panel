import { Card } from "@/components/ui/card";

interface OperationalSummaryProps {
  completedThisWeek: number;
  pendingFollowUps: number;
  requiresParts: number;
}

export function OperationalSummary({
  completedThisWeek,
  pendingFollowUps,
  requiresParts,
}: OperationalSummaryProps) {
  return (
    <Card className="shadow-none">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Service Summary
      </h2>
      <dl className="grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Completed This Week
          </dt>
          <dd className="mt-1 text-[26px] font-semibold tabular-nums text-foreground">
            {completedThisWeek}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Pending Follow-ups
          </dt>
          <dd className="mt-1 text-[26px] font-semibold tabular-nums text-foreground">
            {pendingFollowUps}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">
            Requires Parts
          </dt>
          <dd className="mt-1 text-[26px] font-semibold tabular-nums text-foreground">
            {requiresParts}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
