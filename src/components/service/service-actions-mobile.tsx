"use client";

import { ServiceActionsToolbar, useServiceActionsContext } from "@/components/service/service-actions";
import { Button } from "@/components/ui/button";
import { isTerminalStatus } from "@/lib/constants/service-workflow";
import { Play } from "lucide-react";

export function ServiceActionsMobileBar() {
  const { request, isLocked, openPrimaryAction, primaryAction, loading } =
    useServiceActionsContext();

  if (isLocked || isTerminalStatus(request.status)) return null;
  if (!primaryAction) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card p-4 lg:hidden">
      <Button onClick={openPrimaryAction} loading={loading} className="w-full">
        <Play className="h-4 w-4" />
        {primaryAction.label}
      </Button>
    </div>
  );
}

export function ServiceActionsDesktopToolbar() {
  return (
    <div className="hidden lg:block">
      <ServiceActionsToolbar />
    </div>
  );
}
