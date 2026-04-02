import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const statusColors: Record<string, string> = {
  ready: "bg-success/10 text-success",
  questionnaire: "bg-primary/10 text-primary",
  review: "bg-info/10 text-info",
  paid: "bg-info/10 text-info",
};

const statusLabels: Record<string, string> = {
  ready: "Gereed",
  questionnaire: "Vragenlijst invullen",
  review: "In beoordeling",
  paid: "Betaald",
};

const steps = [
  { label: "Betaald", key: "paid" },
  { label: "Vragenlijst", key: "questionnaire" },
  { label: "Beoordeling", key: "review" },
  { label: "Gereed", key: "ready" },
];

function getStepIndex(status: string) {
  const map: Record<string, number> = {
    paid: 0,
    questionnaire: 1,
    review: 2,
    ready: 3,
  };
  return map[status] ?? 0;
}

export default async function DocumentenPortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orderItems } = await supabase
    .from("order_items")
    .select(
      "id, created_at, documents(title), orders!inner(order_number, status, profile_id)"
    )
    .eq("orders.profile_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const documents = (orderItems || []).map((item) => {
    const doc = item.documents as unknown as { title: string } | null;
    const order = item.orders as unknown as { order_number: string; status: string } | null;
    return {
      id: item.id,
      title: doc?.title ?? "Document",
      orderId: order?.order_number ?? "-",
      purchaseDate: item.created_at
        ? new Date(item.created_at).toLocaleDateString("nl-NL")
        : "-",
      status: order?.status ?? "paid",
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Mijn Documenten</h1>
        <p className="text-muted mt-1">
          Bekijk de status van al uw gekochte documenten.
        </p>
      </div>

      {documents.length === 0 ? (
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <h3 className="mt-4 font-semibold">Nog geen documenten</h3>
          <p className="text-sm text-muted mt-1">
            Uw gekochte documenten verschijnen hier.
          </p>
          <Link
            href="/documenten"
            className="mt-4 inline-block text-sm text-primary hover:text-primary-hover"
          >
            Bekijk documenten &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => {
            const currentStep = getStepIndex(doc.status);
            return (
              <div
                key={doc.id}
                className="bg-card border border-card-border rounded-xl p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{doc.title}</h3>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[doc.status] || "bg-muted/10 text-muted"}`}
                      >
                        {statusLabels[doc.status] || doc.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted mt-1">
                      {doc.orderId} &middot; Gekocht op {doc.purchaseDate}
                    </p>
                  </div>

                  {doc.status === "ready" && (
                    <Link
                      href="/downloads"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                    >
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
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                      Downloaden
                    </Link>
                  )}

                  {doc.status === "questionnaire" && (
                    <Link
                      href="/vragenlijsten"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      Vragenlijst invullen
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
                  )}
                </div>

                {/* Progress steps */}
                <div className="flex items-center gap-1 mt-4">
                  {steps.map((step, i) => (
                    <div key={step.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            i <= currentStep ? "bg-primary" : "bg-card-border"
                          }`}
                        />
                        <span
                          className={`text-xs mt-1 ${
                            i <= currentStep ? "text-primary" : "text-muted"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 -mt-4 ${
                            i < currentStep ? "bg-primary" : "bg-card-border"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
