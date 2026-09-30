"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { PawPrint } from "lucide-react";
import { MapLegend } from "@/components/map/map-legend";
import { caseToPinRole, PIN_ROLE_HEX, PIN_ROLE_LABEL } from "@/lib/map/pin-colors";
import { formatDate } from "@/lib/format";
import type { CaseMapPin } from "@/components/map/case-map";

const CaseMap = dynamic(() => import("@/components/map/case-map"), {
  ssr: false,
  loading: () => <div className="h-[520px] w-full animate-pulse rounded-lg bg-muted" />,
});

export interface LiveMapRow {
  id: string;
  type: string;
  status: string;
  title: string;
  photoUrl: string | null;
  createdAt: string;
  lat: number;
  lng: number;
}

export default function LiveMapClient({ rows }: { rows: LiveMapRow[] }) {
  const [includeClosed, setIncludeClosed] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);

  const visibleRows = useMemo(
    () => (includeClosed ? rows : rows.filter((r) => r.status !== "closed")),
    [rows, includeClosed]
  );

  const pins: CaseMapPin[] = useMemo(
    () =>
      visibleRows.map((row) => ({
        id: row.id,
        lat: row.lat,
        lng: row.lng,
        role: caseToPinRole(row.type, row.status),
        title: row.title,
        meta: row.status === "resolved" ? "Reunited" : row.status === "closed" ? "Closed" : undefined,
        href: `/case/${row.id}`,
      })),
    [visibleRows]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <MapLegend />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Showing:
          <select
            value={includeClosed ? "all" : "active"}
            onChange={(e) => setIncludeClosed(e.target.value === "all")}
            className="h-9 rounded-lg border border-border bg-background px-2 text-sm text-foreground"
          >
            <option value="active">Active reports</option>
            <option value="all">All reports (incl. closed)</option>
          </select>
        </label>
      </div>

      <div className="mt-6">
        {pins.length > 0 ? (
          <CaseMap pins={pins} height={520} focusId={focusId} />
        ) : (
          <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed border-border text-center text-muted-foreground">
            No reports yet - once someone files a Lost, Seen, or Found report, it&apos;ll show up here.
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold">All cases</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Click a row to find it on the map above, or click a case to open it.
        </p>

        {visibleRows.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
                  <th className="w-16 py-2 pl-4"></th>
                  <th className="py-2 pl-2 font-medium">Category</th>
                  <th className="py-2 pl-4 font-medium">Case</th>
                  <th className="py-2 pl-4 pr-4 text-right font-medium">Reported</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const role = caseToPinRole(row.type, row.status);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setFocusId(row.id)}
                      className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/40"
                    >
                      <td className="py-2 pl-4">
                        {row.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={row.photoUrl}
                            alt=""
                            className="h-10 w-10 rounded-md border border-border object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                            <PawPrint className="h-4 w-4" />
                          </div>
                        )}
                      </td>
                      <td className="py-2 pl-2">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: PIN_ROLE_HEX[role] }}
                            aria-hidden="true"
                          />
                          {PIN_ROLE_LABEL[role]}
                          {row.status === "closed" && (
                            <span className="text-xs text-muted-foreground">(closed)</span>
                          )}
                        </span>
                      </td>
                      <td className="max-w-[140px] truncate py-2 pl-4 sm:max-w-[260px]">
                        <Link
                          href={`/case/${row.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-primary underline underline-offset-2"
                        >
                          {row.title}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-4 text-right text-muted-foreground">
                        {formatDate(row.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Nothing to show yet.</p>
        )}
      </div>
    </div>
  );
}
