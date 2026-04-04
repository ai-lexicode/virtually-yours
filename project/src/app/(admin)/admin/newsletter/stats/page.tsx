import { Suspense } from "react";
import NewsletterStats from "@/components/admin/NewsletterStats";

export default function NewsletterStatsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-12">
        <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
      </div>
    }>
      <NewsletterStats />
    </Suspense>
  );
}
