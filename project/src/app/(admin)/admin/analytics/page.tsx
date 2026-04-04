"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KPICard } from "@/components/admin/analytics/KPICard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";

interface OverviewData {
  revenue: { cents: number; formatted: string };
  activeCustomers: number;
  orders: number;
  completionRate: number;
}

export default function AnalyticsOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics/overview")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load overview");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Analytics</h1>
        <Link
          href="/admin/analytics/web-vitals"
          className="text-sm text-muted hover:text-primary transition-colors"
        >
          Web Vitals &rarr;
        </Link>
      </div>

      {error && (
        <div className="rounded-xl bg-red-400/10 border border-red-400/30 p-4 mb-6 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon="\u20AC"
            label="Revenue (30d)"
            value={data.revenue.formatted}
          />
          <KPICard
            icon="\uD83D\uDC64"
            label="Active Customers"
            value={data.activeCustomers}
          />
          <KPICard
            icon="\uD83D\uDCE6"
            label="Orders (30d)"
            value={data.orders}
          />
          <KPICard
            icon="\u2705"
            label="Completion Rate"
            value={`${data.completionRate}%`}
          />
        </div>
      ) : null}

      <div className="mt-8 rounded-xl bg-card border border-card-border p-6">
        <p className="text-sm text-muted">
          Last 30 days overview. For detailed performance data, visit the{" "}
          <Link
            href="/admin/analytics/web-vitals"
            className="text-primary hover:underline"
          >
            Web Vitals dashboard
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
