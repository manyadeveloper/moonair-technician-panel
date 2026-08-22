"use client";

import { Button } from "@/components/ui/button";
import { PageMain } from "@/components/layout/page-main";
import { useEffect } from "react";

export default function TechnicianError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageMain>
      <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-8 text-center">
        <h1 className="text-lg font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted">
          Unable to load this page. Please try again.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try Again
        </Button>
      </div>
    </PageMain>
  );
}
