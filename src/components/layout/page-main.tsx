import { cn } from "@/lib/utils/cn";

interface PageMainProps {
  children: React.ReactNode;
  className?: string;
}

/** Workspace padding: 16px mobile → 24px tablet → 32px desktop → 40px large desktop */
export function PageMain({ children, className }: PageMainProps) {
  return (
    <main className={cn("w-full flex-1 p-4 md:p-6 lg:p-8 xl:px-10", className)}>
      {children}
    </main>
  );
}
