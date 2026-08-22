import { notifications as mockNotifications } from "@/lib/mock/notifications";
import type { Notification } from "@/types/notification";

export function getNotifications(): Notification[] {
  return mockNotifications;
}

export function getUnreadNotificationCount(): number {
  return mockNotifications.filter((n) => !n.read).length;
}
