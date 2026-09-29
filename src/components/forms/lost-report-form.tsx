"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lostReportSchema, type LostReportInput } from "@/lib/validation/case-schemas";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BehavioralFlags from "@/components/forms/behavioral-flags";
import PhotoUpload from "@/components/forms/photo-upload";

const LocationPicker = dynamic(() => import("@/components/forms/location-picker"), {
  ssr: false,
  loading: () => <div className="h-[320px] w-full animate-pulse rounded-lg bg-muted" />,
});

export default function LostReportForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LostReportInput>({
    resolver: zodResolver(lostReportSchema),
    defaultValues: { behavioralFlags: [], photoUrls: [] },
  });

  async function onSubmit(values: LostReportInput) {
    setSubmitError(null);
    const supabase = createClient();

    const { data: pet, error: petError } = await supabase
      .from("pets")
      .insert({
        name: values.petName,
        species: values.species,
        breed: values.breed || null,
        sex: values.sex || null,
        color: values.color,
        collar_description: values.collarDescription || null,
        photo_urls: values.photoUrls,
      })
      .select()
      .single();

    if (petError || !pet) {
      setSubmitError(petError?.message ?? "Couldn't save your pet's details. Please try again.");
      return;
    }

    const point = `SRID=4326;POINT(${values.location.lng} ${values.location.lat})`;

    const { data: caseRow, error: caseError } = await supabase
      .from("cases")
      .insert({
        type: "lost",
        pet_id: pet.id,
        title: `Lost: ${values.petName}`,
        description: values.description || null,
        behavioral_flags: values.behavioralFlags,
        last_known_location: point,
        location_label: values.locationLabel || null,
        photo_urls: values.photoUrls,
        contact_preference: values.contactPreference,
        special_instructions: values.specialInstructions || null,
      })
      .select()
      .single();

    if (caseError || !caseRow) {
      setSubmitError(caseError?.message ?? "Couldn't create the case. Please try again.");
      return;
    }

    await supabase.from("case_events").insert({
      case_id: caseRow.id,
      event_type: "last_known",
      location: point,
      occurred_at: new Date(values.missingAt).toISOString(),
      description: "Last known location",
    });

    router.push(`/case/${caseRow.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="petName">Pet&apos;s name</Label>
          <Input id="petName" className="mt-1.5" {...register("petName")} />
          {errors.petName && <p className="mt-1.5 text-sm text-urgent">{errors.petName.message}</p>}
        </div>
        <div>
          <Label htmlFor="species">Species</Label>
          <Input id="species" className="mt-1.5" placeholder="Dog, cat, ..." {...register("species")} />
          {errors.species && <p className="mt-1.5 text-sm text-urgent">{errors.species.message}</p>}
        </div>
        <div>
          <Label htmlFor="breed">Breed (optional)</Label>
          <Input id="breed" className="mt-1.5" {...register("breed")} />
        </div>
        <div>
          <Label htmlFor="sex">Sex (optional)</Label>
          <Input id="sex" className="mt-1.5" {...register("sex")} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="color">Color &amp; distinctive markings</Label>
          <Input id="color" className="mt-1.5" {...register("color")} />
          {errors.color && <p className="mt-1.5 text-sm text-urgent">{errors.color.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="collarDescription">Collar / harness description (optional)</Label>
          <Input id="collarDescription" className="mt-1.5" {...register("collarDescription")} />
        </div>
      </div>

      <div>
        <Label>Behavioral alerts (select all that apply)</Label>
        <div className="mt-2">
          <Controller
            name="behavioralFlags"
            control={control}
            render={({ field }) => <BehavioralFlags value={field.value} onChange={field.onChange} />}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="missingAt">When did they go missing?</Label>
          <Input id="missingAt" type="datetime-local" className="mt-1.5" {...register("missingAt")} />
          {errors.missingAt && <p className="mt-1.5 text-sm text-urgent">{errors.missingAt.message}</p>}
        </div>
        <div>
          <Label htmlFor="contactPreference">How should people reach you?</Label>
          <Input id="contactPreference" className="mt-1.5" placeholder="Phone, email, or messaging app" {...register("contactPreference")} />
          {errors.contactPreference && <p className="mt-1.5 text-sm text-urgent">{errors.contactPreference.message}</p>}
        </div>
      </div>

      <div>
        <Label>Last-known location - tap the map to drop a pin</Label>
        <div className="mt-2">
          <Controller
            name="location"
            control={control}
            render={({ field }) => <LocationPicker value={field.value ?? null} onChange={field.onChange} />}
          />
        </div>
        {errors.location && <p className="mt-1.5 text-sm text-urgent">Please drop a pin at the last-known location.</p>}
        <Input
          className="mt-3"
          placeholder="Landmark or address (optional, helps searchers)"
          {...register("locationLabel")}
        />
      </div>

      <div>
        <Label htmlFor="description">Anything else searchers should know? (optional)</Label>
        <Textarea id="description" className="mt-1.5" rows={4} {...register("description")} />
      </div>

      <div>
        <Label htmlFor="specialInstructions">Special instructions (optional)</Label>
        <Textarea id="specialInstructions" className="mt-1.5" rows={3} {...register("specialInstructions")} />
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

      <Button type="submit" variant="urgent" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit Lost Pet Report"}
      </Button>
    </form>
  );
}
