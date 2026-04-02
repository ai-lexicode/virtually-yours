import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RetryButton } from "@/components/ui/RetryButton";

const statusConfig: Record<string, { label: string; color: string }> = {
  in_progress: { label: "Bezig", color: "bg-primary/10 text-primary" },
  not_started: { label: "Niet gestart", color: "bg-muted/10 text-muted" },
  completed: { label: "Voltooid", color: "bg-success/10 text-success" },
  generating: { label: "Wordt gegenereerd", color: "bg-blue-500/10 text-blue-500" },
  error: { label: "Fout", color: "bg-red-500/10 text-red-500" },
};

export default async function VragenlijstenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: questionnaires } = await supabase
    .from("questionnaires")
    .select(
      "id, status, progress_percentage, updated_at, order_items(documents(title), orders!inner(order_number, profile_id))"
    )
    .eq("order_items.orders.profile_id", user?.id ?? "")
    .order("updated_at", { ascending: false });

  const items = (questionnaires || []).map((q) => {
    const orderItem = q.order_items as unknown as {
      documents: { title: string };
      orders: { order_number: string };
    } | null;
    return {
      id: q.id,
      document: orderItem?.documents?.title ?? "Document",
      orderId: orderItem?.orders?.order_number ?? "-",
      progress: q.progress_percentage ?? 0,
      updatedAt: q.updated_at
        ? new Date(q.updated_at).toLocaleDateString("nl-NL")
        : "-",
      status: q.status ?? "not_started",
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Vragenlijsten</h1>
        <p className="text-muted mt-1">
          Vul de vragenlijsten in om uw documenten te laten genereren.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-card border border-card-border rounded-xl p-12 text-center">
          <svg
            className="h-12 w-12 text-muted mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
            />
          </svg>
          <h3 className="mt-4 font-semibold">Nog geen vragenlijsten</h3>
          <p className="text-sm text-muted mt-1">
            Vragenlijsten verschijnen hier na het bestellen van een document.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((q) => {
            const config =
              statusConfig[q.status] || statusConfig["not_started"];
            return (
              <div
                key={q.id}
                className="bg-card border border-card-border rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{q.document}</h3>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted mt-1">
                      Bestelling: {q.orderId} &middot; Laatst bijgewerkt:{" "}
                      {q.updatedAt}
                    </p>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted mb-1.5">
                        <span>Voortgang</span>
                        <span>{q.progress}%</span>
                      </div>
                      <div className="h-2 bg-card-border rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            q.progress === 100 ? "bg-success" : "bg-primary"
                          }`}
                          style={{ width: `${q.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:ml-4">
                    {q.status === "not_started" || q.status === "in_progress" ? (
                      <Link
                        href={`/vragenlijsten/${q.id}`}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                      >
                        {q.status === "not_started"
                          ? "Starten"
                          : "Verdergaan"}
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
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </Link>
                    ) : q.status === "generating" ? (
                      <span className="inline-flex items-center gap-2 text-sm text-blue-500">
                        <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                        Bezig met genereren...
                      </span>
                    ) : q.status === "error" ? (
                      <RetryButton questionnaireId={q.id} />
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm text-success">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Voltooid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
