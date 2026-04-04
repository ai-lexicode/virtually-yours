"use client";

import { cn } from "@/lib/utils";
import type { Rating } from "@/lib/services/web-vitals-service";

interface WebVitalsCardProps {
  metricName: string;
  p50: number;
  p75: number;
  p95: number;
  sampleCount: number;
  rating: Rating;
}

const ratingColors: Record<Rating, string> = {
  good: "text-green-400 bg-green-400/10 border-green-400/30",
  "needs-improvement": "text-amber-400 bg-amber-400/10 border-amber-400/30",
  poor: "text-red-400 bg-red-400/10 border-red-400/30",
};

const ratingLabels: Record<Rating, string> = {
  good: "Good",
  "needs-improvement": "Needs work",
  poor: "Poor",
};

const metricUnits: Record<string, string> = {
  LCP: "ms",
  INP: "ms",
  CLS: "",
  FCP: "ms",
  TTFB: "ms",
};

function formatValue(metric: string, value: number): string {
  if (metric === "CLS") return value.toFixed(3);
  return Math.round(value).toLocaleString();
}

export function WebVitalsCard({
  metricName,
  p50,
  p75,
  p95,
  sampleCount,
  rating,
}: WebVitalsCardProps) {
  const unit = metricUnits[metricName] ?? "ms";

  return (
    <div className="rounded-xl bg-card border border-card-border p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-primary">{metricName}</h3>
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full border font-medium",
            ratingColors[rating]
          )}
        >
          {ratingLabels[rating]}
        </span>
      </div>

      <div className="text-2xl font-bold text-primary mb-3">
        {formatValue(metricName, p75)}
        {unit && <span className="text-sm text-muted ml-1">{unit}</span>}
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-muted block">p50</span>
          <span className="text-primary font-medium">
            {formatValue(metricName, p50)}
            {unit}
          </span>
        </div>
        <div>
          <span className="text-muted block">p75</span>
          <span className="text-primary font-medium">
            {formatValue(metricName, p75)}
            {unit}
          </span>
        </div>
        <div>
          <span className="text-muted block">p95</span>
          <span className="text-primary font-medium">
            {formatValue(metricName, p95)}
            {unit}
          </span>
        </div>
      </div>

      <div className="mt-2 text-xs text-muted">
        {sampleCount.toLocaleString()} samples (30d)
      </div>
    </div>
  );
}
