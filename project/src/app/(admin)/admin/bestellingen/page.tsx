import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

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
  review: "In review",
  completed: "Gereed",
  cancelled: "Geannuleerd",
};

type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  doc: string;
  total: string;
  status: string;
  date: string;
};

export default async function BestellingenPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const query = admin
    .from("orders")
    .select(
      "id, order_number, total_cents, status, created_at, profiles(first_name, last_name), order_items(documents(title))"
    )
    .order("created_at", { ascending: false });

  const filterMap: Record<string, string> = {
    review: "review",
    questionnaire: "questionnaire",
    completed: "completed",
  };

  if (filter && filterMap[filter]) {
    query.eq("status", filterMap[filter]);
  }

  const { data } = await query;

  const allOrders: Order[] = (data || []).map((o) => {
    const profile = o.profiles as unknown as { first_name: string; last_name: string } | null;
    const items = o.order_items as unknown as { documents: { title: string } }[];
    const name = profile
      ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
      : "-";

    return {
      id: o.id,
      orderNumber: String(o.order_number),
      customer: name || "-",
      doc: items?.[0]?.documents?.title ?? "-",
      total: new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
      }).format(o.total_cents / 100),
      status: o.status,
      date: o.created_at
        ? new Date(o.created_at).toLocaleDateString("nl-NL")
        : "-",
    };
  });

  const activeFilter = filter || "alle";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bestellingen</h1>
          <p className="text-muted mt-1">
            {allOrders.length} bestellingen totaal
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Alle", value: "alle" },
          { label: "In review", value: "review" },
          { label: "Vragenlijst", value: "questionnaire" },
          { label: "Gereed", value: "completed" },
        ].map((f) => (
          <Link
            key={f.value}
            href={f.value === "alle" ? "/admin/bestellingen" : `/admin/bestellingen?filter=${f.value}`}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              activeFilter === f.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-card-border text-muted hover:text-foreground"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
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
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {allOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-muted">
                    Geen bestellingen gevonden
                  </td>
                </tr>
              ) : (
                allOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-card-border/30">
                    <td className="px-5 py-4 font-medium">{order.orderNumber}</td>
                    <td className="px-5 py-4">
                      <p>{order.customer}</p>
                    </td>
                    <td className="px-5 py-4">{order.doc}</td>
                    <td className="px-5 py-4 text-right font-medium">{order.total}</td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[order.status] || "bg-muted/10 text-muted"}`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-muted">{order.date}</td>
                    <td className="px-5 py-4 text-right">
                      {order.status === "review" && (
                        <Link
                          href="/admin/review"
                          className="text-xs text-primary hover:text-primary-hover transition-colors font-medium"
                        >
                          Review
                        </Link>
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
