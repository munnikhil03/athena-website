"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface PhotoUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  max?: number;
}

export default function PhotoUpload({ value, onChange, bucket = "case-media", max = 6 }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const uploaded: string[] = [];

    try {
      const remaining = Math.max(0, max - value.length);
      for (const file of Array.from(files).slice(0, remaining)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't upload that photo. Make sure the 'case-media' storage bucket exists and is public."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        disabled={uploading || value.length >= max}
        onChange={(e) => handleFiles(e.target.files)}
        className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-secondary-foreground hover:file:bg-secondary/90"
      />
      {uploading && <p className="mt-2 text-sm text-muted-foreground">Uploading…</p>}
      {error && <p className="mt-2 text-sm text-urgent">{error}</p>}
      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt="" className="h-20 w-20 rounded-lg border border-border object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
