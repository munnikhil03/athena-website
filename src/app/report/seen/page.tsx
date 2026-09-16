import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportSeenPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            Coming in Phase 2
          </p>
          <CardTitle className="mt-2">Report a sighting</CardTitle>
          <CardDescription className="mt-2">
            Designed to take under a minute: GPS or a dropped pin, time,
            direction of travel, condition, and an optional photo. This
            placeholder route keeps navigation working while we build the real
            form and wire it to a case&apos;s live map.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
