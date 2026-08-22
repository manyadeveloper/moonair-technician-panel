"use client";

import { AppFooter } from "@/components/layout/app-footer";
import { Sidebar } from "@/components/layout/sidebar";
import { WorkspaceSurface } from "@/components/layout/workspace-surface";
import type { Technician } from "@/types/technician";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
  technician: Technician;
  unreadNotifications?: number;
  children: React.ReactNode;
}

export function DashboardShell({
  technician,
  unreadNotifications,
  children,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setMobileOpen(true);
    window.addEventListener("open-mobile-menu", handler);
    return () => window.removeEventListener("open-mobile-menu", handler);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Sidebar
        technician={technician}
        unreadNotifications={unreadNotifications}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <WorkspaceSurface>
        {children}
        <AppFooter className="mt-auto w-full border-t border-border/50 bg-white/60 backdrop-blur-sm" />
      </WorkspaceSurface>
    </div>
  );
}
