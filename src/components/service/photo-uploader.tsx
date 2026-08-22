"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { PHOTO_TYPE_LABELS, PHOTO_TYPES } from "@/lib/constants/service-status";
import type { PhotoType, ServicePhoto } from "@/types/service";
import { Camera, Plus, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";

// TODO: Replace local preview with Supabase Storage.
// Required environment variables will be added during backend integration.

interface PhotoUploaderProps {
  photos: ServicePhoto[];
  onUpload: (file: File, photoType: PhotoType) => Promise<void>;
  onRemove?: (photoId: string) => Promise<void>;
  readOnly?: boolean;
}

export function PhotoUploader({
  photos,
  onUpload,
  onRemove,
  readOnly = false,
}: PhotoUploaderProps) {
  const [photoType, setPhotoType] = useState<PhotoType>("during_service");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const grouped = useMemo(() => {
    const map = new Map<PhotoType, ServicePhoto[]>();
    for (const type of PHOTO_TYPES) {
      map.set(type, []);
    }
    for (const photo of photos) {
      const list = map.get(photo.photo_type) ?? [];
      list.push(photo);
      map.set(photo.photo_type, list);
    }
    return map;
  }, [photos]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setLoading(true);
    try {
      await onUpload(file, photoType);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Service Photos</CardTitle>
          <CardDescription>
            Document service condition before, during, and after repair.
          </CardDescription>
        </div>
        {!readOnly && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              loading={loading}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Photo
            </Button>
          </>
        )}
      </CardHeader>

      {!readOnly && (
        <div className="mb-5 max-w-xs">
          <Select
            label="Photo Category"
            value={photoType}
            onChange={(e) => setPhotoType(e.target.value as PhotoType)}
            options={PHOTO_TYPES.map((t) => ({
              value: t,
              label: PHOTO_TYPE_LABELS[t],
            }))}
          />
        </div>
      )}

      {photos.length === 0 ? (
        <p className="text-sm text-muted">No service photos recorded.</p>
      ) : (
        <div className="space-y-5">
          {PHOTO_TYPES.map((type) => {
            const typePhotos = grouped.get(type) ?? [];
            if (typePhotos.length === 0) return null;
            return (
              <div key={type}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  {PHOTO_TYPE_LABELS[type]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {typePhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative h-20 w-20 overflow-hidden rounded-md border border-border bg-gray-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.photo_url}
                        alt={PHOTO_TYPE_LABELS[photo.photo_type]}
                        className="h-full w-full object-cover"
                      />
                      {!readOnly && onRemove && (
                        <button
                          type="button"
                          onClick={() => onRemove(photo.id)}
                          className="absolute right-0.5 top-0.5 rounded bg-white/90 p-0.5 text-muted hover:text-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!readOnly && photos.length === 0 && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
          loading={loading}
        >
          <Camera className="h-3.5 w-3.5" />
          Upload Photo
        </Button>
      )}
    </Card>
  );
}
