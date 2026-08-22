import { Skeleton } from "@/components/ui/skeleton";

export function ServiceDetailSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <Skeleton className="h-4 w-40" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-48" />
      </div>
      <Skeleton className="h-20 w-full rounded-[10px]" />
      <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
        <div className="space-y-5">
          <Skeleton className="h-40 w-full rounded-[10px]" />
          <Skeleton className="h-56 w-full rounded-[10px]" />
          <Skeleton className="h-48 w-full rounded-[10px]" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-[10px]" />
          <Skeleton className="h-32 w-full rounded-[10px]" />
          <Skeleton className="h-24 w-full rounded-[10px]" />
        </div>
      </div>
    </div>
  );
}
