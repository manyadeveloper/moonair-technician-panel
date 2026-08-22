"use client";

import { Header } from "@/components/layout/header";
import { PageMain } from "@/components/layout/page-main";
import { SectionHeader } from "@/components/layout/section-header";
import { openMobileMenu } from "@/lib/utils/mobile-menu";
import { formatDateTime } from "@/lib/utils/format";
import { useServiceData } from "@/providers/service-data-provider";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { isToday, isYesterday, parseISO } from "date-fns";

function groupLabel(dateStr: string): "Today" | "Earlier" {
  try {
    const d = parseISO(dateStr);
    if (isToday(d) || isYesterday(d)) return "Today";
  } catch {
    /* ignore */
  }
  return "Earlier";
}

function formatTime(dateStr: string): string {
  try {
    const formatted = formatDateTime(dateStr);
    return formatted.split(", ").pop() ?? formatted;
  } catch {
    return dateStr;
  }
}

export default function NotificationsPage() {
  const {
    technician,
    getNotifications,
    getUnreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useServiceData();
  const notifications = getNotifications().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const unread = getUnreadNotificationCount();

  const todayItems = notifications.filter(
    (n) => groupLabel(n.created_at) === "Today"
  );
  const earlierItems = notifications.filter(
    (n) => groupLabel(n.created_at) === "Earlier"
  );

  const renderList = (items: typeof notifications) => (
    <ul className="divide-y divide-border">
      {items.map((n) => (
        <li key={n.id}>
          <div className="flex gap-3 py-4">
            <span
              className={cn(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                !n.read ? "bg-accent" : "bg-transparent"
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{n.title}</p>
              <p className="mt-0.5 text-sm text-muted">{n.message}</p>
              <p className="mt-1 text-xs text-muted-light">
                {formatTime(n.created_at)}
              </p>
              <div className="mt-2 flex gap-3">
                {n.service_request_id && (
                  <Link
                    href={`/services/${n.service_request_id}`}
                    className="text-sm text-accent hover:underline"
                  >
                    View service
                  </Link>
                )}
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => markNotificationRead(n.id)}
                    className="text-sm text-muted hover:text-foreground"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <Header
        title="Notifications"
        technician={technician}
        unreadNotifications={unread}
        onMenuClick={openMobileMenu}
        showGlobalSearch={false}
      />
      <PageMain>
        {notifications.length > 0 && unread > 0 && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => markAllNotificationsRead()}
              className="text-sm font-medium text-accent hover:underline"
            >
              Mark all as read
            </button>
          </div>
        )}
        {notifications.length === 0 ? (
          <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
            <p className="text-base font-semibold text-foreground">
              No notifications
            </p>
            <p className="mt-1 text-sm text-muted">
              Service updates will appear here.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-8">
            {todayItems.length > 0 && (
              <section>
                <SectionHeader title="Today" className="mb-3" />
                <div className="rounded-lg border border-border bg-card px-5">
                  {renderList(todayItems)}
                </div>
              </section>
            )}
            {earlierItems.length > 0 && (
              <section>
                <SectionHeader title="Earlier" className="mb-3" />
                <div className="rounded-lg border border-border bg-card px-5">
                  {renderList(earlierItems)}
                </div>
              </section>
            )}
          </div>
        )}
      </PageMain>
    </>
  );
}
