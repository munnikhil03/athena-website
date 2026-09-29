"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { foundReportSchema, type FoundReportInput } from "@/lib/validation/case-schemas";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PhotoUpload from "@/components/forms/photo-upload";

const LocationPicker = dynamic(() => import("@/components/forms/location-picker"), {
  ssr: false,
  loading: () => <div className="h-[320px] w-full animate-pulse rounded-lg bg-muted" />,
});

export default function FoundReportForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FoundReportInput>({
    resolver: zodResolver(foundReportSchema),
    defaultValues: { photoUrls: [], contained: false },
  });

  async function onSubmit(values: FoundReportInput) {
    setSubmitError(null);
    const supabase = createClient();
    const point = `SRID=4326;POINT(${values.location.lng} ${values.location.lat})`;

    const { data: caseRow, error: caseError } = await supabase
      .from("cases")
      .insert({
        type: "found",
        title: "Found pet - owner unknown",
        description: values.description,
        last_known_location: point,
        photo_urls: values.photoUrls,
        contact_preference: values.contactPreference,
        found_contained: values.contained,
        found_taken_to: values.takenTo || null,
      })
      .select()
      .single();

    if (caseError || !caseRow) {
      setSubmitError(caseError?.message ?? "Couldn't submit this report. Please try again.");
      return;
    }

    await supabase.from("case_events").insert({
      case_id: caseRow.id,
      event_type: "found_contained",
      location: point,
      occurred_at: new Date(values.foundAt).toISOString(),
      description: values.condition ? `Condition: ${values.condition}` : "Found",
    });

    router.push(`/case/${caseRow.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <Label>Where did you find them? Tap the map to drop a pin</Label>
        <div className="mt-2">
          <Controller
            name="location"
            control={control}
            render={({ field }) => <LocationPicker value={field.value ?? null} onChange={field.onChange} />}
          />
        </div>
        {errors.location && <p className="mt-1.5 text-sm text-urgent">Please drop a pin where you found the animal.</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="foundAt">When did you find them?</Label>
          <Input id="foundAt" type="datetime-local" className="mt-1.5" {...register("foundAt")} />
          {errors.foundAt && <p className="mt-1.5 text-sm text-urgent">{errors.foundAt.message}</p>}
        </div>
        <div>
          <Label htmlFor="condition">Condition (optional)</Label>
          <Input id="condition" className="mt-1.5" {...register("condition")} />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" className="mt-1.5" rows={4} {...register("description")} />
        {errors.description && <p className="mt-1.5 text-sm text-urgent">{errors.description.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input id="contained" type="checkbox" className="h-4 w-4 rounded border-border" {...register("contained")} />
        <Label htmlFor="contained" className="!mb-0">
          The animal is currently contained / with me
        </Label>
      </div>

      <div>
        <Label htmlFor="takenTo">Where has the animal been taken, if applicable? (optional)</Label>
        <Input id="takenTo" className="mt-1.5" placeholder="e.g. a local shelter or vet clinic" {...register("takenTo")} />
      </div>

      <div>
        <Label htmlFor="contactPreference">How should the owner reach you?</Label>
        <Input id="contactPreference" className="mt-1.5" {...register("contactPreference")} />
        {errors.contactPreference && <p className="mt-1.5 text-sm text-urgent">{errors.contactPreference.message}</p>}
      </div>

      <div>
        <Label>Photos (optional, up to 6)</Label>
        <div className="mt-2">
          <Controller
            name="photoUrls"
            control={control}
            render={({ field }) => <PhotoUpload value={field.value} onChange={field.onChange} />}
          />
        </div>
      </div>

      {submitError && (
        <p className="rounded-lg border border-urgent/30 bg-urgent/10 px-4 py-3 text-sm text-urgent">{submitError}</p>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit Found Pet Report"}
      </Button>
    </form>
  );
}
