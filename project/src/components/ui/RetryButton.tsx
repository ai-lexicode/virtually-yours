"use client";

import { useState } from "react";

export function RetryButton({ questionnaireId }: { questionnaireId: string }) {
  const [retrying, setRetrying] = useState(false);
  const [done, setDone] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const res = await fetch(`/api/questionnaire/${questionnaireId}/retry`, {
        method: "POST",
      });
      if (res.ok) {
        setDone(true);
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch {
      setRetrying(false);
    }
  };

  if (done) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-blue-500">
        <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        Opnieuw genereren...
      </span>
    );
  }

  return (
    <button
      onClick={handleRetry}
      disabled={retrying}
      className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
        />
      </svg>
      Opnieuw proberen
    </button>
  );
}
