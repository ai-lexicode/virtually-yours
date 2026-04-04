import { cn } from "@/lib/utils";

export interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

const lineWidths = ["w-3/4", "w-full", "w-5/6", "w-2/3", "w-4/5"];

export function SkeletonCard({ lines = 3, className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-card-border rounded-xl p-5 animate-pulse",
        className
      )}
    >
      <div className="h-4 bg-card-border/50 rounded w-1/3 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-3 bg-card-border/50 rounded",
              lineWidths[i % lineWidths.length]
            )}
          />
        ))}
      </div>
    </div>
  );
}
