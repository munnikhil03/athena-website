import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MapLegend } from "@/components/map/map-legend";
import PhotoGallery from "@/components/case/photo-gallery";
import { caseToPinRole, eventToPinRole, PIN_ROLE_HEX } from "@/lib/map/pin-colors";
import { googleMapsUrl } from "@/lib/map/google-maps";
import { formatWhen } from "@/lib/format";
import type { CaseMapPin } from "@/components/map/case-map";

const CaseMap = dynamic(() => import("@/components/map/case-map"), {
  ssr: false,
  loading: () => <div className="h-[320px] w-full animate-pulse rounded-lg bg-muted" />,
});

const TYPE_LABEL: Record<string, string> = {
  lost: "Lost pet",
  seen: "Sighting reported",
  found: "Found pet",
  help: "Emergency assistance",
};

const EVENT_TYPE_LABEL: Record<string, string> = {
  last_known: "Last known location",
  possible_sighting: "Possible sighting",
  confirmed_sighting: "Confirmed sighting",
  tracks_clues: "Tracks / clue found",
  bedding: "Bedding site found",
  food_trap_station: "Food / trap station set",
  accident_origin: "Accident origin",
  found_contained: "Found & contained",
  update: "Update",
  note: "Note",
};

function GoogleMapsLink({ lat, lng }: { lat: number; lng: number }) {
  return (
    <a
      href={googleMapsUrl(lat, lng)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
    >
      Open in Google Maps
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

export default async function CaseDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: caseRow }, { data: casePin }, { data: eventPins }, { data: events }] = await Promise.all([
    supabase.from("cases").select("*").eq("id", params.id).maybeSingle(),
    supabase.from("case_pins").select("id, lat, lng").eq("id", params.id).maybeSingle(),
    supabase.from("case_event_pins").select("*").eq("case_id", params.id),
    supabase.from("case_events").select("*").eq("case_id", params.id).order("occurred_at", { ascending: true }),
  ]);

  if (!caseRow) {
    notFound();
  }

  const eventLocations = new Map<string, { lat: number; lng: number }>();
  for (const ev of eventPins ?? []) {
    eventLocations.set(ev.id as string, { lat: ev.lat as number, lng: ev.lng as number });
  }

  const pins: CaseMapPin[] = [];
  if (casePin) {
    pins.push({
      id: `case-${casePin.id}`,
      lat: casePin.lat as number,
      lng: casePin.lng as number,
      role: caseToPinRole(caseRow.type, caseRow.status),
      title: caseRow.title,
      meta: TYPE_LABEL[caseRow.type] ?? caseRow.type,
    });
  }
  for (const ev of eventPins ?? []) {
    pins.push({
      id: `event-${ev.id}`,
      lat: ev.lat as number,
      lng: ev.lng as number,
      role: eventToPinRole(ev.event_type as string),
      title: EVENT_TYPE_LABEL[ev.event_type as string] ?? (ev.event_type as string),
      meta: formatWhen(ev.occurred_at as string),
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            {TYPE_LABEL[caseRow.type] ?? caseRow.type} · {caseRow.status}
          </p>
          <CardTitle className="mt-2">{caseRow.title}</CardTitle>
          {caseRow.description && <CardDescription className="mt-2">{caseRow.description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.isArray(caseRow.behavioral_flags) && caseRow.behavioral_flags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {caseRow.behavioral_flags.map((flag: string) => (
                <span
                  key={flag}
                  className="rounded-full bg-urgent px-3 py-1 text-xs font-semibold text-urgent-foreground"
                >
                  {flag.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}

          {Array.isArray(caseRow.photo_urls) && caseRow.photo_urls.length > 0 && (
            <PhotoGallery photos={caseRow.photo_urls} thumbClassName="h-28 w-28" />
          )}

          <div className="space-y-1">
            {caseRow.location_label && (
              <p className="text-sm text-muted-foreground">Near: {caseRow.location_label}</p>
            )}
            {casePin && <GoogleMapsLink lat={casePin.lat as number} lng={casePin.lng as number} />}
          </div>

          {caseRow.contact_preference && (
            <p className="text-sm text-muted-foreground">Contact: {caseRow.contact_preference}</p>
          )}
          {caseRow.special_instructions && (
            <p className="text-sm text-muted-foreground">{caseRow.special_instructions}</p>
          )}
          {caseRow.type === "found" && (
            <p className="text-sm text-muted-foreground">
              {caseRow.found_contained ? "Currently contained. " : "Not currently contained. "}
              {caseRow.found_taken_to ? `Taken to: ${caseRow.found_taken_to}` : null}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Location &amp; timeline</CardTitle>
          <CardDescription>
            Every sighting, clue, and update reported for this case, newest last.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <MapLegend />

          {pins.length > 0 ? (
            <CaseMap pins={pins} height={320} cluster={false} />
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-border text-center text-sm text-muted-foreground">
              No location on file for this case yet.
            </div>
          )}

          {events && events.length > 0 ? (
            <ol className="space-y-4 border-l border-border pl-4">
              {events.map((event) => {
                const role = eventToPinRole(event.event_type as string);
                const loc = eventLocations.get(event.id as string);
                return (
                  <li key={event.id} className="relative">
                    <span
                      className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background"
                      style={{ backgroundColor: PIN_ROLE_HEX[role] }}
                      aria-hidden="true"
                    />
                    <p className="text-sm font-semibold">
                      {EVENT_TYPE_LABEL[event.event_type as string] ?? event.event_type}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatWhen(event.occurred_at as string)}</p>
                    {event.description && <p className="mt-1 text-sm">{event.description}</p>}
                    {Array.isArray(event.photo_urls) && event.photo_urls.length > 0 && (
                      <div className="mt-2">
                        <PhotoGallery photos={event.photo_urls} thumbClassName="h-16 w-16" />
                      </div>
                    )}
                    {loc && (
                      <div className="mt-1">
                        <GoogleMapsLink lat={loc.lat} lng={loc.lng} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">
              No updates logged yet. Sightings and clues reported for this case will appear here.
            </p>
          )}

          <p className="pt-2 text-xs text-muted-foreground">Share this page&apos;s link to keep everyone updated.</p>
        </CardContent>
      </Card>
    </div>
  );
}
