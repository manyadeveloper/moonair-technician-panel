"use client";

import { Header } from "@/components/layout/header";
import { PageMain } from "@/components/layout/page-main";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { openMobileMenu } from "@/lib/utils/mobile-menu";
import { useServiceData } from "@/providers/service-data-provider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfileEditPage() {
  const { getUnreadNotificationCount } = useServiceData();

  return (
    <>
      <Header
        title="Edit Profile"
        description="Update your technician information."
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
        <div className="w-full">
          <p className="text-sm text-muted">
            Update your personal contact information.
          </p>
          <div className="mt-6 max-w-xl">
            <ProfileEditForm />
          </div>
        </div>
      </PageMain>
    </>
  );
}
