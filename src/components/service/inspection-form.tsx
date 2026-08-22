"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  INSPECTION_OPTION_LABELS,
  INSPECTION_OPTIONS,
} from "@/lib/constants/service-status";
import {
  inspectionSchema,
  type InspectionFormValues,
} from "@/lib/validations/inspection";
import type { InspectionData } from "@/types/inspection";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const INSPECTION_SECTIONS: {
  title: string;
  key: keyof InspectionData;
  fields: { key: string; label: string }[];
}[] = [
  {
    title: "Cooling System",
    key: "cooling",
    fields: [
      { key: "cooling_performance", label: "Cooling Performance" },
      { key: "water_circulation", label: "Water Circulation" },
      { key: "cooling_pads", label: "Cooling Pads" },
      { key: "water_pump", label: "Water Pump" },
    ],
  },
  {
    title: "Electrical",
    key: "electrical",
    fields: [
      { key: "motor", label: "Motor" },
      { key: "pump", label: "Pump" },
      { key: "wiring", label: "Wiring" },
      { key: "power_supply", label: "Power Supply" },
    ],
  },
  {
    title: "Mechanical",
    key: "mechanical",
    fields: [
      { key: "fan", label: "Fan" },
      { key: "louvers", label: "Louvers" },
      { key: "wheels", label: "Wheels" },
      { key: "noise", label: "Noise" },
      { key: "vibration", label: "Vibration" },
      { key: "body", label: "Body Condition" },
    ],
  },
];

const defaultInspection = (): InspectionFormValues => ({
  cooling: {
    cooling_performance: { value: "not_checked" },
    water_circulation: { value: "not_checked" },
    cooling_pads: { value: "not_checked" },
    water_pump: { value: "not_checked" },
  },
  electrical: {
    motor: { value: "not_checked" },
    pump: { value: "not_checked" },
    wiring: { value: "not_checked" },
    power_supply: { value: "not_checked" },
  },
  mechanical: {
    fan: { value: "not_checked" },
    louvers: { value: "not_checked" },
    wheels: { value: "not_checked" },
    noise: { value: "not_checked" },
    vibration: { value: "not_checked" },
    body: { value: "not_checked" },
  },
  general_notes: "",
});

interface InspectionFormProps {
  initialData?: InspectionData;
  initialGeneralNotes?: string;
  onSave: (data: InspectionData, generalNotes?: string) => Promise<void>;
  readOnly?: boolean;
}

export function InspectionForm({
  initialData,
  initialGeneralNotes,
  onSave,
  readOnly = false,
}: InspectionFormProps) {
  const [expanded, setExpanded] = useState(!initialData && !readOnly);
  const [loading, setLoading] = useState(false);

  const inspectionForm = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: initialData
      ? {
          ...(initialData as InspectionFormValues),
          general_notes: initialGeneralNotes ?? "",
        }
      : defaultInspection(),
  });

  const handleSave = async () => {
    const valid = await inspectionForm.trigger();
    if (!valid) return;

    setLoading(true);
    try {
      const values = inspectionForm.getValues();
      const { general_notes, ...inspectionData } = values;
      await onSave(inspectionData as InspectionData, general_notes);
      setExpanded(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Inspection</CardTitle>
          <CardDescription>
            Check product condition before beginning repair.
          </CardDescription>
        </div>
        {!readOnly && !expanded && (
          <Button variant="outline" size="sm" onClick={() => setExpanded(true)}>
            <ClipboardCheck className="h-3.5 w-3.5" />
            {initialData ? "Edit Inspection" : "Record Inspection"}
          </Button>
        )}
      </CardHeader>

      {expanded && !readOnly ? (
        <div className="space-y-6">
          {INSPECTION_SECTIONS.map((section) => (
            <div key={section.key}>
              <h4 className="mb-2 border-b border-border pb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                {section.title}
              </h4>
              <div className="overflow-hidden rounded-lg border border-border">
                {section.fields.map((field) => {
                  const value = inspectionForm.watch(
                    `${section.key}.${field.key}.value` as never
                  );
                  return (
                    <div
                      key={field.key}
                      className="grid h-11 items-center gap-2 border-b border-border px-4 last:border-0 sm:grid-cols-[1fr_140px_1fr]"
                    >
                      <span className="text-sm text-foreground">{field.label}</span>
                      <Select
                        value={String(value ?? "not_checked")}
                        onChange={(e) =>
                          inspectionForm.setValue(
                            `${section.key}.${field.key}.value` as never,
                            e.target.value as never
                          )
                        }
                        options={INSPECTION_OPTIONS.filter((o) => o !== "replaced").map(
                          (o) => ({
                            value: o,
                            label: INSPECTION_OPTION_LABELS[o],
                          })
                        )}
                      />
                      <Input
                        placeholder="Remark if issue found"
                        {...inspectionForm.register(
                          `${section.key}.${field.key}.remarks` as never
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <Textarea
            label="General Inspection Notes"
            rows={3}
            {...inspectionForm.register("general_notes")}
          />

          <div className="flex gap-2">
            <Button onClick={handleSave} loading={loading}>
              Save Inspection
            </Button>
            {initialData && (
              <Button variant="ghost" onClick={() => setExpanded(false)}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      ) : (
        initialData && (
          <p className="text-sm text-muted">
            Inspection recorded. Expand to review or edit check results.
          </p>
        )
      )}
    </Card>
  );
}
