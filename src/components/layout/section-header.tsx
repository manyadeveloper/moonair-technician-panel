import { cn } from "@/lib/utils/cn";

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  className,
  action,
}: SectionHeaderProps) {
  return (
    <div
      className={cn("mb-4 flex items-start justify-between gap-4", className)}
    >
      <div>
        <h2 className="text-lg font-semibold leading-6 text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-[13px] leading-[18px] text-muted">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
