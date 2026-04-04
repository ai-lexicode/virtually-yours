"use client";

import { getRating } from "@/lib/services/web-vitals-service";

interface TrendPoint {
  date: string;
  metric_name: string;
  p75: number;
}

interface WebVitalsTrendProps {
  trends: TrendPoint[];
  metric: string;
}

const ratingStrokeColors: Record<string, string> = {
  good: "#4ade80",
  "needs-improvement": "#fbbf24",
  poor: "#f87171",
};

export function WebVitalsTrend({ trends, metric }: WebVitalsTrendProps) {
  const filtered = trends
    .filter((t) => t.metric_name === metric)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-card-border p-5">
        <h3 className="text-sm font-semibold text-primary mb-2">
          {metric} Trend (30d)
        </h3>
        <p className="text-xs text-muted">No trend data available</p>
      </div>
    );
  }

  const values = filtered.map((t) => t.p75);
  const maxVal = Math.max(...values) * 1.1 || 1;
  const minVal = 0;

  const width = 400;
  const height = 120;
  const padX = 0;
  const padY = 10;

  const points = filtered.map((t, i) => {
    const x = padX + (i / Math.max(filtered.length - 1, 1)) * (width - 2 * padX);
    const y =
      padY +
      (1 - (t.p75 - minVal) / (maxVal - minVal)) * (height - 2 * padY);
    return { x, y, rating: getRating(metric, t.p75), date: t.date, value: t.p75 };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Use the latest rating for overall stroke color
  const latestRating = points[points.length - 1]?.rating ?? "good";
  const strokeColor = ratingStrokeColors[latestRating];

  return (
    <div className="rounded-xl bg-card border border-card-border p-5">
      <h3 className="text-sm font-semibold text-primary mb-2">
        {metric} Trend (30d)
      </h3>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2.5}
            fill={ratingStrokeColors[p.rating]}
          />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-muted mt-1">
        <span>{filtered[0]?.date}</span>
        <span>{filtered[filtered.length - 1]?.date}</span>
      </div>
    </div>
  );
}
