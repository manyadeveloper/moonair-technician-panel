import { cn } from "@/lib/utils/cn";

interface PortalSkyBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

/** MoonAir portal wash — sky blue gradient from the left, no hard panel split. */
export function PortalSkyBackground({
  children,
  className,
}: PortalSkyBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen w-full bg-[#F6F7F8]", className)}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-gradient-to-r from-[#BAE6FD]/55 via-[#E0F2FE]/35 to-transparent"
      />
      <div className="relative z-[1] min-h-screen w-full">{children}</div>
    </div>
  );
}
