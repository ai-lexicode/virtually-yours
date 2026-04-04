"use client";

import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  metric_name: string;
  page_url: string | null;
  threshold_value: number;
  current_p75: number;
  severity: string;
  created_at: string;
}

interface WebVitalsAlertsProps {
  alerts: Alert[];
  onResolve: (id: string) => void;
  resolving?: string | null;
}

export function WebVitalsAlerts({
  alerts,
  onResolve,
  resolving,
}: WebVitalsAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-card-border p-5">
        <h3 className="text-sm font-semibold text-primary mb-2">Alerts</h3>
        <p className="text-xs text-muted">No active alerts</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-card-border p-5">
      <h3 className="text-sm font-semibold text-primary mb-3">
        Active Alerts ({alerts.length})
      </h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "flex items-center justify-between rounded-lg border p-3",
              alert.severity === "critical"
                ? "border-red-400/30 bg-red-400/5"
                : "border-amber-400/30 bg-amber-400/5"
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-semibold px-1.5 py-0.5 rounded",
                    alert.severity === "critical"
                      ? "bg-red-400/20 text-red-400"
                      : "bg-amber-400/20 text-amber-400"
                  )}
                >
                  {alert.metric_name}
                </span>
                <span className="text-xs text-muted truncate">
                  p75: {Math.round(alert.current_p75)} (threshold:{" "}
                  {Math.round(alert.threshold_value)})
                </span>
              </div>
              {alert.page_url && (
                <p className="text-xs text-muted mt-1 truncate">
                  {alert.page_url}
                </p>
              )}
              <p className="text-xs text-muted mt-0.5">
                {new Date(alert.created_at).toLocaleDateString("nl-NL")}
              </p>
            </div>
            <button
              onClick={() => onResolve(alert.id)}
              disabled={resolving === alert.id}
              className="ml-3 text-xs px-3 py-1.5 rounded-lg bg-card border border-card-border text-muted hover:text-primary hover:border-primary/50 transition-colors disabled:opacity-50"
            >
              {resolving === alert.id ? "..." : "Resolve"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
