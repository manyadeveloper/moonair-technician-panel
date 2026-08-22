import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import Link from "next/link";

interface MoonAirLogoProps {
  showPanelName?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "dark" | "light";
  logoBackground?: boolean;
  className?: string;
  href?: string;
  onClick?: () => void;
}

/** Official MoonAir logo aspect ratio (2769 × 777) */
const LOGO_ASPECT = 2769 / 777;

const heights = {
  sm: 22,
  md: 28,
  lg: 36,
  xl: 44,
} as const;

export function MoonAirLogo({
  showPanelName = true,
  size = "md",
  tone = "dark",
  logoBackground = false,
  className,
  href,
  onClick,
}: MoonAirLogoProps) {
  const height = heights[size];
  const width = Math.round(height * LOGO_ASPECT);

  const logoImage = (
    <Image
      src={siteConfig.logoSrc}
      alt={`${siteConfig.name} — A Range Of Quality Products`}
      width={width}
      height={height}
      className="h-auto w-auto shrink-0 object-contain object-left"
      style={{ height, width: "auto", maxWidth: width }}
      priority
    />
  );

  const content = (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      {logoBackground ? (
        <div className="rounded-md bg-[#111111] px-3 py-2">{logoImage}</div>
      ) : (
        logoImage
      )}
      {showPanelName && (
        <div
          className={cn(
            "min-w-0 border-l pl-2.5",
            tone === "dark" ? "border-white/15" : "border-border"
          )}
        >
          <p
            className={cn(
              "truncate text-[10px] font-medium uppercase tracking-wider",
              tone === "dark" ? "text-[#9CA3AF]" : "text-muted"
            )}
          >
            {siteConfig.panelName}
          </p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="inline-flex min-w-0">
        {content}
      </Link>
    );
  }

  return content;
}
