import { createClient } from "@/lib/supabase/server";
import { formatPrice, calculateBtw } from "@/lib/mollie";

export default async function FacturenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, total_cents, status, created_at, order_items(documents(title))")
    .eq("profile_id", user?.id ?? "")
    .in("status", ["paid", "questionnaire", "review", "delivered", "ready"])
    .order("created_at", { ascending: false });

  const statusMap: Record<string, { label: string; color: string }> = {
    paid: { label: "Betaald", color: "text-success" },
    questionnaire: { label: "In behandeling", color: "text-warning" },
    review: { label: "In review", color: "text-info" },
    delivered: { label: "Afgerond", color: "text-success" },
    completed: { label: "Afgerond", color: "text-success" },
  };

  const invoices = (orders || []).map((order) => {
    const items = order.order_items as unknown as { documents: { title: string } }[];
    const description = items?.map((i) => i.documents?.title).filter(Boolean).join(", ") || "-";
    const btw = calculateBtw(order.total_cents);
    const subtotal = order.total_cents - btw;
    const statusInfo = statusMap[order.status] || { label: order.status, color: "text-muted" };
    return {
      id: order.order_number,
      orderId: order.order_number,
      date: order.created_at
        ? new Date(order.created_at).toLocaleDateString("nl-NL")
        : "-",
      description,
      subtotal: formatPrice(subtotal),
      btw: formatPrice(btw),
      total: formatPrice(order.total_cents),
      totalCents: order.total_cents,
      btwCents: btw,
      status: order.status,
      statusLabel: statusInfo.label,
      statusColor: statusInfo.color,
    };
  });

  const totalSpent = invoices.reduce((sum, inv) => sum + inv.totalCents, 0);
  const totalBtw = invoices.reduce((sum, inv) => sum + inv.btwCents, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Facturen</h1>
        <p className="text-muted mt-1">
          Bekijk en download uw facturen voor de boekhouding.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-card-border rounded-xl p-5">
          <p className="text-sm text-muted">Totaal besteed</p>
          <p className="text-2xl font-bold mt-1">{formatPrice(totalSpent)}</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-5">
          <p className="text-sm text-muted">Totaal BTW</p>
          <p className="text-2xl font-bold mt-1">{formatPrice(totalBtw)}</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-5">
          <p className="text-sm text-muted">Aantal facturen</p>
          <p className="text-2xl font-bold mt-1">{invoices.length}</p>
        </div>
      </div>

      {invoices.length > 0 ? (
        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left px-5 py-3 text-muted font-medium">Factuurnr.</th>
                  <th className="text-left px-5 py-3 text-muted font-medium">Datum</th>
                  <th className="text-left px-5 py-3 text-muted font-medium">Omschrijving</th>
                  <th className="text-right px-5 py-3 text-muted font-medium">Excl. BTW</th>
                  <th className="text-right px-5 py-3 text-muted font-medium">BTW</th>
                  <th className="text-right px-5 py-3 text-muted font-medium">Totaal</th>
                  <th className="text-center px-5 py-3 text-muted font-medium">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-card-border/30">
                    <td className="px-5 py-4 font-medium">{inv.id}</td>
                    <td className="px-5 py-4 text-muted">{inv.date}</td>
                    <td className="px-5 py-4">{inv.description}</td>
                    <td className="px-5 py-4 text-right text-muted">{inv.subtotal}</td>
                    <td className="px-5 py-4 text-right text-muted">{inv.btw}</td>
                    <td className="px-5 py-4 text-right font-medium">{inv.total}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full bg-success/10 ${inv.statusColor}`}>
                        {inv.statusLabel}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        className="text-muted opacity-50 cursor-not-allowed"
                        disabled
                        title="Binnenkort beschikbaar"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-card-border rounded-xl p-12 text-center">
          <h3 className="font-semibold">Nog geen facturen</h3>
          <p className="text-sm text-muted mt-1">
            Facturen verschijnen hier na uw eerste bestelling.
          </p>
        </div>
      )}
    </div>
  );
}
