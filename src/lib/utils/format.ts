import { format, formatDistanceToNow, isToday, parseISO } from "date-fns";

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd MMM yyyy");
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd MMM, hh:mm a");
}

export function formatRelative(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isToday(d)) return "Today";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "hh:mm a");
}

export function formatScheduled(
  date: string | null | undefined,
  time?: string | null
): string {
  if (!date) return "—";
  const datePart = formatDate(date);
  if (time) return `${datePart} · ${time}`;
  return datePart;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned === "8005586588" || cleaned === "18005586588") {
    return "1800 558 6588";
  }
  if (cleaned === "8006686588" || cleaned === "18006686588") {
    return "1800 668 6588";
  }
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

/** Build a dialable tel: href for Indian mobile and toll-free numbers. */
export function toTelHref(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned === "8005586588" || cleaned === "18005586588") {
    return "tel:18005586588";
  }
  if (cleaned === "8006686588" || cleaned === "18006686588") {
    return "tel:18006686588";
  }
  if (cleaned.length === 10) {
    return `tel:+91${cleaned}`;
  }
  return `tel:${cleaned}`;
}
