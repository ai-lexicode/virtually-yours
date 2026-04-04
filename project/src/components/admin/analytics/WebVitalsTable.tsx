"use client";

import { cn } from "@/lib/utils";
import type { Rating } from "@/lib/services/web-vitals-service";

interface PagePerformance {
  page_url: string;
  metrics: Record<string, { p75: number; rating: Rating }>;
}

interface WebVitalsTableProps {
  pages: PagePerformance[];
}

const ratingCellColors: Record<Rating, string> = {
  good: "text-green-400",
  "needs-improvement": "text-amber-400",
  poor: "text-red-400",
};

const METRICS = ["LCP", "INP", "CLS", "FCP", "TTFB"];

function formatValue(metric: string, value: number): string {
  if (metric === "CLS") return value.toFixed(3);
  return Math.round(value).toLocaleString();
}

export function WebVitalsTable({ pages }: WebVitalsTableProps) {
  if (pages.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-card-border p-5">
        <h3 className="text-sm font-semibold text-primary mb-2">
          Page Performance
        </h3>
        <p className="text-xs text-muted">No page data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-card-border p-5 overflow-x-auto">
      <h3 className="text-sm font-semibold text-primary mb-3">
        Page Performance (p75)
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-card-border">
            <th className="text-left text-muted font-medium py-2 pr-4">
              Page
            </th>
            {METRICS.map((m) => (
              <th
                key={m}
                className="text-right text-muted font-medium py-2 px-2"
              >
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pages.slice(0, 20).map((page) => (
            <tr
              key={page.page_url}
              className="border-b border-card-border/50"
            >
              <td className="py-2 pr-4 text-primary max-w-[200px] truncate">
                {page.page_url}
              </td>
              {METRICS.map((m) => {
                const data = page.metrics[m];
                if (!data) {
                  return (
                    <td key={m} className="py-2 px-2 text-right text-muted">
                      -
                    </td>
                  );
                }
                return (
                  <td
                    key={m}
                    className={cn(
                      "py-2 px-2 text-right font-medium",
                      ratingCellColors[data.rating]
                    )}
                  >
                    {formatValue(m, data.p75)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
