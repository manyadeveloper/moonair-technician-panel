import { cn } from "@/lib/utils/cn";

interface WorkspaceSurfaceProps {
  children: React.ReactNode;
  className?: string;
}

/** Sky wash for authenticated workspace — main column only, not the sidebar. */
export function WorkspaceSurface({ children, className }: WorkspaceSurfaceProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full min-w-0 bg-[#F6F7F8] lg:pl-[248px]",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#BAE6FD]/55 via-[#E0F2FE]/35 to-transparent"
      />
      <div className="relative z-[1] flex min-h-screen w-full min-w-0 flex-col">
        {children}
      </div>
    </div>
  );
}
