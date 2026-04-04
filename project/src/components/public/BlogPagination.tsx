"use client";

interface BlogPaginationProps {
  page: number;
  totalPages: number;
  baseUrl: string;
}

export function BlogPagination({ page, totalPages, baseUrl }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  function buildUrl(p: number) {
    const url = new URL(baseUrl, "http://localhost");
    url.searchParams.set("page", String(p));
    return `${url.pathname}?${url.searchParams.toString()}`;
  }

  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      {page > 1 ? (
        <a
          href={buildUrl(page - 1)}
          className="rounded-lg border border-card-border bg-surface-container-lowest px-4 py-2 text-sm text-muted hover:text-on-surface transition-colors"
        >
          &larr; Vorige
        </a>
      ) : (
        <span className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted/30">
          &larr; Vorige
        </span>
      )}

      <span className="text-sm text-muted">
        {page} / {totalPages}
      </span>

      {page < totalPages ? (
        <a
          href={buildUrl(page + 1)}
          className="rounded-lg border border-card-border bg-surface-container-lowest px-4 py-2 text-sm text-muted hover:text-on-surface transition-colors"
        >
          Volgende &rarr;
        </a>
      ) : (
        <span className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted/30">
          Volgende &rarr;
        </span>
      )}
    </div>
  );
}
