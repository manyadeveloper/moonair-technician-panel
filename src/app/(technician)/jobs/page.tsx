"use client";

import { Header } from "@/components/layout/header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { siteConfig } from "@/config/site";
import { ACTIVE_STATUSES } from "@/lib/constants/service-status";
import { openMobileMenu } from "@/lib/utils/mobile-menu";
import { formatDate, formatPhone, toTelHref } from "@/lib/utils/format";
import { useServiceData } from "@/providers/service-data-provider";
import type { ServiceRequest } from "@/types/service";
import { Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";

function JobCard({ job }: { job: ServiceRequest }) {
  return (
    <Card className="min-w-0 flex-1 shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[13px] font-semibold text-foreground">
            {job.service_number}
          </p>
          <p className="text-sm font-medium text-foreground">
            {job.customer?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={job.status} />
          <PriorityBadge priority={job.priority} />
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">
        {job.product?.model_name}
      </p>
      <p className="text-sm text-secondary">{job.complaint_type}</p>
      {job.location && (
        <p className="mt-2 flex items-center gap-1 text-[13px] text-muted">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/jobs/${job.id}`}>
          <Button size="md">
            <Clock className="h-3.5 w-3.5" />
            Start Job
          </Button>
        </Link>
        {job.customer && (
          <a href={toTelHref(job.customer.phone)}>
            <Button variant="outline" size="sm">
              <Phone className="h-3.5 w-3.5" />
              Call
            </Button>
          </a>
        )}
        <a href={toTelHref(siteConfig.serviceCallNumber)}>
          <Button variant="ghost" size="sm">
            <Phone className="h-3.5 w-3.5" />
            Support
          </Button>
        </a>
      </div>
      {job.customer && (
        <p className="mt-2 text-xs text-muted-light">
          {formatPhone(job.customer.phone)}
        </p>
      )}
    </Card>
  );
}

function JobTimeline({ jobs }: { jobs: ServiceRequest[] }) {
  if (jobs.length === 0) return null;

  return (
    <div className="relative w-full">
      <div className="absolute bottom-3 left-[31px] top-3 w-px bg-border" />
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="relative flex gap-4">
            <div className="relative z-10 w-16 shrink-0 pt-1 text-sm font-medium text-foreground">
              {job.scheduled_time ?? "—"}
            </div>
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JobsPage() {
  const { technician, getServiceRequests, getUnreadNotificationCount } =
    useServiceData();
  const today = "2026-08-22";

  const activeJobs = getServiceRequests().filter((sr) =>
    ACTIVE_STATUSES.includes(sr.status)
  );

  const todayJobs = activeJobs
    .filter((sr) => sr.scheduled_date === today)
    .sort((a, b) =>
      (a.scheduled_time ?? "").localeCompare(b.scheduled_time ?? "")
    );

  const upcomingJobs = activeJobs
    .filter((sr) => sr.scheduled_date && sr.scheduled_date > today)
    .sort((a, b) =>
      (a.scheduled_date ?? "").localeCompare(b.scheduled_date ?? "") ||
      (a.scheduled_time ?? "").localeCompare(b.scheduled_time ?? "")
    );

  return (
    <>
      <Header
        title="My Jobs"
        description="Your assigned service visits and current work."
        technician={technician}
        unreadNotifications={getUnreadNotificationCount()}
        onMenuClick={openMobileMenu}
      />
      <PageMain>
        <SectionHeader
          title={`Today · ${formatDate(today)}`}
          description={`${todayJobs.length} service visit${todayJobs.length !== 1 ? "s" : ""} scheduled today.`}
          className="mb-6"
        />

        {todayJobs.length === 0 ? (
          <EmptyState
            title="No jobs scheduled today"
            description="You have no active service visits scheduled for today."
          />
        ) : (
          <JobTimeline jobs={todayJobs} />
        )}

        <SectionHeader
          title="Upcoming"
          description={`${upcomingJobs.length} scheduled service visit${upcomingJobs.length !== 1 ? "s" : ""}.`}
          className="mb-4 mt-10"
        />
        {upcomingJobs.length === 0 ? (
          <EmptyState
            title="No upcoming jobs"
            description="No future service visits are scheduled."
          />
        ) : (
          <div className="w-full space-y-3">
            {upcomingJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block">
                <Card className="transition-colors hover:bg-card-hover">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-[13px] text-muted">
                        {job.scheduled_date
                          ? formatDate(job.scheduled_date)
                          : "—"}{" "}
                        · {job.scheduled_time ?? "—"}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {job.service_number}
                      </p>
                      <p className="text-sm text-foreground">
                        {job.customer?.name}
                      </p>
                    </div>
                    <PriorityBadge priority={job.priority} />
                  </div>
                  <p className="mt-1 text-sm text-secondary">
                    {job.product?.model_name} · {job.complaint_type}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </PageMain>
    </>
  );
}
