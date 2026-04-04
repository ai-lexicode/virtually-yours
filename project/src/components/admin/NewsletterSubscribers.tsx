"use client";

import { useState, useEffect, useCallback } from "react";

type Subscriber = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  source: "registered" | "import";
  isActive: boolean;
  listIds: string[];
};

export default function NewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("q", search);
      const res = await fetch(`/api/admin/newsletter/subscribers?${params.toString()}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSubscribers(data.subscribers || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleExport = () => {
    window.location.href = "/api/admin/newsletter/subscribers/export";
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const selectClass = "rounded-lg border border-[#333] bg-[#1a1a1a] text-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Abonnees
          </h1>
          <p className="text-muted text-sm mt-1">{total} abonnees totaal</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-[#333] text-muted hover:text-white hover:border-primary/50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          CSV exporteren
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Zoeken op e-mail of naam..."
          className="rounded-lg border border-[#333] bg-[#1a1a1a] text-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none w-full sm:w-64 placeholder:text-muted/40"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className={selectClass}
        >
          <option value="">Alle statussen</option>
          <option value="active">Actief</option>
          <option value="inactive">Inactief</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-12 text-muted">Geen abonnees gevonden</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full">
            <thead className="bg-[#1a1a1a]">
              <tr>
                <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3">Naam</th>
                <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3">E-mail</th>
                <th className="text-center text-xs font-medium text-muted uppercase px-4 py-3">Type</th>
                <th className="text-center text-xs font-medium text-muted uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3 hidden md:table-cell">Lijsten</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#1a1a1a]/50">
                  <td className="px-4 py-3 text-white text-sm">{sub.firstName} {sub.lastName}</td>
                  <td className="px-4 py-3 text-muted text-sm">{sub.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                      sub.source === "registered" ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {sub.source === "registered" ? "Gebruiker" : "Lead"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                      sub.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {sub.isActive ? "Actief" : "Inactief"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {sub.listIds.length > 0 ? sub.listIds.map((list, i) => (
                        <span key={i} className="inline-block text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                          {list}
                        </span>
                      )) : (
                        <span className="text-muted text-xs">&mdash;</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-[#333] text-muted hover:text-white disabled:opacity-30 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-sm text-muted">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-[#333] text-muted hover:text-white disabled:opacity-30 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
