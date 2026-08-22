"use client";

import { Header } from "@/components/layout/header";
import { PageMain } from "@/components/layout/page-main";
import { ServiceFiltersBar } from "@/components/service/service-filters";
import { ServiceTable } from "@/components/service/service-table";
import { Pagination } from "@/components/ui/pagination";
import { openMobileMenu } from "@/lib/utils/mobile-menu";
import { useServiceData } from "@/providers/service-data-provider";
import type { ServiceFilters } from "@/types/service";
import { useMemo, useState } from "react";

export function ServiceRequestsClient() {
  const { technician, getServiceRequestsPaginated, getUnreadNotificationCount } =
    useServiceData();
  const [filters, setFilters] = useState<ServiceFilters>({ page: 1, pageSize: 8 });
  const [search, setSearch] = useState("");

  const result = useMemo(() => {
    return getServiceRequestsPaginated({
      ...filters,
      search: search || filters.search,
    });
  }, [getServiceRequestsPaginated, filters, search]);

  return (
    <>
      <Header
        title="Service Requests"
        description="Manage assigned customer service jobs."
        technician={technician}
        unreadNotifications={getUnreadNotificationCount()}
        onMenuClick={openMobileMenu}
      />

      <PageMain className="space-y-5">
        <ServiceFiltersBar
          filters={filters}
          onChange={(f) =>
            setFilters({ ...f, page: 1, pageSize: filters.pageSize ?? 8 })
          }
          onClear={() => {
            setFilters({ page: 1, pageSize: 8 });
            setSearch("");
          }}
          search={search}
          onSearchChange={setSearch}
          showSort
        />
        <ServiceTable
          requests={result.data}
          onRefresh={() => setFilters({ ...filters })}
        />
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      </PageMain>
    </>
  );
}
