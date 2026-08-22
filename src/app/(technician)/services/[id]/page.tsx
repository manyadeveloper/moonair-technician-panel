"use client";

import { ServiceDetailView } from "@/features/service-requests/components/service-detail-view";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <ServiceDetailView id={id} />;
}
