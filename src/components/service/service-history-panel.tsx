"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";
import type { ServiceHistoryEntry } from "@/types/service";

interface ServiceHistoryPanelProps {
  title: string;
  entries: ServiceHistoryEntry[];
}

export function ServiceHistoryPanel({ title, entries }: ServiceHistoryPanelProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">No previous service records found.</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <ul className="space-y-4">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <p className="text-xs font-medium text-muted">
              {formatDate(entry.service_date)}
            </p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {entry.complaint_type}
            </p>
            <p className="mt-1 text-sm text-muted">{entry.work_performed}</p>
            {entry.parts_summary && (
              <p className="mt-1 text-xs text-muted-light">
                Parts: {entry.parts_summary}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
