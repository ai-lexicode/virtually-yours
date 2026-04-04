"use client";

import { useState, useEffect, useCallback } from "react";

type DripSequence = {
  id: string;
  name: string;
  trigger_type: "welcome" | "re_engagement";
  is_active: boolean;
  step_count: number;
  created_at: string;
  updated_at: string;
};

type DripStep = {
  id: string;
  sequence_id: string;
  delay_days: number;
  subject: string;
  content: string;
  step_order: number;
  created_at: string;
};

const TRIGGER_LABELS: Record<string, string> = {
  welcome: "Welkom",
  re_engagement: "Re-engagement",
};

export default function NewsletterDrip() {
  const [sequences, setSequences] = useState<DripSequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeq, setSelectedSeq] = useState<DripSequence | null>(null);
  const [steps, setSteps] = useState<DripStep[]>([]);
  const [stepsLoading, setStepsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Create/edit sequence form
  const [showForm, setShowForm] = useState(false);
  const [editingSeq, setEditingSeq] = useState<DripSequence | null>(null);
  const [formName, setFormName] = useState("");
  const [formTrigger, setFormTrigger] = useState<"welcome" | "re_engagement">("welcome");

  // Step form
  const [showStepForm, setShowStepForm] = useState(false);
  const [editingStep, setEditingStep] = useState<DripStep | null>(null);
  const [stepSubject, setStepSubject] = useState("");
  const [stepContent, setStepContent] = useState("");
  const [stepDelayDays, setStepDelayDays] = useState(0);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSequences = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/newsletter/drip");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSequences(data);
    } catch {
      showToast("Sequences laden mislukt", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSequences();
  }, [fetchSequences]);

  const fetchSteps = async (seqId: string) => {
    setStepsLoading(true);
    try {
      const res = await fetch(`/api/admin/newsletter/drip/${seqId}/steps`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSteps(data);
    } catch {
      showToast("Steps laden mislukt", "error");
    } finally {
      setStepsLoading(false);
    }
  };

  const selectSequence = (seq: DripSequence) => {
    setSelectedSeq(seq);
    fetchSteps(seq.id);
  };

  // ── Sequence CRUD ──────────────────────────────────────────────────

  const openCreateForm = () => {
    setEditingSeq(null);
    setFormName("");
    setFormTrigger("welcome");
    setShowForm(true);
  };

  const openEditForm = (seq: DripSequence) => {
    setEditingSeq(seq);
    setFormName(seq.name);
    setFormTrigger(seq.trigger_type);
    setShowForm(true);
  };

  const saveSequence = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    try {
      const url = editingSeq
        ? `/api/admin/newsletter/drip/${editingSeq.id}`
        : "/api/admin/newsletter/drip";
      const method = editingSeq ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, trigger_type: formTrigger }),
      });
      if (!res.ok) throw new Error();
      showToast(editingSeq ? "Sequence bijgewerkt" : "Sequence aangemaakt", "success");
      setShowForm(false);
      fetchSequences();
    } catch {
      showToast("Opslaan mislukt", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteSequence = async (seq: DripSequence) => {
    if (!confirm(`Weet u zeker dat u "${seq.name}" wilt verwijderen?`)) return;
    try {
      const res = await fetch(`/api/admin/newsletter/drip/${seq.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Sequence verwijderd", "success");
      if (selectedSeq?.id === seq.id) {
        setSelectedSeq(null);
        setSteps([]);
      }
      fetchSequences();
    } catch {
      showToast("Verwijderen mislukt", "error");
    }
  };

  const toggleActive = async (seq: DripSequence) => {
    try {
      const res = await fetch(`/api/admin/newsletter/drip/${seq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !seq.is_active }),
      });
      if (!res.ok) throw new Error();
      fetchSequences();
    } catch {
      showToast("Status wijzigen mislukt", "error");
    }
  };

  // ── Step CRUD ──────────────────────────────────────────────────────

  const openCreateStep = () => {
    setEditingStep(null);
    setStepSubject("");
    setStepContent("");
    setStepDelayDays(steps.length === 0 ? 0 : (steps[steps.length - 1]?.delay_days ?? 0) + 1);
    setShowStepForm(true);
  };

  const openEditStep = (step: DripStep) => {
    setEditingStep(step);
    setStepSubject(step.subject);
    setStepContent(step.content);
    setStepDelayDays(step.delay_days);
    setShowStepForm(true);
  };

  const saveStep = async () => {
    if (!selectedSeq || !stepSubject.trim() || !stepContent.trim()) return;
    setSaving(true);
    try {
      const url = editingStep
        ? `/api/admin/newsletter/drip/${selectedSeq.id}/steps/${editingStep.id}`
        : `/api/admin/newsletter/drip/${selectedSeq.id}/steps`;
      const method = editingStep ? "PUT" : "POST";
      const body: Record<string, unknown> = {
        subject: stepSubject,
        content: stepContent,
        delay_days: stepDelayDays,
      };
      if (!editingStep) {
        body.step_order = steps.length;
      }
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      showToast(editingStep ? "Step bijgewerkt" : "Step aangemaakt", "success");
      setShowStepForm(false);
      fetchSteps(selectedSeq.id);
      fetchSequences();
    } catch {
      showToast("Opslaan mislukt", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteStep = async (step: DripStep) => {
    if (!selectedSeq) return;
    if (!confirm("Weet u zeker dat u deze step wilt verwijderen?")) return;
    try {
      const res = await fetch(
        `/api/admin/newsletter/drip/${selectedSeq.id}/steps/${step.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      showToast("Step verwijderd", "success");
      fetchSteps(selectedSeq.id);
      fetchSequences();
    } catch {
      showToast("Verwijderen mislukt", "error");
    }
  };

  const moveStep = async (step: DripStep, direction: "up" | "down") => {
    if (!selectedSeq) return;
    const idx = steps.findIndex((s) => s.id === step.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= steps.length) return;

    const other = steps[swapIdx];
    try {
      await Promise.all([
        fetch(`/api/admin/newsletter/drip/${selectedSeq.id}/steps/${step.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step_order: other.step_order }),
        }),
        fetch(`/api/admin/newsletter/drip/${selectedSeq.id}/steps/${other.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step_order: step.step_order }),
        }),
      ]);
      fetchSteps(selectedSeq.id);
    } catch {
      showToast("Volgorde wijzigen mislukt", "error");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-card rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Sequence list */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">Drip Sequences</h2>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Nieuwe sequence
        </button>
      </div>

      {sequences.length === 0 ? (
        <div className="text-center py-12 text-muted">
          <p>Nog geen drip sequences aangemaakt.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sequences.map((seq) => (
            <div
              key={seq.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedSeq?.id === seq.id
                  ? "border-primary bg-primary/5"
                  : "border-card-border bg-card hover:border-primary/50"
              }`}
              onClick={() => selectSequence(seq)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary">{seq.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container text-muted">
                    {TRIGGER_LABELS[seq.trigger_type] || seq.trigger_type}
                  </span>
                  <span className="text-xs text-muted">{seq.step_count} steps</span>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleActive(seq)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      seq.is_active ? "bg-green-600" : "bg-gray-600"
                    }`}
                    title={seq.is_active ? "Actief" : "Inactief"}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        seq.is_active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => openEditForm(seq)}
                    className="p-1.5 text-muted hover:text-primary transition-colors"
                    title="Bewerken"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteSequence(seq)}
                    className="p-1.5 text-muted hover:text-red-500 transition-colors"
                    title="Verwijderen"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sequence form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-card-border rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-primary mb-4">
              {editingSeq ? "Sequence bewerken" : "Nieuwe sequence"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Naam</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container border border-card-border rounded-lg text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Welkom serie..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Trigger type</label>
                <select
                  value={formTrigger}
                  onChange={(e) => setFormTrigger(e.target.value as "welcome" | "re_engagement")}
                  className="w-full px-3 py-2 bg-surface-container border border-card-border rounded-lg text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="welcome">Welkom (bij aanmelding)</option>
                  <option value="re_engagement">Re-engagement (inactief &gt;30 dagen)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-muted hover:text-primary transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={saveSequence}
                disabled={saving || !formName.trim()}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Opslaan..." : "Opslaan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Steps panel */}
      {selectedSeq && (
        <div className="border border-card-border rounded-xl bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold text-primary">
              Steps van &quot;{selectedSeq.name}&quot;
            </h3>
            <button
              onClick={openCreateStep}
              className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              + Step toevoegen
            </button>
          </div>

          {stepsLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-surface-container rounded-lg" />
              ))}
            </div>
          ) : steps.length === 0 ? (
            <p className="text-muted text-sm text-center py-8">
              Nog geen steps. Voeg de eerste step toe.
            </p>
          ) : (
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="border border-card-border rounded-lg p-4 bg-surface-container"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted">#{idx + 1}</span>
                        <span className="text-sm font-medium text-primary">{step.subject}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted">
                        <span>Vertraging: {step.delay_days} {step.delay_days === 1 ? "dag" : "dagen"}</span>
                      </div>
                      <p className="text-xs text-muted mt-1 line-clamp-2">{step.content}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveStep(step, "up")}
                        disabled={idx === 0}
                        className="p-1 text-muted hover:text-primary disabled:opacity-30 transition-colors"
                        title="Omhoog"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveStep(step, "down")}
                        disabled={idx === steps.length - 1}
                        className="p-1 text-muted hover:text-primary disabled:opacity-30 transition-colors"
                        title="Omlaag"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openEditStep(step)}
                        className="p-1 text-muted hover:text-primary transition-colors"
                        title="Bewerken"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteStep(step)}
                        className="p-1 text-muted hover:text-red-500 transition-colors"
                        title="Verwijderen"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step form modal */}
      {showStepForm && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center" onClick={() => setShowStepForm(false)}>
          <div className="bg-card border border-card-border rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-primary mb-4">
              {editingStep ? "Step bewerken" : "Nieuwe step"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Vertraging (dagen na trigger)</label>
                <input
                  type="number"
                  min={0}
                  value={stepDelayDays}
                  onChange={(e) => setStepDelayDays(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-surface-container border border-card-border rounded-lg text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Onderwerp</label>
                <input
                  type="text"
                  value={stepSubject}
                  onChange={(e) => setStepSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container border border-card-border rounded-lg text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Welkom bij Virtually Yours!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Inhoud (HTML)</label>
                <textarea
                  value={stepContent}
                  onChange={(e) => setStepContent(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 bg-surface-container border border-card-border rounded-lg text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="<p>Hallo!</p>..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowStepForm(false)}
                className="px-4 py-2 text-sm text-muted hover:text-primary transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={saveStep}
                disabled={saving || !stepSubject.trim() || !stepContent.trim()}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Opslaan..." : "Opslaan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
