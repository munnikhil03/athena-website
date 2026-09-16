import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Coming in Phase 2
          </p>
          <CardTitle className="mt-2">Report a found pet</CardTitle>
          <CardDescription className="mt-2">
            Will capture photos, where/when the animal was found, condition,
            whether it&apos;s contained, and where it&apos;s been taken, then
            (eventually) suggest possible matches against open LOST cases.
            Placeholder for now.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
