"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { addPartSchema, type AddPartFormValues } from "@/lib/validations/service";
import type { ServicePart } from "@/types/parts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface PartsTableProps {
  parts: ServicePart[];
  onAddPart: (
    part: Omit<ServicePart, "id" | "service_request_id" | "created_at">
  ) => Promise<void>;
  onUpdatePart?: (
    partId: string,
    part: Omit<ServicePart, "id" | "service_request_id" | "created_at">
  ) => Promise<void>;
  onRemovePart?: (partId: string) => Promise<void>;
  readOnly?: boolean;
}

const ACTION_OPTIONS = [
  { value: "inspected", label: "Inspected" },
  { value: "cleaned", label: "Cleaned" },
  { value: "repaired", label: "Repaired" },
  { value: "replaced", label: "Replaced" },
  { value: "not_used", label: "Not Used" },
];

export function PartsTable({
  parts,
  onAddPart,
  onUpdatePart,
  onRemovePart,
  readOnly = false,
}: PartsTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<ServicePart | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddPartFormValues>({
    resolver: zodResolver(addPartSchema),
    defaultValues: {
      part_name: "",
      part_code: "",
      quantity: 1,
      action: "replaced",
      remarks: "",
    },
  });

  const openAdd = () => {
    setEditingPart(null);
    reset({
      part_name: "",
      part_code: "",
      quantity: 1,
      action: "replaced",
      remarks: "",
    });
    setModalOpen(true);
  };

  const openEdit = (part: ServicePart) => {
    setEditingPart(part);
    reset({
      part_name: part.part_name,
      part_code: part.part_code ?? "",
      quantity: part.quantity,
      action: part.action,
      remarks: part.remarks ?? "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (values: AddPartFormValues) => {
    setLoading(true);
    try {
      const payload = {
        part_name: values.part_name,
        part_code: values.part_code || null,
        quantity: values.quantity,
        action: values.action,
        remarks: values.remarks || null,
      };
      if (editingPart && onUpdatePart) {
        await onUpdatePart(editingPart.id, payload);
      } else {
        await onAddPart(payload);
      }
      reset();
      setModalOpen(false);
      setEditingPart(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Parts & Spares</CardTitle>
          <CardDescription>
            Record parts inspected, cleaned, repaired, or replaced during service.
          </CardDescription>
        </div>
        {!readOnly && (
          <Button variant="outline" size="sm" onClick={openAdd}>
            <Plus className="h-3.5 w-3.5" />
            Add Part
          </Button>
        )}
      </CardHeader>

      {parts.length === 0 ? (
        <p className="text-sm text-muted">No parts recorded for this service.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 text-xs font-medium uppercase tracking-wide text-muted">
                    Part Name
                  </th>
                  <th className="pb-2 text-xs font-medium uppercase tracking-wide text-muted">
                    Part Code
                  </th>
                  <th className="pb-2 text-right text-xs font-medium uppercase tracking-wide text-muted">
                    Qty
                  </th>
                  <th className="pb-2 text-xs font-medium uppercase tracking-wide text-muted">
                    Action
                  </th>
                  <th className="pb-2 text-xs font-medium uppercase tracking-wide text-muted">
                    Remarks
                  </th>
                  {!readOnly && <th className="pb-2" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {parts.map((part) => (
                  <tr key={part.id}>
                    <td className="py-2.5 font-medium">{part.part_name}</td>
                    <td className="py-2.5 text-muted">{part.part_code ?? "—"}</td>
                    <td className="py-2.5 text-right">{part.quantity}</td>
                    <td className="py-2.5 capitalize">
                      {part.action.replace("_", " ")}
                    </td>
                    <td className="py-2.5 text-muted">{part.remarks ?? "—"}</td>
                    {!readOnly && (
                      <td className="py-2.5 text-right">
                        <div className="flex justify-end gap-1">
                          {onUpdatePart && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(part)}
                              aria-label="Edit part"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {onRemovePart && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemovePart(part.id)}
                              aria-label="Remove part"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {parts.map((part) => (
              <div
                key={part.id}
                className="rounded-lg border border-border p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{part.part_name}</p>
                  {!readOnly && (
                    <div className="flex gap-1">
                      {onUpdatePart && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(part)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {onRemovePart && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemovePart(part.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted">
                  {part.part_code} · Qty {part.quantity} ·{" "}
                  {part.action.replace("_", " ")}
                </p>
                {part.remarks && (
                  <p className="mt-1 text-xs text-muted">{part.remarks}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingPart(null);
        }}
        title={editingPart ? "Edit Part" : "Add Part"}
        description="Record parts used during the service visit."
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setModalOpen(false);
                setEditingPart(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={loading}>
              {editingPart ? "Save Changes" : "Add Part"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Part Name"
            error={errors.part_name?.message}
            {...register("part_name")}
          />
          <Input
            label="Part Code"
            error={errors.part_code?.message}
            {...register("part_code")}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              min="1"
              error={errors.quantity?.message}
              {...register("quantity", { valueAsNumber: true })}
            />
            <Select
              label="Action"
              error={errors.action?.message}
              options={ACTION_OPTIONS}
              {...register("action")}
            />
          </div>
          <Input
            label="Remarks"
            error={errors.remarks?.message}
            {...register("remarks")}
          />
        </div>
      </Modal>
    </Card>
  );
}
