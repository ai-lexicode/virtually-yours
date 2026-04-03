"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Customer = {
  id: string;
  name: string;
  email: string;
  company: string;
  kvk: string;
  orders: number;
  totalSpent: string;
  joinedAt: string;
};

export default function KlantenPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Verwijderen mislukt");
      }
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  }

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function loadCustomers() {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, company_name, kvk_number, created_at")
        .order("created_at", { ascending: false });

      const { data: orders } = await supabase
        .from("orders")
        .select("profile_id, total_cents")
        .in("status", ["paid", "questionnaire", "review", "delivered", "ready"]);

      const ordersByUser = new Map<string, { count: number; total: number }>();
      (orders || []).forEach((o) => {
        const current = ordersByUser.get(o.profile_id) || { count: 0, total: 0 };
        current.count += 1;
        current.total += o.total_cents;
        ordersByUser.set(o.profile_id, current);
      });

      const custs: Customer[] = (profiles || []).map((p) => {
        const stats = ordersByUser.get(p.id) || { count: 0, total: 0 };
        const name = `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "-";
        return {
          id: p.id,
          name,
          email: "",
          company: p.company_name ?? "-",
          kvk: p.kvk_number ?? "-",
          orders: stats.count,
          totalSpent: new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
          }).format(stats.total / 100),
          joinedAt: p.created_at
            ? new Date(p.created_at).toLocaleDateString("nl-NL")
            : "-",
        };
      });

      setCustomers(custs);
      setLoading(false);
    }

    loadCustomers();
  }, []);

  const filtered = search
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.company.toLowerCase().includes(search.toLowerCase())
      )
    : customers;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Klanten</h1>
          <p className="text-muted mt-1">
            {customers.length} klanten geregistreerd
          </p>
        </div>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek klant..."
            className="w-full sm:w-64 bg-card border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left px-5 py-3 text-muted font-medium">Klant</th>
                <th className="text-left px-5 py-3 text-muted font-medium">Bedrijf</th>
                <th className="text-left px-5 py-3 text-muted font-medium">KvK</th>
                <th className="text-center px-5 py-3 text-muted font-medium">Bestellingen</th>
                <th className="text-right px-5 py-3 text-muted font-medium">Besteed</th>
                <th className="text-right px-5 py-3 text-muted font-medium">Lid sinds</th>
                <th className="text-right px-5 py-3 text-muted font-medium w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-muted">
                    Laden...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-muted">
                    Geen klanten gevonden
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-card-border/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                          {c.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <p className="font-medium">{c.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">{c.company}</td>
                    <td className="px-5 py-4 text-muted">{c.kvk}</td>
                    <td className="px-5 py-4 text-center">{c.orders}</td>
                    <td className="px-5 py-4 text-right font-medium">{c.totalSpent}</td>
                    <td className="px-5 py-4 text-right text-muted">{c.joinedAt}</td>
                    <td className="px-5 py-4 text-right">
                      {confirmId === c.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(c.id)}
                            disabled={deleting === c.id}
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            {deleting === c.id ? "..." : "Ja"}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="text-xs px-2 py-1 bg-card-border text-foreground rounded hover:bg-muted/30"
                          >
                            Nee
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(c.id)}
                          title="Verwijderen"
                          className="text-muted hover:text-red-500 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
