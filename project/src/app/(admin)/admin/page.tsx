import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { formatPrice } from "@/lib/stripe";
import { ErrorBoundary } from "@/components/shared";

const statusColors: Record<string, string> = {
  pending: "bg-muted/10 text-muted",
  paid: "bg-info/10 text-info",
  questionnaire: "bg-primary/10 text-primary",
  processing: "bg-info/10 text-info",
  review: "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
  cancelled: "bg-error/10 text-error",
};

const statusLabels: Record<string, string> = {
  pending: "In afwachting",
  paid: "Betaald",
  questionnaire: "Vragenlijst",
  processing: "Verwerking",
  review: "Review",
  completed: "Gereed",
  cancelled: "Geannuleerd",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: orders } = await admin
    .from("orders")
    .select("*, profiles(first_name, last_name), order_items(*, documents(title))")
    .order("created_at", { ascending: false })
    .limit(5);

  const { count: totalOrders } = await admin
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { count: reviewCount } = await admin
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "review");

  const { count: customerCount } = await admin
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "client");

  const { count: docCount } = await admin
    .from("generated_documents")
    .select("*", { count: "exact", head: true });

  const recentOrders = (orders || []).map((o) => {
    const profile = o.profiles as unknown as { first_name: string; last_name: string };
    const items = o.order_items as unknown as { documents: { title: string } }[];
    return {
      id: `LX-${o.order_number}`,
      customer: `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim(),
      doc: items?.[0]?.documents?.title || "Document",
      total: formatPrice(o.total_cents),
      status: o.status,
      statusLabel: statusLabels[o.status] || o.status,
      date: new Date(o.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }),
    };
  });
  return (
    <ErrorBoundary errorTitle="Dashboard fout" errorDescription="Het dashboard kon niet worden geladen.">
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Bestellingen", value: String(totalOrders || 0), change: "", color: "text-success" },
          { label: "Wachtend op review", value: String(reviewCount || 0), change: "", color: "text-primary" },
          { label: "Klanten", value: String(customerCount || 0), change: "", color: "text-success" },
          { label: "Documenten", value: String(docCount || 0), change: "", color: "text-info" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-card-border rounded-xl p-5">
            <p className="text-sm text-muted">{stat.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.change && (
                <span className={`text-xs font-medium ${stat.color} mb-1`}>{stat.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/review"
          className="bg-primary/10 border border-primary/20 rounded-xl p-5 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 012.625 1.26" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-primary">{reviewCount || 0} document(en) wacht(en) op review</p>
              <p className="text-xs text-muted">Bekijk en keur goed</p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/bestellingen"
          className="bg-card border border-card-border rounded-xl p-5 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
              <svg className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Alle bestellingen bekijken</p>
              <p className="text-xs text-muted">{totalOrders || 0} totaal</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent orders table */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-card-border">
          <h2 className="font-semibold">Recente bestellingen</h2>
          <Link href="/admin/bestellingen" className="text-sm text-primary hover:text-primary-hover transition-colors">
            Alle bekijken
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left px-5 py-3 text-muted font-medium">Bestelling</th>
                <th className="text-left px-5 py-3 text-muted font-medium">Klant</th>
                <th className="text-left px-5 py-3 text-muted font-medium">Document</th>
                <th className="text-right px-5 py-3 text-muted font-medium">Bedrag</th>
                <th className="text-center px-5 py-3 text-muted font-medium">Status</th>
                <th className="text-right px-5 py-3 text-muted font-medium">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-card-border/30">
                  <td className="px-5 py-4 font-medium">{order.id}</td>
                  <td className="px-5 py-4 text-muted">{order.customer}</td>
                  <td className="px-5 py-4">{order.doc}</td>
                  <td className="px-5 py-4 text-right">{order.total}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[order.status]}`}>
                      {order.statusLabel}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-muted">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
