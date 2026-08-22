import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-28 flex-col justify-between rounded-lg border border-border bg-card px-5 py-4",
        className
      )}
    >
      {Icon && (
        <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F6]">
          <Icon className="h-[18px] w-[18px] text-muted" />
        </div>
      )}
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {title}
      </p>
      <div>
        <p className="text-[28px] font-semibold leading-8 tabular-nums text-foreground">
          {value}
        </p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-light">{description}</p>
        )}
      </div>
    </div>
  );
}
