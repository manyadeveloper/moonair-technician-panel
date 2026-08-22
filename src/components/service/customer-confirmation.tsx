"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { customerConfirmationSchema } from "@/lib/validations/service";
import type { CustomerConfirmation as CustomerConfirmationRecord, ServiceRequest } from "@/types/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, PenLine } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { CustomerConfirmationFormValues } from "@/lib/validations/service";

interface CustomerConfirmationProps {
  request: ServiceRequest;
  customerName: string;
  onConfirm: (
    confirmation: Omit<CustomerConfirmationRecord, "confirmed_at">
  ) => Promise<void>;
  readOnly?: boolean;
}

export function CustomerConfirmation({
  request,
  customerName,
  onConfirm,
  readOnly = false,
}: CustomerConfirmationProps) {
  const [loading, setLoading] = useState(false);
  const [signatureDrawn, setSignatureDrawn] = useState(false);
  const isConfirmed = Boolean(request.customer_confirmed_at);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CustomerConfirmationFormValues>({
    resolver: zodResolver(customerConfirmationSchema),
    defaultValues: {
      customer_name: request.customer_confirmation?.customer_name ?? customerName,
      satisfied:
        request.customer_confirmation?.satisfied === false ? "no" : "yes",
      remarks: request.customer_confirmation?.remarks ?? "",
    },
  });

  const satisfied = watch("satisfied");

  const onSubmit = async (values: CustomerConfirmationFormValues) => {
    setLoading(true);
    try {
      await onConfirm({
        customer_name: values.customer_name,
        satisfied: values.satisfied === "yes",
        remarks: values.remarks,
        signature_recorded: signatureDrawn,
      });
      setSignatureDrawn(false);
    } finally {
      setLoading(false);
    }
  };

  if (isConfirmed && request.customer_confirmation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Confirmation</CardTitle>
        </CardHeader>
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="text-sm">
            <p className="font-medium text-emerald-800">
              {request.customer_confirmation.satisfied
                ? "Customer confirmed service completion"
                : "Customer reported issues with service"}
            </p>
            <p className="mt-1 text-emerald-700">
              {request.customer_confirmation.customer_name}
            </p>
            {request.customer_confirmation.remarks && (
              <p className="mt-1 text-emerald-700">
                {request.customer_confirmation.remarks}
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (readOnly) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Confirmation</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">
          Customer confirmation was not recorded for this service.
        </p>
      </Card>
    );
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Customer Confirmation</CardTitle>
        <CardDescription>
          Record customer sign-off before completing the service.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Customer Name"
          error={errors.customer_name?.message}
          {...register("customer_name")}
        />

        <fieldset>
          <legend className="mb-2 text-xs font-medium text-muted">
            Service completed satisfactorily
          </legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="yes" {...register("satisfied")} />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="no" {...register("satisfied")} />
              No
            </label>
          </div>
        </fieldset>

        <Textarea
          label="Customer Remarks (Optional)"
          rows={2}
          {...register("remarks")}
        />

        <div>
          <p className="mb-2 text-xs font-medium text-muted">Customer Signature</p>
          <button
            type="button"
            onClick={() => setSignatureDrawn(true)}
            className="flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-border bg-background text-sm text-muted hover:border-accent hover:text-accent"
          >
            {signatureDrawn ? (
              <span className="flex items-center gap-2 text-foreground">
                <PenLine className="h-4 w-4" />
                Signature captured (placeholder)
              </span>
            ) : (
              "Tap to capture signature placeholder"
            )}
          </button>
        </div>

        <Button
          type="submit"
          loading={loading}
          disabled={satisfied === "no" && !watch("remarks")}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Record Customer Confirmation
        </Button>
      </form>
    </Card>
  );
}
