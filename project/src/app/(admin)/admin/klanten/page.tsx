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
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted">
                    Laden...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted">
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
