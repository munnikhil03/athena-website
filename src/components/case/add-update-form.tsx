"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PhotoUpload from "@/components/forms/photo-upload";
import { EVENT_TYPE_LABEL, UPDATE_EVENT_TYPES } from "@/lib/case-events";

const LocationPicker = dynamic(() => import("@/components/forms/location-picker"), {
  ssr: false,
  loading: () => <div className="h-[240px] w-full animate-pulse rounded-lg bg-muted" />,
});

const updateSchema = z.object({
  eventType: z.enum(UPDATE_EVENT_TYPES),
  description: z.string().min(1, "Add a quick description so people know what happened"),
  location: z.object({ lat: z.number(), lng: z.number() }).nullable(),
  photoUrls: z.array(z.string()).default([]),
});
type UpdateInput = z.infer<typeof updateSchema>;

// Anyone can post an update to a case, same as anyone can file the original
// report - no login, consistent with the site's emergency-first, no-gate
// philosophy. This is deliberately append-only: it can only ever add a new
// case_events row, never edit or delete the case's original report or any
// earlier update, so a bad-faith post can't erase someone else's history.
export default function AddUpdateForm({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateInput>({
    resolver: zodResolver(updateSchema),
    defaultValues: { eventType: "update", description: "", location: null, photoUrls: [] },
  });

  async function onSubmit(values: UpdateInput) {
    setSubmitError(null);
    const supabase = createClient();

    const { error } = await supabase.from("case_events").insert({
      case_id: caseId,
      event_type: values.eventType,
      description: values.description,
      location: values.location
        ? `SRID=4326;POINT(${values.location.lng} ${values.location.lat})`
        : null,
      photo_urls: values.photoUrls,
    });

    if (error) {
      setSubmitError(error.message);
      return;
    }

    reset({ eventType: "update", description: "", location: null, photoUrls: [] });
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Add an update
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-border p-4">
      <div>
        <Label htmlFor="eventType">What kind of update is this?</Label>
        <select
          id="eventType"
          {...register("eventType")}
          className="mt-1.5 flex h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
        >
          {UPDATE_EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {EVENT_TYPE_LABEL[type]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="description">What happened?</Label>
        <Textarea id="description" rows={3} className="mt-1.5" {...register("description")} />
        {errors.description && <p className="mt-1.5 text-sm text-urgent">{errors.description.message}</p>}
      </div>

      <div>
        <Label>Location, if relevant (optional)</Label>
        <div className="mt-1.5">
          <Controller
            control={control}
            name="location"
            render={({ field }) => <LocationPicker value={field.value ?? null} onChange={field.onChange} />}
          />
        </div>
      </div>

      <div>
        <Label>Photos (optional)</Label>
        <div className="mt-1.5">
          <Controller
            control={control}
            name="photoUrls"
            render={({ field }) => <PhotoUpload value={field.value} onChange={field.onChange} max={3} />}
          />
        </div>
      </div>

      {submitError && (
        <p className="rounded-lg border border-urgent/30 bg-urgent/10 px-4 py-3 text-sm text-urgent">{submitError}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting…" : "Post update"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
