"use client";

import { ProfileSettingsForm } from "@/components/profile/profile-settings-form";
import { Header } from "@/components/layout/header";
import { PageMain } from "@/components/layout/page-main";
import { resolveDemoTechnician } from "@/lib/mock/technicians";
import { openMobileMenu } from "@/lib/utils/mobile-menu";
import { useAuth } from "@/providers/auth-provider";
import { useServiceData } from "@/providers/service-data-provider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const { getUnreadNotificationCount } = useServiceData();
  const technician = resolveDemoTechnician(user?.technician);

  return (
    <>
      <Header
        title="Settings"
        description="Manage notifications and account preferences."
        technician={technician}
        unreadNotifications={getUnreadNotificationCount()}
        onMenuClick={openMobileMenu}
        showGlobalSearch={false}
      />
      <PageMain>
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>
        <ProfileSettingsForm />
      </PageMain>
    </>
  );
}
