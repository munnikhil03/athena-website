import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/server";
import { MapLegend } from "@/components/map/map-legend";
import { caseToPinRole } from "@/lib/map/pin-colors";
import type { CaseMapPin } from "@/components/map/case-map";

const CaseMap = dynamic(() => import("@/components/map/case-map"), {
  ssr: false,
  loading: () => <div className="h-[520px] w-full animate-pulse rounded-lg bg-muted" />,
});

export default async function LiveMapPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("case_pins")
    .select("id, type, status, title, lat, lng, created_at")
    .order("created_at", { ascending: false });

  const pins: CaseMapPin[] = (data ?? []).map((row) => ({
    id: row.id as string,
    lat: row.lat as number,
    lng: row.lng as number,
    role: caseToPinRole(row.type as string, row.status as string),
    title: row.title as string,
    meta: row.status === "resolved" ? "Reunited" : undefined,
    href: `/case/${row.id}`,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Live case map</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">See what&apos;s happening near you</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Every open report on one map, color-coded by what&apos;s happening. Click a pin for details,
        or open the case to see its full timeline.
      </p>

      <div className="mt-6">
        <MapLegend />
      </div>

      <div className="mt-6">
        {pins.length > 0 ? (
          <CaseMap pins={pins} height={520} />
        ) : (
          <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed border-border text-center text-muted-foreground">
            No open reports yet - once someone files a Lost, Seen, or Found report, it&apos;ll show up
            here.
          </div>
        )}
      </div>
    </div>
  );
}
