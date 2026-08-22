"use client";

import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  formatPhone,
  formatRelative,
  formatScheduled,
} from "@/lib/utils/format";
import type { ServiceRequest } from "@/types/service";
import Link from "next/link";

interface ServiceTableProps {
  requests: ServiceRequest[];
  onRefresh?: () => void;
  compact?: boolean;
  detailHrefPrefix?: string;
}

export function ServiceTable({
  requests,
  onRefresh,
  compact = false,
  detailHrefPrefix = "/services",
}: ServiceTableProps) {
  if (requests.length === 0) {
    return (
      <EmptyState
        title="No service requests"
        description="You currently have no assigned service requests."
        actionLabel="Refresh"
        onAction={onRefresh}
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-table-header">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted">
                  Service ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted">
                  Customer
                </th>
                {!compact && (
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted">
                    Phone
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted">
                  Issue
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted">
                  {compact ? "Time" : "Scheduled"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted">
                  Status
                </th>
                {!compact && (
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted">
                    Updated
                  </th>
                )}
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((sr) => (
                <tr
                  key={sr.id}
                  className="h-[60px] transition-colors hover:bg-[#F9FAFB]"
                >
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-semibold text-foreground">
                      {sr.service_number}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">
                      {sr.customer?.name ?? "—"}
                    </p>
                    {compact && sr.customer && (
                      <p className="text-xs text-muted">
                        {formatPhone(sr.customer.phone)}
                      </p>
                    )}
                  </td>
                  {!compact && (
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {sr.customer ? formatPhone(sr.customer.phone) : "—"}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">
                      {sr.product?.model_name ?? "—"}
                    </p>
                    {sr.product?.model_number && (
                      <p className="text-xs text-muted">
                        {sr.product.model_number}
                      </p>
                    )}
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-secondary">
                    {sr.complaint_type}
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={sr.priority} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">
                    {compact
                      ? (sr.scheduled_time ?? "—")
                      : formatScheduled(sr.scheduled_date, sr.scheduled_time)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={sr.status} />
                  </td>
                  {!compact && (
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-light">
                      {formatRelative(sr.updated_at)}
                    </td>
                  )}
                  <td className="px-4 py-3 text-right">
                    <Link href={`${detailHrefPrefix}/${sr.id}`}>
                      <Button variant="ghost" size="sm" className="text-accent">
                        View →
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {requests.map((sr) => (
          <ServiceCard
            key={sr.id}
            request={sr}
            detailHrefPrefix={detailHrefPrefix}
          />
        ))}
      </div>
    </>
  );
}

export function ServiceCard({
  request: sr,
  detailHrefPrefix = "/services",
}: {
  request: ServiceRequest;
  detailHrefPrefix?: string;
}) {
  return (
    <Link
      href={`${detailHrefPrefix}/${sr.id}`}
      className="block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-card-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-semibold text-foreground">
          {sr.service_number}
        </p>
        <PriorityBadge priority={sr.priority} />
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium text-foreground">
          {sr.customer?.name}
        </p>
        <p className="text-sm text-secondary">{sr.product?.model_name}</p>
        <p className="text-sm text-muted">{sr.complaint_type}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[13px] text-muted">{sr.scheduled_time ?? "—"}</p>
          <StatusBadge status={sr.status} />
        </div>
        <span className="text-sm font-medium text-accent">View Service →</span>
      </div>
    </Link>
  );
}
