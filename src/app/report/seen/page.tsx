import SeenReportForm from "@/components/forms/seen-report-form";

export default function ReportSeenPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Report a sighting</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Saw a pet that might be lost?</h1>
      <p className="mt-2 text-muted-foreground">
        This takes under a minute. Even a rough pin and a time stamp can be the detail that closes a search.
      </p>
      <div className="mt-8">
        <SeenReportForm />
      </div>
    </div>
  );
}
