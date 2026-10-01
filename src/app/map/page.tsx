import { createClient } from "@/lib/supabase/server";
import LiveMapClient, { type LiveMapRow } from "@/components/map/live-map-client";

export default async function LiveMapPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("case_pins")
    .select("id, type, status, title, photo_urls, lat, lng, created_at")
    .order("created_at", { ascending: false });

  const rows: LiveMapRow[] = (data ?? []).map((row) => ({
    id: row.id as string,
    type: row.type as string,
    status: row.status as string,
    title: row.title as string,
    photoUrl: Array.isArray(row.photo_urls) && row.photo_urls.length > 0 ? (row.photo_urls[0] as string) : null,
    createdAt: row.created_at as string,
    lat: row.lat as number,
    lng: row.lng as number,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-base font-semibold uppercase tracking-wide text-primary">Live case map</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">See what&apos;s happening near you</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Every report on one map, color-coded by what&apos;s happening. Click a pin or a row below for
        details, or open a case to see its full timeline.
      </p>

      <div className="mt-6">
        <LiveMapClient rows={rows} />
      </div>
    </div>
  );
}
