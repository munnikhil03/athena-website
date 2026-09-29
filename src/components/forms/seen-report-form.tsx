"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { seenReportSchema, type SeenReportInput } from "@/lib/validation/case-schemas";
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

export default function SeenReportForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SeenReportInput>({
    resolver: zodResolver(seenReportSchema),
    defaultValues: { photoUrls: [] },
  });

  async function onSubmit(values: SeenReportInput) {
    setSubmitError(null);
    const supabase = createClient();
    const point = `SRID=4326;POINT(${values.location.lng} ${values.location.lat})`;

    const { data: caseRow, error: caseError } = await supabase
      .from("cases")
      .insert({
        type: "seen",
        title: "Possible sighting reported",
        description: values.description,
        last_known_location: point,
        photo_urls: values.photoUrls,
        contact_preference: values.contactPreference || null,
      })
      .select()
      .single();

    if (caseError || !caseRow) {
      setSubmitError(caseError?.message ?? "Couldn't submit the sighting. Please try again.");
      return;
    }

    await supabase.from("case_events").insert({
      case_id: caseRow.id,
      event_type: "possible_sighting",
      location: point,
      occurred_at: new Date(values.seenAt).toISOString(),
      description: [values.description, values.directionOfTravel ? `Direction of travel: ${values.directionOfTravel}` : null, values.condition ? `Condition: ${values.condition}` : null]
        .filter(Boolean)
        .join(" — "),
    });

    router.push(`/case/${caseRow.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <Label>Where did you see them? Tap the map to drop a pin</Label>
        <div className="mt-2">
          <Controller
            name="location"
            control={control}
            render={({ field }) => <LocationPicker value={field.value ?? null} onChange={field.onChange} />}
          />
        </div>
        {errors.location && <p className="mt-1.5 text-sm text-urgent">Please drop a pin where you saw the animal.</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="seenAt">When did you see them?</Label>
          <Input id="seenAt" type="datetime-local" className="mt-1.5" {...register("seenAt")} />
          {errors.seenAt && <p className="mt-1.5 text-sm text-urgent">{errors.seenAt.message}</p>}
        </div>
        <div>
          <Label htmlFor="directionOfTravel">Direction of travel (optional)</Label>
          <Input id="directionOfTravel" className="mt-1.5" placeholder="e.g. heading north along the river" {...register("directionOfTravel")} />
        </div>
      </div>

      <div>
        <Label htmlFor="description">What did you see?</Label>
        <Textarea id="description" className="mt-1.5" rows={4} {...register("description")} />
        {errors.description && <p className="mt-1.5 text-sm text-urgent">{errors.description.message}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="condition">Condition (optional)</Label>
          <Input id="condition" className="mt-1.5" placeholder="Looked okay, limping, scared, ..." {...register("condition")} />
        </div>
        <div>
          <Label htmlFor="contactPreference">Contact info (optional)</Label>
          <Input id="contactPreference" className="mt-1.5" {...register("contactPreference")} />
        </div>
      </div>

      <div>
        <Label>Photo or video still, if you safely got one (optional)</Label>
        <div className="mt-2">
          <Controller
            name="photoUrls"
            control={control}
            render={({ field }) => <PhotoUpload value={field.value} onChange={field.onChange} max={3} />}
          />
        </div>
      </div>

      {submitError && (
        <p className="rounded-lg border border-urgent/30 bg-urgent/10 px-4 py-3 text-sm text-urgent">{submitError}</p>
      )}

      <Button type="submit" variant="secondary" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit Sighting"}
      </Button>
    </form>
  );
}
