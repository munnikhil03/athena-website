import FoundReportForm from "@/components/forms/found-report-form";

export default function ReportFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="text-base font-semibold uppercase tracking-wide text-primary">Report a found pet</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Help them get home</h1>
      <p className="mt-2 text-muted-foreground">
        Thank you for stopping. A few details here will help us find whoever is looking for this animal.
      </p>
      <div className="mt-8">
        <FoundReportForm />
      </div>
    </div>
  );
}
