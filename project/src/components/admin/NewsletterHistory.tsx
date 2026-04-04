"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";
import { EmptyState } from "@/components/shared";

type NewsletterItem = {
  id: string;
  subject: string;
  listType: string;
  recipientCount: number;
  sentBy: string;
  sentAt: string;
  openRate?: number;
  clickRate?: number;
};

export default function NewsletterHistory() {
  const [items, setItems] = useState<NewsletterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage.toString(), limit: "10" });
      const res = await fetch(`/api/admin/newsletter/history?${params.toString()}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setItems(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const loadDetail = async (id: string) => {
    setSelectedId(id);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/newsletter/stats/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDetail(data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Geschiedenis
      </h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Geen verzonden nieuwsbrieven"
          description="Verstuurde nieuwsbrieven verschijnen hier."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="w-full">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3">Onderwerp</th>
                  <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3">Datum</th>
                  <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3 hidden md:table-cell">Type</th>
                  <th className="text-center text-xs font-medium text-muted uppercase px-4 py-3">Ontvangers</th>
                  <th className="text-center text-xs font-medium text-muted uppercase px-4 py-3 hidden sm:table-cell">Open %</th>
                  <th className="text-center text-xs font-medium text-muted uppercase px-4 py-3 hidden sm:table-cell">Klik %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#1a1a1a]/50 cursor-pointer"
                    onClick={() => loadDetail(item.id)}
                  >
                    <td className="px-4 py-3 text-white text-sm font-medium">{item.subject}</td>
                    <td className="px-4 py-3">
                      <p className="text-muted text-xs">{new Date(item.sentAt).toLocaleDateString("nl-NL")}</p>
                      <p className="text-muted/50 text-xs">{new Date(item.sentAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", hour12: false })}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-muted text-sm">{item.listType}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-white text-sm font-medium">{item.recipientCount}</td>
                    <td className="px-4 py-3 text-center text-muted text-sm hidden sm:table-cell">
                      {item.openRate != null ? `${item.openRate}%` : "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-center text-muted text-sm hidden sm:table-cell">
                      {item.clickRate != null ? `${item.clickRate}%` : "\u2014"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-[#333] text-muted hover:text-white disabled:opacity-30 transition-colors"
              >
                &laquo;
              </button>
              <div className="flex items-center px-3 text-white text-sm">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-[#333] text-muted hover:text-white disabled:opacity-30 transition-colors"
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail modal */}
      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => { setSelectedId(null); setDetail(null); }}>
          <div className="bg-[#222222] border border-[#333] rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Details</h2>
              <button onClick={() => { setSelectedId(null); setDetail(null); }} className="text-muted hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {detailLoading ? (
              <div className="flex justify-center py-8">
                <svg className="h-6 w-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </div>
            ) : detail ? (
              <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(detail as any).metrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {[
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      { label: "Verzonden", value: (detail as any).metrics.total },
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      { label: "Open %", value: `${(detail as any).metrics.openRate}%` },
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      { label: "Klik %", value: `${(detail as any).metrics.clickRate}%` },
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      { label: "Bounce %", value: `${(detail as any).metrics.bounceRate || 0}%` },
                    ].map((m) => (
                      <div key={m.label} className="rounded-lg border border-[#333] bg-[#1a1a1a] p-3">
                        <div className="text-xs text-muted">{m.label}</div>
                        <div className="text-lg font-bold text-white">{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(detail as any).clicksByUrl?.length > 0 && (
                  <div className="rounded-lg border border-[#333] bg-[#1a1a1a] p-4">
                    <h3 className="text-white font-semibold text-sm mb-2">Klik-overzicht</h3>
                    <div className="space-y-1">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(detail as any).clicksByUrl.map((c: { url: string; count: number }) => (
                        <div key={c.url} className="flex items-center justify-between text-sm py-1 border-b border-[#333]/30 last:border-0">
                          <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{c.url}</a>
                          <span className="text-white font-medium ml-2 whitespace-nowrap">{c.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted text-center py-4">Geen data beschikbaar</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
