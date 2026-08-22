"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  changePasswordSchema,
  notificationSettingsSchema,
  type ChangePasswordFormValues,
  type NotificationSettingsFormValues,
} from "@/lib/validations/settings";
import { useAuth } from "@/providers/auth-provider";
import {
  isValidMockLoginPassword,
} from "@/lib/mock/technicians";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const NOTIFICATION_PREFS_KEY = "moonair_notification_prefs";

const defaultNotificationPrefs: NotificationSettingsFormValues = {
  new_service: true,
  urgent_service: true,
  schedule_change: true,
  reminder: true,
};

function loadNotificationPrefs(): NotificationSettingsFormValues {
  if (typeof window === "undefined") return defaultNotificationPrefs;
  try {
    const raw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    return raw
      ? { ...defaultNotificationPrefs, ...JSON.parse(raw) }
      : defaultNotificationPrefs;
  } catch {
    return defaultNotificationPrefs;
  }
}

export function ProfileSettingsForm() {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [passwordLoading, setPasswordLoading] = useState(false);

  const notificationForm = useForm<NotificationSettingsFormValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: defaultNotificationPrefs,
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    notificationForm.reset(loadNotificationPrefs());
  }, [notificationForm]);

  const saveNotifications = (values: NotificationSettingsFormValues) => {
    localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(values));
    toast("Notification preferences saved.", "success");
  };

  const onPasswordSubmit = async (values: ChangePasswordFormValues) => {
    setPasswordLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setPasswordLoading(false);
    if (!isValidMockLoginPassword(values.current_password)) {
      passwordForm.setError("current_password", {
        message: "Current password is incorrect.",
      });
      return;
    }
    toast("Password updated successfully.", "success");
    passwordForm.reset();
  };

  return (
    <div className="grid w-full gap-5 lg:grid-cols-2">
      <Card className="h-fit w-full shadow-none">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Notifications
        </h2>
        <form
          onSubmit={notificationForm.handleSubmit(saveNotifications)}
          className="space-y-3"
        >
          {(
            [
              ["new_service", "New service notification"],
              ["urgent_service", "Urgent service notification"],
              ["schedule_change", "Schedule change alerts"],
              ["reminder", "Service reminders"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center justify-between gap-4 border-b border-border py-3 last:border-0"
            >
              <span className="text-sm text-foreground">{label}</span>
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border-input text-accent focus:ring-accent"
                {...notificationForm.register(key)}
              />
            </label>
          ))}
          <Button type="submit" size="sm" className="mt-2">
            Save Preferences
          </Button>
        </form>
      </Card>

      <Card className="h-fit w-full shadow-none">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Change Password
        </h2>
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="space-y-4"
        >
          <Input
            label="Current Password"
            type="password"
            error={passwordForm.formState.errors.current_password?.message}
            {...passwordForm.register("current_password")}
          />
          <Input
            label="New Password"
            type="password"
            error={passwordForm.formState.errors.new_password?.message}
            {...passwordForm.register("new_password")}
          />
          <Input
            label="Confirm New Password"
            type="password"
            error={passwordForm.formState.errors.confirm_password?.message}
            {...passwordForm.register("confirm_password")}
          />
          <Button type="submit" size="sm" loading={passwordLoading}>
            Update Password
          </Button>
        </form>
      </Card>

      <Card className="w-full shadow-none lg:col-span-2">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Account</h2>
        <p className="mb-4 text-sm text-muted">
          Sign out from this technician account on this device.
        </p>
        <Button
          variant="danger"
          onClick={() => signOut().then(() => router.push("/login"))}
        >
          Sign Out
        </Button>
      </Card>
    </div>
  );
}
