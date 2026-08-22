"use client";

import { MoonAirLogo } from "@/components/layout/moonair-logo";
import { cn } from "@/lib/utils/cn";
import type { Technician } from "@/types/technician";
import {
  Bell,
  ClipboardList,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

const workspaceNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Service Requests", href: "/services", icon: ClipboardList },
  { name: "My Jobs", href: "/jobs", icon: Wrench },
  { name: "Service History", href: "/history", icon: History },
];

const communicationNav = [
  { name: "Notifications", href: "/notifications", icon: Bell },
];

const accountNav = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/profile/settings", icon: Settings },
];

const sidebarShellClass =
  "flex h-full w-[min(100vw,280px)] max-w-[85vw] flex-col border-r border-sky-200/60 bg-white/95 backdrop-blur-md sm:w-[248px] sm:max-w-none";

interface SidebarProps {
  technician: Technician;
  unreadNotifications?: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function NavSection({
  label,
  items,
  pathname,
  unreadNotifications,
  onMobileClose,
}: {
  label: string;
  items: typeof workspaceNav;
  pathname: string;
  unreadNotifications?: number;
  onMobileClose?: () => void;
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              item.href !== "/profile" &&
              item.href !== "/profile/settings" &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "relative flex h-10 items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-colors",
                isActive
                  ? "border border-sky-100/90 bg-white/75 text-foreground shadow-sm"
                  : "text-secondary hover:bg-white/45 hover:text-foreground"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
              )}
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.href === "/notifications" && unreadNotifications ? (
                <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {unreadNotifications}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function Sidebar({
  technician,
  unreadNotifications = 0,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const initials = technician.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const content = (
    <>
      <div className="relative px-5 pt-6 pb-4">
        <Link
          href="/dashboard"
          onClick={onMobileClose}
          className="block min-w-0"
        >
          <MoonAirLogo size="md" showPanelName tone="light" logoBackground />
        </Link>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="absolute right-3 top-6 rounded-md p-1 text-muted hover:bg-white/50 hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-2">
        <NavSection
          label="Workspace"
          items={workspaceNav}
          pathname={pathname}
          onMobileClose={onMobileClose}
        />
        <NavSection
          label="Communication"
          items={communicationNav}
          pathname={pathname}
          unreadNotifications={unreadNotifications}
          onMobileClose={onMobileClose}
        />
        <NavSection
          label="Account"
          items={accountNav}
          pathname={pathname}
          onMobileClose={onMobileClose}
        />
      </nav>

      <div className="border-t border-sky-200/40 p-4">
        <Link
          href="/profile"
          onClick={onMobileClose}
          className="mb-2 flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-white/45"
        >
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-100 bg-white/80 text-xs font-medium text-foreground">
              {initials}
            </div>
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white/80",
                technician.status === "active" ? "bg-success" : "bg-muted-light"
              )}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {technician.name}
            </p>
            <p className="text-xs text-muted">
              Technician ·{" "}
              {technician.status === "active" ? "Online" : "Offline"}
            </p>
          </div>
        </Link>
        <button
          onClick={() => signOut().then(() => router.push("/login"))}
          className="flex h-10 w-full items-center gap-2.5 rounded-md px-3 text-sm text-secondary transition-colors hover:bg-white/45 hover:text-foreground"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden h-screen shrink-0 lg:flex",
          sidebarShellClass
        )}
      >
        {content}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-[#111827]/20 backdrop-blur-[2px]"
            onClick={onMobileClose}
            aria-hidden
          />
          <aside
            className={cn(
              "absolute inset-y-0 left-0 z-50 h-full shadow-lg",
              sidebarShellClass,
              "bg-white/95"
            )}
          >
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
