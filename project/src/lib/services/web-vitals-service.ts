import type { SupabaseClient } from "@supabase/supabase-js";

// Google Web Vitals thresholds
export const THRESHOLDS: Record<string, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

export type Rating = "good" | "needs-improvement" | "poor";

export function getRating(metric: string, value: number): Rating {
  const t = THRESHOLDS[metric];
  if (!t) return "poor";
  if (value <= t.good) return "good";
  if (value <= t.poor) return "needs-improvement";
  return "poor";
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

export interface AggregatedMetric {
  metric_name: string;
  p50: number;
  p75: number;
  p95: number;
  sample_count: number;
  rating: Rating;
}

export async function getAggregatedMetrics(
  db: SupabaseClient
): Promise<AggregatedMetric[]> {
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await db
    .from("web_vitals")
    .select("metric_name, value")
    .gte("created_at", thirtyDaysAgo)
    .order("metric_name");

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const grouped: Record<string, number[]> = {};
  for (const row of data) {
    if (!grouped[row.metric_name]) grouped[row.metric_name] = [];
    grouped[row.metric_name].push(Number(row.value));
  }

  return Object.entries(grouped).map(([metric_name, values]) => {
    values.sort((a, b) => a - b);
    const p75 = percentile(values, 75);
    return {
      metric_name,
      p50: percentile(values, 50),
      p75,
      p95: percentile(values, 95),
      sample_count: values.length,
      rating: getRating(metric_name, p75),
    };
  });
}

export interface DailyTrend {
  date: string;
  metric_name: string;
  p75: number;
}

export async function getDailyTrends(
  db: SupabaseClient
): Promise<DailyTrend[]> {
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await db
    .from("web_vitals")
    .select("metric_name, value, created_at")
    .gte("created_at", thirtyDaysAgo)
    .order("created_at");

  if (error) throw error;
  if (!data || data.length === 0) return [];

  // Group by date + metric
  const grouped: Record<string, number[]> = {};
  for (const row of data) {
    const date = row.created_at.slice(0, 10);
    const key = `${date}|${row.metric_name}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(Number(row.value));
  }

  return Object.entries(grouped).map(([key, values]) => {
    const [date, metric_name] = key.split("|");
    values.sort((a, b) => a - b);
    return { date, metric_name, p75: percentile(values, 75) };
  });
}

export interface PagePerformance {
  page_url: string;
  metrics: Record<string, { p75: number; rating: Rating }>;
}

export async function getPagePerformance(
  db: SupabaseClient
): Promise<PagePerformance[]> {
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await db
    .from("web_vitals")
    .select("metric_name, value, page_url")
    .gte("created_at", thirtyDaysAgo);

  if (error) throw error;
  if (!data || data.length === 0) return [];

  // Group by page + metric
  const grouped: Record<string, Record<string, number[]>> = {};
  for (const row of data) {
    if (!grouped[row.page_url]) grouped[row.page_url] = {};
    if (!grouped[row.page_url][row.metric_name])
      grouped[row.page_url][row.metric_name] = [];
    grouped[row.page_url][row.metric_name].push(Number(row.value));
  }

  const pages: PagePerformance[] = Object.entries(grouped).map(
    ([page_url, metricMap]) => {
      const metrics: Record<string, { p75: number; rating: Rating }> = {};
      for (const [metric, values] of Object.entries(metricMap)) {
        values.sort((a, b) => a - b);
        const p75 = percentile(values, 75);
        metrics[metric] = { p75, rating: getRating(metric, p75) };
      }
      return { page_url, metrics };
    }
  );

  // Sort by worst LCP p75 first (or any available metric)
  pages.sort((a, b) => {
    const aLcp = a.metrics.LCP?.p75 ?? 0;
    const bLcp = b.metrics.LCP?.p75 ?? 0;
    return bLcp - aLcp;
  });

  return pages;
}

export interface WebVitalAlert {
  id: string;
  metric_name: string;
  page_url: string | null;
  threshold_value: number;
  current_p75: number;
  severity: string;
  resolved: boolean;
  created_at: string;
  resolved_at: string | null;
}

export async function getAlerts(
  db: SupabaseClient
): Promise<WebVitalAlert[]> {
  const { data, error } = await db
    .from("web_vital_alerts")
    .select("*")
    .eq("resolved", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as WebVitalAlert[]) ?? [];
}

export async function checkAndCreateAlerts(
  db: SupabaseClient
): Promise<void> {
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await db
    .from("web_vitals")
    .select("metric_name, value, created_at")
    .gte("created_at", sevenDaysAgo);

  if (error) throw error;
  if (!data || data.length === 0) return;

  // Group by date + metric
  const grouped: Record<string, Record<string, number[]>> = {};
  for (const row of data) {
    const date = row.created_at.slice(0, 10);
    if (!grouped[row.metric_name]) grouped[row.metric_name] = {};
    if (!grouped[row.metric_name][date])
      grouped[row.metric_name][date] = [];
    grouped[row.metric_name][date].push(Number(row.value));
  }

  for (const [metric, dayMap] of Object.entries(grouped)) {
    const threshold = THRESHOLDS[metric];
    if (!threshold) continue;

    let poorDays = 0;
    let latestP75 = 0;

    for (const values of Object.values(dayMap)) {
      values.sort((a, b) => a - b);
      const p75 = percentile(values, 75);
      latestP75 = p75;
      if (p75 > threshold.poor) poorDays++;
    }

    if (poorDays >= 3) {
      // Check if an unresolved alert already exists
      const { data: existing } = await db
        .from("web_vital_alerts")
        .select("id")
        .eq("metric_name", metric)
        .eq("resolved", false)
        .limit(1);

      if (existing && existing.length > 0) continue;

      await db.from("web_vital_alerts").insert({
        metric_name: metric,
        threshold_value: threshold.poor,
        current_p75: latestP75,
        severity: "warning",
      });
    }
  }
}
