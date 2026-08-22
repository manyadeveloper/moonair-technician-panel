"use client";

import {
  MOCK_LOCATIONS,
  MOCK_PRODUCT_CATEGORIES,
  MOCK_SERVICE_TYPES,
} from "@/lib/mock/data";
import {
  PRIORITY_LABELS,
  SERVICE_STATUSES,
  STATUS_LABELS,
} from "@/lib/constants/service-status";
import type { ServiceFilters } from "@/types/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { X } from "lucide-react";

interface ServiceFiltersBarProps {
  filters: ServiceFilters;
  onChange: (filters: ServiceFilters) => void;
  onClear: () => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  showSort?: boolean;
}

export function ServiceFiltersBar({
  filters,
  onChange,
  onClear,
  search,
  onSearchChange,
  showSort = false,
}: ServiceFiltersBarProps) {
  const hasActiveFilters =
    filters.search ||
    search ||
    (filters.status && filters.status !== "all") ||
    (filters.priority && filters.priority !== "all") ||
    filters.service_type ||
    filters.product_category ||
    filters.location ||
    filters.date_from ||
    filters.date_to ||
    (filters.sort && filters.sort !== "newest");

  return (
    <div className="space-y-3 border-b border-border pb-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <Input
            label="Search"
            placeholder="Service ID, customer, phone, model..."
            value={search ?? filters.search ?? ""}
            onChange={(e) =>
              onSearchChange
                ? onSearchChange(e.target.value)
                : onChange({ ...filters, search: e.target.value })
            }
          />
        </div>
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Status"
            value={filters.status ?? "all"}
            onChange={(e) =>
              onChange({
                ...filters,
                status: e.target.value as ServiceFilters["status"],
              })
            }
            options={[
              { value: "all", label: "All statuses" },
              ...SERVICE_STATUSES.map((s) => ({
                value: s,
                label: STATUS_LABELS[s],
              })),
            ]}
          />
          <Select
            label="Priority"
            value={filters.priority ?? "all"}
            onChange={(e) =>
              onChange({
                ...filters,
                priority: e.target.value as ServiceFilters["priority"],
              })
            }
            options={[
              { value: "all", label: "All priorities" },
              ...Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
          <Select
            label="Service Type"
            value={filters.service_type ?? ""}
            onChange={(e) =>
              onChange({ ...filters, service_type: e.target.value || undefined })
            }
            options={MOCK_SERVICE_TYPES.map((t) => ({ value: t, label: t }))}
          />
          <Select
            label="Product"
            value={filters.product_category ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                product_category: e.target.value || undefined,
              })
            }
            options={MOCK_PRODUCT_CATEGORIES.map((c) => ({
              value: c,
              label: c,
            }))}
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="shrink-0">
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {showSort && (
        <div className="max-w-xs">
          <Select
            label="Sort"
            value={filters.sort ?? "newest"}
            onChange={(e) =>
              onChange({
                ...filters,
                sort: e.target.value as ServiceFilters["sort"],
              })
            }
            options={[
              { value: "newest", label: "Latest first" },
              { value: "oldest", label: "Oldest first" },
              { value: "priority", label: "Priority" },
              { value: "scheduled", label: "Scheduled time" },
            ]}
          />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
        <Select
          label="Location"
          value={filters.location ?? ""}
          onChange={(e) =>
            onChange({ ...filters, location: e.target.value || undefined })
          }
          options={MOCK_LOCATIONS.map((l) => ({ value: l, label: l }))}
        />
        <Input
          label="Date From"
          type="date"
          value={filters.date_from ?? ""}
          onChange={(e) =>
            onChange({ ...filters, date_from: e.target.value || undefined })
          }
        />
        <Input
          label="Date To"
          type="date"
          value={filters.date_to ?? ""}
          onChange={(e) =>
            onChange({ ...filters, date_to: e.target.value || undefined })
          }
        />
      </div>
    </div>
  );
}
