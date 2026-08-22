"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGuard } from "@/components/layout/auth-guard";
import { resolveDemoTechnician } from "@/lib/mock/technicians";
import { ServiceDataProvider, useServiceData } from "@/providers/service-data-provider";
import { useAuth } from "@/providers/auth-provider";
import { useMemo } from "react";

function TechnicianLayoutInner({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { technician, getUnreadNotificationCount } = useServiceData();

  const shellTechnician = useMemo(
    () => resolveDemoTechnician(user?.technician ?? technician),
    [user?.technician, technician]
  );

  return (
    <DashboardShell
      technician={shellTechnician}
      unreadNotifications={getUnreadNotificationCount()}
    >
      {children}
    </DashboardShell>
  );
}

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ServiceDataProvider>
        <TechnicianLayoutInner>{children}</TechnicianLayoutInner>
      </ServiceDataProvider>
    </AuthGuard>
  );
}
