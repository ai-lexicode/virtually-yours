import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const statusColors: Record<string, string> = {
  completed: "bg-success/10 text-success",
  delivered: "bg-success/10 text-success",
  questionnaire: "bg-secondary-container/30 text-secondary",
  review: "bg-surface-container-high text-primary",
  pending: "bg-surface-container text-muted",
  paid: "bg-surface-container-high text-primary",
  processing: "bg-secondary-container/30 text-secondary",
};

const statusLabels: Record<string, string> = {
  pending: "In afwachting",
  paid: "Betaald",
  questionnaire: "Vragenlijst invullen",
  processing: "In behandeling",
  review: "In beoordeling",
  completed: "Gereed",
  delivered: "Afgeleverd",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/inloggen");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, documents(title))")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const recentOrders = (orders || []).map((o) => {
    const items = o.order_items as unknown as { documents: { title: string } }[];
    return {
      id: `LX-${o.order_number}`,
      document: items?.[0]?.documents?.title || "Document",
      date: new Date(o.created_at).toLocaleDateString("nl-NL"),
      status: o.status,
      statusLabel: statusLabels[o.status] || o.status,
    };
  });

  const totalOrders = orders?.length || 0;
  const readyCount = orders?.filter((o) => o.status === "completed").length || 0;
  const pendingCount = orders?.filter((o) => !["completed", "cancelled"].includes(o.status)).length || 0;
  const openInvoiceCount = orders?.filter((o) => ["pending", "questionnaire"].includes(o.status)).length || 0;
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-on-surface">Dashboard</h1>
        <p className="text-muted mt-1">
          Welkom terug{profile?.first_name ? `, ${profile.first_name}` : ""}. Hier is een overzicht van uw documenten.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Totaal bestellingen", value: String(totalOrders), icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" },
          { label: "Gereed voor download", value: String(readyCount), icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" },
          { label: "In behandeling", value: String(pendingCount), icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Openstaande facturen", value: String(openInvoiceCount), icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-container-lowest rounded-[0.25rem] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[0.25rem] bg-surface-container flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={stat.icon}
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
                <p className="text-xs text-muted font-label">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/vragenlijsten"
          className="bg-surface-container-lowest rounded-[0.25rem] p-5 hover:bg-surface-container-low transition-colors group shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[0.25rem] bg-secondary-container/30 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium group-hover:text-secondary transition-colors text-on-surface">
                Vragenlijsten invullen
              </p>
              <p className="text-xs text-muted font-label">{pendingCount} openstaand</p>
            </div>
          </div>
        </Link>
        <Link
          href="/downloads"
          className="bg-surface-container-lowest rounded-[0.25rem] p-5 hover:bg-surface-container-low transition-colors group shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[0.25rem] bg-success/10 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-success"
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
            </div>
            <div>
              <p className="font-medium group-hover:text-secondary transition-colors text-on-surface">
                Downloads
              </p>
              <p className="text-xs text-muted font-label">{readyCount} document gereed</p>
            </div>
          </div>
        </Link>
        <Link
          href="/documenten"
          className="bg-surface-container-lowest rounded-[0.25rem] p-5 hover:bg-surface-container-low transition-colors group shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[0.25rem] bg-surface-container-high flex items-center justify-center">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium group-hover:text-secondary transition-colors text-on-surface">
                Nieuw document kopen
              </p>
              <p className="text-xs text-muted font-label">Bekijk catalogus</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-surface-container-lowest rounded-[0.25rem] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between p-5 bg-surface-container-low rounded-t-[0.25rem]">
          <h2 className="font-serif font-bold text-on-surface">Recente bestellingen</h2>
          <Link
            href="/facturen"
            className="text-sm text-secondary hover:text-secondary/80 transition-colors font-medium"
          >
            Alle bekijken
          </Link>
        </div>
        <div>
          {recentOrders.map((order, i) => (
            <div
              key={order.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-3 ${i > 0 ? "bg-surface-container-low/20" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-[0.25rem] bg-surface-container flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-on-surface">{order.document}</p>
                  <p className="text-xs text-muted font-label">
                    {order.id} &middot; {order.date}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-[0.25rem] font-label ${statusColors[order.status]}`}
              >
                {order.statusLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
