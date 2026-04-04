import { SkeletonCard } from "@/components/shared";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="h-8 bg-card-border/50 rounded w-48 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} lines={2} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={2} />
      </div>
      <SkeletonCard lines={6} />
    </div>
  );
}
