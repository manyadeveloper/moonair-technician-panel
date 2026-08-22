"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { diagnosisSchema, type DiagnosisFormValues } from "@/lib/validations/inspection";
import type { DiagnosisRecord } from "@/types/inspection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface DiagnosisSectionProps {
  initialDiagnosis?: DiagnosisRecord | null;
  onSave: (diagnosis: DiagnosisRecord) => Promise<void>;
  readOnly?: boolean;
}

export function DiagnosisSection({
  initialDiagnosis,
  onSave,
  readOnly = false,
}: DiagnosisSectionProps) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(Boolean(initialDiagnosis));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisSchema),
    defaultValues: initialDiagnosis ?? {
      problem_identified: "",
      root_cause: "",
      severity: "moderate",
      recommended_action: "",
    },
  });

  const onSubmit = async (values: DiagnosisFormValues) => {
    setLoading(true);
    try {
      await onSave(values);
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

  if (readOnly && !initialDiagnosis) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Diagnosis</CardTitle>
          <CardDescription>Recorded problem identification and root cause.</CardDescription>
        </CardHeader>
        <p className="text-sm text-muted">No diagnosis recorded.</p>
      </Card>
    );
  }

  if (readOnly && initialDiagnosis) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Diagnosis</CardTitle>
          <CardDescription>Recorded problem identification and root cause.</CardDescription>
        </CardHeader>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-xs text-muted">Problem Identified</dt>
            <dd className="mt-0.5">{initialDiagnosis.problem_identified}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Root Cause</dt>
            <dd className="mt-0.5">{initialDiagnosis.root_cause}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Severity</dt>
            <dd className="mt-0.5 capitalize">{initialDiagnosis.severity}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Recommended Action</dt>
            <dd className="mt-0.5">{initialDiagnosis.recommended_action}</dd>
          </div>
        </dl>
      </Card>
    );
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Diagnosis</CardTitle>
        <CardDescription>
          Identify the problem, root cause, and recommended repair action.
        </CardDescription>
      </CardHeader>

      {saved && initialDiagnosis && (
        <p className="mb-4 text-sm text-emerald-700">Diagnosis saved.</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textarea
          label="Problem Identified"
          rows={2}
          error={errors.problem_identified?.message}
          {...register("problem_identified")}
        />
        <Textarea
          label="Root Cause"
          rows={2}
          error={errors.root_cause?.message}
          {...register("root_cause")}
        />
        <Select
          label="Severity"
          error={errors.severity?.message}
          options={[
            { value: "minor", label: "Minor" },
            { value: "moderate", label: "Moderate" },
            { value: "major", label: "Major" },
            { value: "critical", label: "Critical" },
          ]}
          {...register("severity")}
        />
        <Textarea
          label="Recommended Action"
          rows={2}
          error={errors.recommended_action?.message}
          {...register("recommended_action")}
        />
        <Button type="submit" loading={loading}>
          Save Diagnosis
        </Button>
      </form>
    </Card>
  );
}
