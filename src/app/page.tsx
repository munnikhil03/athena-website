import { createClient } from "@/lib/supabase/server";
import { caseToPinRole, type PinRole } from "@/lib/map/pin-colors";
import HomeContent, { type RecentCase } from "@/components/home/home-content";

export default async function Home() {
  const supabase = createClient();
  // The case_pins view now includes every status (the Live Map page needs
  // that for its "include closed" toggle) - the homepage only ever wanted
  // active reports, so that filter now happens here instead.
  const { data } = await supabase
    .from("case_pins")
    .select("id, type, status, title, created_at")
    .in("status", ["open", "resolved"])
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  const counts: Record<PinRole, number> = { lost: 0, sighting: 0, found: 0, reunited: 0, clue: 0 };
  for (const row of rows) {
    counts[caseToPinRole(row.type as string, row.status as string)] += 1;
  }

  const recent: RecentCase[] = rows.slice(0, 6).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    role: caseToPinRole(row.type as string, row.status as string),
    created_at: row.created_at as string,
  }));

  return <HomeContent counts={counts} recent={recent} />;
}
