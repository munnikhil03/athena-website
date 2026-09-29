import LostReportForm from "@/components/forms/lost-report-form";

export default function ReportLostPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-urgent">Report a lost pet</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Let&apos;s get the word out</h1>
      <p className="mt-2 text-muted-foreground">
        Fill in as much as you can - it all helps searchers. Nothing here is required to move fast:
        skip anything you don&apos;t know yet and come back to add updates later.
      </p>
      <div className="mt-8">
        <LostReportForm />
      </div>
    </div>
  );
}
