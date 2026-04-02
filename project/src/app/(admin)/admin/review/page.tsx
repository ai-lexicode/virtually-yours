"use client";

import { useState, useEffect } from "react";

type ReviewItem = {
  id: string;
  orderUuid: string;
  orderId: string;
  customer: string;
  company: string;
  document: string;
  submittedAt: string;
};

export default function ReviewPage() {
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviewItems() {
      const res = await fetch("/api/admin/review");
      const items: ReviewItem[] = res.ok ? await res.json() : [];

      setReviewItems(items);
      if (items.length > 0) setSelectedItem(items[0]);
      setLoading(false);
    }

    loadReviewItems();
  }, []);

  const handleAction = async (action: "approve" | "reject" | "changes") => {
    if (!selectedItem) return;

    const res = await fetch("/api/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: selectedItem.orderUuid,
        action,
        note,
      }),
    });

    if (res.ok) {
      setReviewItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      setSelectedItem(
        reviewItems.length > 1
          ? reviewItems.find((i) => i.id !== selectedItem.id) ?? null
          : null
      );
      setNote("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted">
        Laden...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Document Review</h1>
        <p className="text-muted mt-1">
          Controleer gegenereerde documenten voordat ze worden afgeleverd.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue list */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted">
            Wachtrij ({reviewItems.length})
          </h2>
          {reviewItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`w-full text-left bg-card border rounded-xl p-4 transition-colors ${
                selectedItem?.id === item.id
                  ? "border-primary"
                  : "border-card-border hover:border-primary/50"
              }`}
            >
              <p className="font-medium text-sm">{item.document}</p>
              <p className="text-xs text-muted mt-1">
                {item.customer} &middot; {item.orderId}
              </p>
              <p className="text-xs text-muted">{item.submittedAt}</p>
            </button>
          ))}

          {reviewItems.length === 0 && (
            <div className="bg-card border border-card-border rounded-xl p-8 text-center">
              <svg
                className="h-8 w-8 text-success mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-muted mt-2">
                Geen documenten in de wachtrij
              </p>
            </div>
          )}
        </div>

        {/* Detail view */}
        {selectedItem && (
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <div className="bg-card border border-card-border rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedItem.document}
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    {selectedItem.customer} ({selectedItem.company}) &middot;{" "}
                    {selectedItem.orderId}
                  </p>
                </div>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-warning/10 text-warning">
                  Wacht op review
                </span>
              </div>
            </div>

            {/* Questionnaire info */}
            <div className="bg-card border border-card-border rounded-xl p-5">
              <h4 className="font-medium mb-4">Vragenlijst</h4>
              <p className="text-sm text-muted">
                De antwoorden zijn verwerkt via Docassemble en het document is gegenereerd.
              </p>
            </div>

            {/* Generated document preview */}
            <div className="bg-card border border-card-border rounded-xl p-5">
              <h4 className="font-medium mb-4">Gegenereerd document</h4>
              <div className="bg-background border border-card-border rounded-lg p-8 text-center">
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
                <p className="text-sm text-muted mt-3">Document preview</p>
              </div>
            </div>

            {/* Notes & Actions */}
            <div className="bg-card border border-card-border rounded-xl p-5">
              <h4 className="font-medium mb-3">Opmerkingen</h4>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optionele opmerking voor de klant..."
                rows={3}
                className="w-full bg-background border border-card-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
              <button
                onClick={() => handleAction("reject")}
                className="flex items-center gap-2 text-sm text-error border border-error/30 hover:bg-error/10 px-5 py-2.5 rounded-lg transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Afwijzen
              </button>
              <button
                onClick={() => handleAction("changes")}
                className="flex items-center gap-2 text-sm text-primary border border-primary/30 hover:bg-primary/10 px-5 py-2.5 rounded-lg transition-colors"
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
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                  />
                </svg>
                Wijzigingen vragen
              </button>
              <button
                onClick={() => handleAction("approve")}
                className="flex items-center gap-2 bg-success hover:bg-success/90 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
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
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                Goedkeuren & Afleveren
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
