import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const TYPE_LABEL: Record<string, string> = {
  lost: "Lost pet",
  seen: "Sighting reported",
  found: "Found pet",
  help: "Emergency assistance",
};

export default async function CaseDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: caseRow } = await supabase.from("cases").select("*").eq("id", params.id).maybeSingle();

  if (!caseRow) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            {TYPE_LABEL[caseRow.type] ?? caseRow.type} · {caseRow.status}
          </p>
          <CardTitle className="mt-2">{caseRow.title}</CardTitle>
          {caseRow.description && <CardDescription className="mt-2">{caseRow.description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.isArray(caseRow.behavioral_flags) && caseRow.behavioral_flags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {caseRow.behavioral_flags.map((flag: string) => (
                <span
                  key={flag}
                  className="rounded-full bg-urgent px-3 py-1 text-xs font-semibold text-urgent-foreground"
                >
                  {flag.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}

          {Array.isArray(caseRow.photo_urls) && caseRow.photo_urls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {caseRow.photo_urls.map((url: string) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt="" className="h-28 w-28 rounded-lg border border-border object-cover" />
              ))}
            </div>
          )}

          {caseRow.location_label && (
            <p className="text-sm text-muted-foreground">Near: {caseRow.location_label}</p>
          )}
          {caseRow.contact_preference && (
            <p className="text-sm text-muted-foreground">Contact: {caseRow.contact_preference}</p>
          )}
          {caseRow.special_instructions && (
            <p className="text-sm text-muted-foreground">{caseRow.special_instructions}</p>
          )}
          {caseRow.type === "found" && (
            <p className="text-sm text-muted-foreground">
              {caseRow.found_contained ? "Currently contained. " : "Not currently contained. "}
              {caseRow.found_taken_to ? `Taken to: ${caseRow.found_taken_to}` : null}
            </p>
          )}

          <p className="pt-4 text-xs text-muted-foreground">
            Your report was saved. The live case map and timeline (showing sightings, clues, and updates
            as they come in) are coming in Phase 3 - for now, share this page&apos;s link directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
