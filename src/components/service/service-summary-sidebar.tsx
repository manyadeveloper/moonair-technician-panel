import { Badge, PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { formatDate, formatPhone, toTelHref } from "@/lib/utils/format";
import type { ServiceRequest } from "@/types/service";
import type { Technician } from "@/types/technician";
import { Phone } from "lucide-react";

interface ServiceSummarySidebarProps {
  request: ServiceRequest;
  technician: Technician;
}

function SidebarCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card padding="sm" className="shadow-none">
      <CardTitle className="mb-3">{title}</CardTitle>
      {children}
    </Card>
  );
}

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border py-2.5 last:border-0">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="text-right text-[13px]">{children}</span>
    </div>
  );
}

export function ServiceSummarySidebar({
  request,
  technician,
}: ServiceSummarySidebarProps) {
  const warrantyVariant =
    request.product?.warranty_status === "active"
      ? "success"
      : request.product?.warranty_status === "expired"
        ? "warning"
        : "error";

  return (
    <div className="space-y-3">
      {request.customer && (
        <SidebarCard title="Customer">
          <p className="text-sm font-semibold text-foreground">
            {request.customer.name}
          </p>
          <div className="mt-3 space-y-2">
            <div>
              <p className="text-xs text-muted">Phone</p>
              <a
                href={toTelHref(request.customer.phone)}
                className="text-sm text-foreground hover:text-accent"
              >
                {formatPhone(request.customer.phone)}
              </a>
            </div>
            <div>
              <p className="text-xs text-muted">Address</p>
              <p className="text-sm text-secondary">
                {request.customer.city}, {request.customer.state}
              </p>
            </div>
          </div>
          <a href={toTelHref(request.customer.phone)} className="mt-4 block">
            <Button variant="outline" size="sm" className="w-full">
              <Phone className="h-3.5 w-3.5" />
              Call Customer
            </Button>
          </a>
        </SidebarCard>
      )}

      <SidebarCard title="MoonAir Support">
        <p className="text-sm text-muted">Service helpline</p>
        <p className="mt-1 text-sm font-medium text-foreground">
          {formatPhone(siteConfig.serviceCallNumber)}
        </p>
        <a href={toTelHref(siteConfig.serviceCallNumber)} className="mt-4 block">
          <Button variant="outline" size="sm" className="w-full">
            <Phone className="h-3.5 w-3.5" />
            Call Support
          </Button>
        </a>
      </SidebarCard>

      {request.product && (
        <SidebarCard title="Product">
          <p className="text-sm font-semibold text-foreground">
            {request.product.model_name}
          </p>
          <dl className="mt-3 space-y-2 text-[13px]">
            <div>
              <dt className="text-xs text-muted">Model</dt>
              <dd className="font-medium text-foreground">
                {request.product.model_number}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Serial Number</dt>
              <dd className="font-mono text-foreground">
                {request.product.serial_number}
              </dd>
            </div>
            {request.product.purchase_date && (
              <div>
                <dt className="text-xs text-muted">Purchase Date</dt>
                <dd className="text-foreground">
                  {formatDate(request.product.purchase_date)}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-muted">Warranty</dt>
              <dd className="mt-0.5">
                <Badge variant={warrantyVariant}>
                  {request.product.warranty_status === "active"
                    ? "Active"
                    : request.product.warranty_status === "expired"
                      ? "Expired"
                      : "Unknown"}
                </Badge>
              </dd>
            </div>
          </dl>
        </SidebarCard>
      )}

      <SidebarCard title="Service Summary">
        <SummaryRow label="Service ID">
          <span className="font-semibold text-foreground">
            {request.service_number}
          </span>
        </SummaryRow>
        <SummaryRow label="Priority">
          <PriorityBadge priority={request.priority} />
        </SummaryRow>
        <SummaryRow label="Status">
          <StatusBadge status={request.status} />
        </SummaryRow>
        <SummaryRow label="Scheduled">
          <span className="font-medium text-foreground">
            {request.scheduled_date
              ? `${formatDate(request.scheduled_date)}${request.scheduled_time ? ` · ${request.scheduled_time}` : ""}`
              : "—"}
          </span>
        </SummaryRow>
        <SummaryRow label="Technician">
          <span className="font-medium text-foreground">
            {technician.name}
          </span>
        </SummaryRow>
      </SidebarCard>
    </div>
  );
}
