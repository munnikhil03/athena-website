import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            Coming in Phase 5
          </p>
          <CardTitle className="mt-2">Donate</CardTitle>
          <CardDescription className="mt-2">
            Donations will always be split three ways so you know exactly
            where your money goes: Help This Pet (a specific case), the
            Athena Emergency Fund (general, for animals needing immediate
            help), and Support Athena (platform costs). Payment processing
            isn&apos;t wired up yet - this needs case verification safeguards
            first.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
