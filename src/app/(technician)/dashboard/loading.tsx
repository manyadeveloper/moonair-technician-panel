import { Header } from "@/components/layout/header";
import { PageMain } from "@/components/layout/page-main";
import { CardSkeleton } from "@/components/ui/page-skeletons";

export default function DashboardLoading() {
  return (
    <>
      <Header title="Dashboard" />
      <PageMain>
        <CardSkeleton />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </PageMain>
    </>
  );
}
