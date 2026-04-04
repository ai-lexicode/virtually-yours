import { cn } from "@/lib/utils";

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: SkeletonTableProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-card-border animate-pulse",
        className
      )}
    >
      <table className="w-full">
        <thead className="bg-[#1a1a1a]">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-3 bg-card-border/50 rounded w-2/3" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-card-border">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-3">
                  <div
                    className={cn(
                      "h-3 bg-card-border/50 rounded",
                      colIdx === 0 ? "w-3/4" : "w-1/2"
                    )}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
