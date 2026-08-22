"use client";

import { GlobalSearch } from "@/components/layout/global-search";
import { NotificationDropdown } from "@/components/layout/notification-dropdown";
import type { Technician } from "@/types/technician";
import { Menu } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  description?: string;
  technician?: Technician;
  unreadNotifications?: number;
  onMenuClick?: () => void;
  showGlobalSearch?: boolean;
}

export function Header({
  title,
  description,
  technician,
  unreadNotifications = 0,
  onMenuClick,
  showGlobalSearch = true,
}: HeaderProps) {
  const initials = technician
    ? technician.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
    : "";

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-white/75 backdrop-blur-sm">
      <div className="flex h-[60px] items-center gap-3 px-4 sm:h-[68px] sm:gap-4 md:px-6 lg:px-8">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="shrink-0 rounded-md p-1.5 text-muted hover:bg-white/60 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="min-w-0 flex-1 sm:flex-none">
          <h1 className="truncate text-base font-semibold text-foreground sm:text-lg md:text-xl">
            {title}
          </h1>
          {description && (
            <p className="truncate text-[12px] text-muted sm:text-[13px] md:block">
              {description}
            </p>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {showGlobalSearch && (
            <div className="hidden min-w-0 sm:block">
              <GlobalSearch />
            </div>
          )}
          <NotificationDropdown unreadCount={unreadNotifications} />
          {technician && (
            <Link
              href="/profile"
              className="flex items-center gap-2"
            >
              <span className="hidden max-w-[120px] truncate text-sm font-medium text-foreground sm:inline md:max-w-none">
                {technician.name}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-100 bg-white/80 text-xs font-medium text-foreground sm:h-9 sm:w-9">
                {initials}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
