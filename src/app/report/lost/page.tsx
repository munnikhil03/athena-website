import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportLostPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-urgent">
            Coming in Phase 2
          </p>
          <CardTitle className="mt-2">Report a lost pet</CardTitle>
          <CardDescription className="mt-2">
            This form will collect your pet&apos;s name, photos, species/breed,
            color and markings, behavioral alerts (do not chase, skittish,
            injured, may bite, food motivated), and a last-known location you
            drop directly on the map. For now this is a placeholder route so
            navigation works end to end - the real form and Supabase-backed
            case creation come next.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
