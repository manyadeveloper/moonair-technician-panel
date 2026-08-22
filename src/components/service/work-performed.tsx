"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { workPerformedSchema } from "@/lib/validations/service";
import type { ServiceRequest } from "@/types/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { WorkPerformedFormValues } from "@/lib/validations/service";

interface WorkPerformedProps {
  request: ServiceRequest;
  onSave: (data: WorkPerformedFormValues) => Promise<void>;
  readOnly?: boolean;
}

export function WorkPerformedSection({
  request,
  onSave,
  readOnly = false,
}: WorkPerformedProps) {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(
    !readOnly && !request.diagnosis && !request.work_performed
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkPerformedFormValues>({
    resolver: zodResolver(workPerformedSchema),
    defaultValues: {
      diagnosis: request.diagnosis ?? "",
      work_performed: request.work_performed ?? "",
      repair_performed: request.repair_performed ?? "",
      testing_performed: request.testing_performed ?? "",
      final_observation: request.final_observation ?? "",
      recommendation: request.recommendation ?? "",
    },
  });

  const onSubmit = async (values: WorkPerformedFormValues) => {
    setLoading(true);
    try {
      await onSave(values);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Work Performed</CardTitle>
          <CardDescription>
            Document repair actions, testing, and final observations.
          </CardDescription>
        </div>
        {!readOnly && !editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </CardHeader>

      {editing && !readOnly ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Textarea
            label="Work Performed"
            error={errors.work_performed?.message}
            rows={3}
            {...register("work_performed")}
          />
          <Textarea
            label="Repair / Maintenance Action"
            error={errors.repair_performed?.message}
            rows={2}
            {...register("repair_performed")}
          />
          <Textarea
            label="Testing Performed"
            error={errors.testing_performed?.message}
            rows={2}
            {...register("testing_performed")}
          />
          <Textarea
            label="Final Observation"
            error={errors.final_observation?.message}
            rows={2}
            {...register("final_observation")}
          />
          <Textarea
            label="Recommendation"
            error={errors.recommendation?.message}
            rows={2}
            {...register("recommendation")}
          />
          <div className="flex gap-2">
            <Button type="submit" loading={loading}>
              Save Work Details
            </Button>
            {(request.diagnosis || request.work_performed) && (
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      ) : (
        <dl className="space-y-3 text-sm">
          {request.work_performed && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Work Performed
              </dt>
              <dd className="mt-0.5">{request.work_performed}</dd>
            </div>
          )}
          {request.repair_performed && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Repair / Maintenance
              </dt>
              <dd className="mt-0.5">{request.repair_performed}</dd>
            </div>
          )}
          {request.testing_performed && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Testing Performed
              </dt>
              <dd className="mt-0.5">{request.testing_performed}</dd>
            </div>
          )}
          {request.final_observation && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Final Observation
              </dt>
              <dd className="mt-0.5">{request.final_observation}</dd>
            </div>
          )}
          {request.recommendation && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Recommendation
              </dt>
              <dd className="mt-0.5">{request.recommendation}</dd>
            </div>
          )}
          {!request.work_performed && !request.repair_performed && (
            <p className="text-muted">No work recorded yet.</p>
          )}
        </dl>
      )}
    </Card>
  );
}
