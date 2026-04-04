"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { WebVitalsCard } from "@/components/admin/analytics/WebVitalsCard";
import { WebVitalsTrend } from "@/components/admin/analytics/WebVitalsTrend";
import { WebVitalsTable } from "@/components/admin/analytics/WebVitalsTable";
import { WebVitalsAlerts } from "@/components/admin/analytics/WebVitalsAlerts";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import type { AggregatedMetric, Rating } from "@/lib/services/web-vitals-service";

interface TrendPoint {
  date: string;
  metric_name: string;
  p75: number;
}

interface PagePerformance {
  page_url: string;
  metrics: Record<string, { p75: number; rating: Rating }>;
}

interface Alert {
  id: string;
  metric_name: string;
  page_url: string | null;
  threshold_value: number;
  current_p75: number;
  severity: string;
  created_at: string;
}

const METRIC_ORDER = ["LCP", "INP", "CLS", "FCP", "TTFB"];

export default function WebVitalsPage() {
  const [metrics, setMetrics] = useState<AggregatedMetric[]>([]);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [pages, setPages] = useState<PagePerformance[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/analytics/web-vitals").then((r) => r.json()),
      fetch("/api/admin/analytics/web-vitals/trends").then((r) => r.json()),
      fetch("/api/admin/analytics/web-vitals/pages").then((r) => r.json()),
      fetch("/api/admin/analytics/web-vitals/alerts").then((r) => r.json()),
    ])
      .then(([metricsRes, trendsRes, pagesRes, alertsRes]) => {
        setMetrics(metricsRes.metrics ?? []);
        setTrends(trendsRes.trends ?? []);
        setPages(pagesRes.pages ?? []);
        setAlerts(alertsRes.alerts ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleResolve = useCallback(async (id: string) => {
    setResolving(id);
    try {
      const res = await fetch("/api/admin/analytics/web-vitals/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }
    } finally {
      setResolving(null);
    }
  }, []);

  // Sort metrics by defined order
  const sortedMetrics = [...metrics].sort(
    (a, b) =>
      METRIC_ORDER.indexOf(a.metric_name) -
      METRIC_ORDER.indexOf(b.metric_name)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Web Vitals</h1>
        <Link
          href="/admin/analytics"
          className="text-sm text-muted hover:text-primary transition-colors"
        >
          &larr; Overview
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {sortedMetrics.map((m) => (
              <WebVitalsCard
                key={m.metric_name}
                metricName={m.metric_name}
                p50={m.p50}
                p75={m.p75}
                p95={m.p95}
                sampleCount={m.sample_count}
                rating={m.rating}
              />
            ))}
            {sortedMetrics.length === 0 && (
              <div className="col-span-full rounded-xl bg-card border border-card-border p-8 text-center">
                <p className="text-sm text-muted">
                  No Web Vitals data collected yet. Data will appear once
                  visitors start using the site.
                </p>
              </div>
            )}
          </div>

          {/* Trend charts */}
          {trends.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {METRIC_ORDER.map((m) => (
                <WebVitalsTrend key={m} trends={trends} metric={m} />
              ))}
            </div>
          )}

          {/* Alerts */}
          <div className="mb-8">
            <WebVitalsAlerts
              alerts={alerts}
              onResolve={handleResolve}
              resolving={resolving}
            />
          </div>

          {/* Page performance table */}
          <WebVitalsTable pages={pages} />
        </>
      )}
    </div>
  );
}
