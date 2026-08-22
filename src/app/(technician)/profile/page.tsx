"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { PageMain } from "@/components/layout/page-main";
import { resolveDemoTechnician } from "@/lib/mock/technicians";
import { openMobileMenu } from "@/lib/utils/mobile-menu";
import { formatDate, formatPhone } from "@/lib/utils/format";
import { useAuth } from "@/providers/auth-provider";
import { useServiceData } from "@/providers/service-data-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

function SettingsRow({
  title,
  description,
  onClick,
  destructive,
}: {
  title: string;
  description: string;
  onClick?: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-4 border-b border-border py-4 text-left last:border-0 hover:bg-white/40",
        destructive && "text-danger"
      )}
    >
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-[13px] text-muted">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-light" />
    </button>
  );
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { getUnreadNotificationCount } = useServiceData();
  const technician = resolveDemoTechnician(user?.technician);

  const initials = technician.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <>
      <Header
        title="Profile"
        description="Manage your technician information and account settings."
        technician={technician}
        unreadNotifications={getUnreadNotificationCount()}
        onMenuClick={openMobileMenu}
        showGlobalSearch={false}
      />
      <PageMain>
        <div className="w-full space-y-5">
          <Card className="w-full shadow-none">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-sky-100 bg-white/80 text-xl font-semibold text-foreground">
                  {initials}
                </div>
                <span
                  className={cn(
                    "absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-card",
                    technician.status === "active" ? "bg-emerald-500" : "bg-gray-400"
                  )}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-foreground">
                  {technician.name}
                </h2>
                <p className="mt-0.5 text-[13px] text-muted">Technician</p>
                <p className="font-mono text-[13px] text-secondary">
                  {technician.technician_code}
                </p>
                <Badge
                  variant={technician.status === "active" ? "success" : "default"}
                  className="mt-2"
                >
                  {technician.status === "active" ? "● Active" : "Offline"}
                </Badge>
              </div>
              <Link href="/profile/edit">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </Card>

          <div className="grid w-full gap-5 lg:grid-cols-2">
            <Card className="shadow-none">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Personal Information
              </h3>
              <dl className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <User className="mt-0.5 h-4 w-4 text-muted-light" />
                  <div>
                    <dt className="text-xs text-muted">Full Name</dt>
                    <dd className="font-medium">{technician.name}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-light" />
                  <div>
                    <dt className="text-xs text-muted">Phone</dt>
                    <dd>{formatPhone(technician.phone)}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-light" />
                  <div>
                    <dt className="text-xs text-muted">Email</dt>
                    <dd>{technician.email}</dd>
                  </div>
                </div>
                {technician.address && (
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-light" />
                    <div>
                      <dt className="text-xs text-muted">Address</dt>
                      <dd>{technician.address}</dd>
                    </div>
                  </div>
                )}
              </dl>
            </Card>

            <Card className="shadow-none">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Work Information
              </h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-xs text-muted">Technician ID</dt>
                  <dd className="font-mono font-medium">{technician.technician_code}</dd>
                </div>
                {technician.service_center_name && (
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-light" />
                    <div>
                      <dt className="text-xs text-muted">Service Centre</dt>
                      <dd>{technician.service_center_name}</dd>
                    </div>
                  </div>
                )}
                {technician.service_area && (
                  <div>
                    <dt className="text-xs text-muted">Service Area</dt>
                    <dd>{technician.service_area}</dd>
                  </div>
                )}
                {technician.joining_date && (
                  <div>
                    <dt className="text-xs text-muted">Joining Date</dt>
                    <dd>{formatDate(technician.joining_date)}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs text-muted">Current Status</dt>
                  <dd className="capitalize">{technician.status}</dd>
                </div>
              </dl>
            </Card>
          </div>

          <Card className="w-full shadow-none">
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              Account Settings
            </h3>
            <SettingsRow
              title="Change Password"
              description="Update your account password"
              onClick={() => router.push("/profile/settings")}
            />
            <SettingsRow
              title="Notification Preferences"
              description="Manage service notifications"
              onClick={() => router.push("/profile/settings")}
            />
            <SettingsRow
              title="Sign Out"
              description="Sign out from this technician account"
              destructive
              onClick={() => signOut().then(() => router.push("/login"))}
            />
          </Card>
        </div>
      </PageMain>
    </>
  );
}
