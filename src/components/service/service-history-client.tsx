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

export function ServiceHistoryClient() {
  const { technician, getServiceHistoryPaginated, getUnreadNotificationCount } =
    useServiceData();
  const [filters, setFilters] = useState<ServiceFilters>({
    page: 1,
    pageSize: 10,
    sort: "newest",
  });
  const [search, setSearch] = useState("");

  const result = useMemo(() => {
    return getServiceHistoryPaginated({
      ...filters,
      search: search || filters.search,
    });
  }, [getServiceHistoryPaginated, filters, search]);

  return (
    <>
      <Header
        title="Service History"
        description="Find and review previously completed service records."
        technician={technician}
        unreadNotifications={getUnreadNotificationCount()}
        onMenuClick={openMobileMenu}
      />
      <PageMain className="space-y-4">
        <ServiceFiltersBar
          filters={filters}
          onChange={(f) =>
            setFilters({ ...f, page: 1, pageSize: filters.pageSize ?? 10 })
          }
          onClear={() => {
            setFilters({ page: 1, pageSize: 10, sort: "newest" });
            setSearch("");
          }}
          search={search}
          onSearchChange={setSearch}
          showSort
        />
        <ServiceTable
          requests={result.data}
          detailHrefPrefix="/history"
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
