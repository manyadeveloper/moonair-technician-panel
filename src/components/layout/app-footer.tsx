import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import { formatPhone, toTelHref } from "@/lib/utils/format";
import Link from "next/link";

interface AppFooterProps {
  className?: string;
  variant?: "app" | "auth";
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    "transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 rounded-sm";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function FooterDivider() {
  return (
    <span aria-hidden className="mx-2 hidden text-border sm:inline">
      |
    </span>
  );
}

export function AppFooter({ className, variant = "app" }: AppFooterProps) {
  const supportPhone = formatPhone(siteConfig.footerServiceCallNumber);
  const supportHref = toTelHref(siteConfig.footerServiceCallNumber);

  return (
    <footer
      className={cn(
        "mt-auto shrink-0 border-t border-border bg-card",
        className
      )}
    >
      <div className="flex w-full flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-8 xl:px-10">
        <div className="min-w-0 text-[11px] leading-4 text-muted-light">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.company}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">
            {siteConfig.panelName}
            {variant === "app" && (
              <>
                {" "}
                · Build {siteConfig.appVersion}
              </>
            )}
          </p>
        </div>

        <nav
          aria-label="Portal footer"
          className="flex flex-wrap items-center gap-x-1 gap-y-1 text-[11px] text-muted-light"
        >
          <FooterLink href={supportHref}>Service support</FooterLink>
          <FooterDivider />
          <a href={supportHref} className="transition-colors hover:text-foreground">
            {supportPhone}
          </a>
          <FooterDivider />
          <FooterLink href={siteConfig.storefrontUrl} external>
            moonair.in
          </FooterLink>
          <FooterDivider />
          <FooterLink href="#">Privacy</FooterLink>
          <FooterDivider />
          <FooterLink href="#">Terms of use</FooterLink>
        </nav>
      </div>
    </footer>
  );
}
