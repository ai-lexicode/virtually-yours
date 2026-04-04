"use client";

import { cn } from "@/lib/utils";

interface KPICardProps {
  icon: string;
  label: string;
  value: string | number;
  change?: number;
}

export function KPICard({ icon, label, value, change }: KPICardProps) {
  return (
    <div className="rounded-xl bg-card border border-card-border p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-muted">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-primary">{value}</span>
        {change !== undefined && (
          <span
            className={cn(
              "text-xs font-medium mb-0.5",
              change > 0
                ? "text-green-400"
                : change < 0
                  ? "text-red-400"
                  : "text-muted"
            )}
          >
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
    </div>
  );
}
