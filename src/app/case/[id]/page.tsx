import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Coming in Phase 3 - Case #{params.id}
          </p>
          <CardTitle className="mt-2">Live case map &amp; timeline</CardTitle>
          <CardDescription className="mt-2">
            Every case will have its own map (last-known location, sightings,
            tracks, bedding spots, found/contained) plus a chronological
            timeline, so searchers see the full picture instead of piecing it
            together from comments.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
