"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { addNoteSchema, type AddNoteFormValues } from "@/lib/validations/service";
import { formatDateTime } from "@/lib/utils/format";
import type { ServiceNote } from "@/types/service";
import { MessageSquarePlus, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface NotesPanelProps {
  notes: ServiceNote[];
  onAddNote: (note: string) => Promise<void>;
  onRemoveNote?: (noteId: string) => Promise<void>;
  currentTechnicianId?: string;
  readOnly?: boolean;
}

export function NotesPanel({
  notes,
  onAddNote,
  onRemoveNote,
  currentTechnicianId,
  readOnly = false,
}: NotesPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddNoteFormValues>({
    resolver: zodResolver(addNoteSchema),
    defaultValues: { note: "" },
  });

  const onSubmit = async (values: AddNoteFormValues) => {
    setLoading(true);
    try {
      await onAddNote(values.note);
      reset();
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...notes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Technician Notes</CardTitle>
          <CardDescription>
            Record field observations and customer communication.
          </CardDescription>
        </div>
        {!readOnly && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            <MessageSquarePlus className="h-3.5 w-3.5" />
            Add Note
          </Button>
        )}
      </CardHeader>

      {showForm && !readOnly && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 space-y-3 border-b border-border pb-4"
        >
          <Textarea
            label="Note"
            placeholder="Enter technician remark..."
            error={errors.note?.message}
            rows={3}
            {...register("note")}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" loading={loading}>
              <Send className="h-3.5 w-3.5" />
              Save Note
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {sorted.length === 0 ? (
        <p className="text-sm text-muted">No technician notes recorded.</p>
      ) : (
        <div className="divide-y divide-border">
          {sorted.map((n) => {
            const canDelete =
              !readOnly &&
              onRemoveNote &&
              currentTechnicianId &&
              n.technician_id === currentTechnicianId;

            return (
              <div key={n.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {n.technician?.name ?? "Technician"}
                    </p>
                    <p className="text-xs text-muted-light">
                      {formatDateTime(n.created_at)}
                    </p>
                  </div>
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveNote(n.id)}
                      aria-label="Delete note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                  {n.note}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
