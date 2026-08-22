"use client";

import { OperationalSummary } from "@/components/dashboard/operational-summary";
import { PriorityRequests } from "@/components/dashboard/priority-requests";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { Header } from "@/components/layout/header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { openMobileMenu } from "@/lib/utils/mobile-menu";
import { useServiceData } from "@/providers/service-data-provider";
import { AlertTriangle, Briefcase, CheckCircle2, Clock, Wrench } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const {
    technician,
    getDashboardStats,
    getServiceRequests,
    getRecentActivity,
    getUnreadNotificationCount,
  } = useServiceData();
  const stats = getDashboardStats();
  const today = "2026-08-22";
  const todayRequests = getServiceRequests()
    .filter((sr) => sr.scheduled_date === today && sr.status !== "completed")
    .sort((a, b) =>
      (a.scheduled_time ?? "").localeCompare(b.scheduled_time ?? "")
    );

  const priorityRequests = getServiceRequests({
    priority: "urgent",
  })
    .filter((sr) => sr.status !== "completed")
    .filter((sr) => ["urgent", "high"].includes(sr.priority))
    .slice(0, 6);

  const recentActivity = getRecentActivity();
  const firstName = technician.name.split(" ")[0];

  return (
    <>
      <Header
        title="Dashboard"
        technician={technician}
        unreadNotifications={getUnreadNotificationCount()}
        onMenuClick={openMobileMenu}
      />

      <PageMain>
        <div className="mb-6">
          <h1 className="text-[26px] font-semibold leading-8 text-foreground">
            Good morning, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Here&apos;s your service activity for today.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Today's Jobs"
            value={stats.todayJobs}
            description="Scheduled for today"
            icon={Briefcase}
          />
          <StatCard
            title="Pending"
            value={String(stats.pending).padStart(2, "0")}
            description="Awaiting action"
            icon={Clock}
          />
          <StatCard
            title="In Progress"
            value={String(stats.inProgress).padStart(2, "0")}
            description="Active service jobs"
            icon={Wrench}
          />
          <StatCard
            title="Completed"
            value={String(stats.completedToday).padStart(2, "0")}
            description="Completed today"
            icon={CheckCircle2}
          />
          <StatCard
            title="Urgent"
            value={String(stats.urgent).padStart(2, "0")}
            description="Immediate attention"
            icon={AlertTriangle}
          />
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[7fr_3fr]">
          <div>
            <SectionHeader
              title="Today's Schedule"
              action={
                <Link href="/jobs">
                  <Button variant="outline" size="sm">
                    View My Jobs
                  </Button>
                </Link>
              }
              className="mb-4"
            />
            <TodaySchedule requests={todayRequests} />
          </div>

          <div>
            <SectionHeader
              title="Priority Requests"
              action={
                <Link href="/services">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              }
              className="mb-4"
            />
            <PriorityRequests requests={priorityRequests} />
          </div>
        </div>

        <SectionHeader title="Recent Activity" className="mb-4" />
        <RecentActivity events={recentActivity} />

        <div className="mt-8">
          <OperationalSummary
            completedThisWeek={stats.completedThisWeek}
            pendingFollowUps={stats.pendingFollowUps}
            requiresParts={stats.requiresParts}
          />
        </div>
      </PageMain>
    </>
  );
}
