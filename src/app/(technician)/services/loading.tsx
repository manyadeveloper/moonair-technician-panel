import { Header } from "@/components/layout/header";
import { PageMain } from "@/components/layout/page-main";
import { CardSkeleton, TableSkeleton } from "@/components/ui/page-skeletons";

export default function ServicesLoading() {
  return (
    <>
      <Header title="Service Requests" />
      <PageMain className="space-y-5">
        <CardSkeleton />
        <TableSkeleton />
      </PageMain>
    </>
  );
}
