export type NotificationType =
  | "service_assigned"
  | "schedule_changed"
  | "urgent_service"
  | "service_reminder"
  | "parts"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  service_request_id: string | null;
  created_at: string;
}
