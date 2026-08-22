"use client";

import {
  getWorkflowStepIndex,
  WORKFLOW_PROGRESS_STEPS,
} from "@/lib/constants/service-workflow";
import { cn } from "@/lib/utils/cn";

const STEP_LABELS: Record<string, string> = {
  assigned: "Assigned",
  accepted: "Accepted",
  on_the_way: "On the Way",
  visit_started: "Visit",
  inspection: "Inspection",
  work_in_progress: "Work",
  completed: "Completed",
};

interface ServiceProgressProps {
  status: import("@/lib/constants/service-status").ServiceStatus;
}

export function ServiceProgress({ status }: ServiceProgressProps) {
  const currentIndex = getWorkflowStepIndex(status);

  return (
    <div className="flex h-[72px] items-center rounded-lg border border-border bg-card px-4">
      <div className="hidden w-full sm:flex sm:items-center">
        {WORKFLOW_PROGRESS_STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={step} className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex h-2.5 w-2.5 shrink-0 rounded-full border-2",
                    isComplete && "border-success bg-success",
                    isCurrent && "border-accent bg-white ring-2 ring-accent/30",
                    isFuture && "border-[#D1D5DB] bg-white"
                  )}
                />
                <span
                  className={cn(
                    "truncate text-center text-[10px] font-medium leading-tight",
                    isCurrent && "text-accent",
                    isComplete && "text-foreground",
                    isFuture && "text-muted-light"
                  )}
                >
                  {STEP_LABELS[step] ?? step}
                </span>
              </div>
              {index < WORKFLOW_PROGRESS_STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 mb-4 h-px flex-1",
                    index < currentIndex ? "bg-accent" : "bg-[#D1D5DB]"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="w-full space-y-0 sm:hidden">
        {WORKFLOW_PROGRESS_STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-2.5 w-2.5 shrink-0 rounded-full border-2",
                    isComplete && "border-success bg-success",
                    isCurrent && "border-accent bg-white ring-2 ring-accent/30",
                    !isComplete && !isCurrent && "border-[#D1D5DB] bg-white"
                  )}
                />
                {index < WORKFLOW_PROGRESS_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "my-0.5 min-h-[16px] w-px flex-1",
                      index < currentIndex ? "bg-accent" : "bg-[#D1D5DB]"
                    )}
                  />
                )}
              </div>
              <p
                className={cn(
                  "pb-2 text-sm",
                  isCurrent && "font-medium text-accent",
                  isComplete && "text-foreground",
                  !isComplete && !isCurrent && "text-muted-light"
                )}
              >
                {STEP_LABELS[step] ?? step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
