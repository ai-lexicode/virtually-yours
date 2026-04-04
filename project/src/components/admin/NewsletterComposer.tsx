"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import NewsletterAudienceSelector, { type AudienceSelection } from "./NewsletterAudienceSelector";
import EmailEditorShell, { type EmailBlock } from "./EmailEditorShell";

interface DraftSummary {
  id: string;
  subject: string;
  listType: string;
  createdAt: string;
  updatedAt: string;
}

interface SendProgress {
  newsletterId: string;
  sent: number;
  total: number;
  failed: number;
  done: boolean;
}

export default function NewsletterComposer() {
  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [audience, setAudience] = useState<AudienceSelection>({ listType: "general" });
  const [audienceCount, setAudienceCount] = useState<number>(0);
  const [draftId, setDraftId] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [drafts, setDrafts] = useState<DraftSummary[]>([]);
  const [sendProgress, setSendProgress] = useState<SendProgress | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const statusPollerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAudienceChange = (val: AudienceSelection) => {
    setAudience(val);
    const params = new URLSearchParams({ listType: val.listType });
    if (val.listId) params.set("listId", val.listId);
    fetch(`/api/admin/newsletter/audience?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setAudienceCount(d.count || 0))
      .catch(() => setAudienceCount(0));
  };

  const canSend = subject.trim() && blocks.length > 0;

  const handleBlocksChange = useCallback((newBlocks: EmailBlock[]) => {
    setBlocks(newBlocks);
  }, []);

  // Test send
  const handleTestSend = async () => {
    if (!canSend) return;
    setTestSending(true);
    try {
      const res = await fetch("/api/admin/newsletter/send/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content: blocks }),
      });
      if (!res.ok) throw new Error("TEST_SEND_FAILED");
      const data = await res.json();
      showToast(`Testmail verzonden naar ${data.email}`, "success");
    } catch {
      showToast("Testmail verzenden mislukt", "error");
    } finally {
      setTestSending(false);
    }
  };

  // Save draft
  const handleSaveDraft = async () => {
    if (!subject.trim()) {
      showToast("Vul een onderwerp in", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...(draftId ? { id: draftId } : {}),
        subject,
        content: blocks,
        listType: audience.listType,
        ...(audience.listId && { listId: audience.listId }),
      };
      const res = await fetch("/api/admin/newsletter/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("SAVE_FAILED");
      const data = await res.json();
      setDraftId(data.draft.id);
      showToast("Concept opgeslagen", "success");
    } catch {
      showToast("Opslaan mislukt", "error");
    } finally {
      setSaving(false);
    }
  };

  // Load drafts list
  const loadDrafts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/newsletter/draft");
      if (!res.ok) return;
      const data = await res.json();
      setDrafts(data.drafts || []);
    } catch {
      // ignore
    }
  }, []);

  // Load a specific draft
  const loadDraft = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/newsletter/draft?id=${id}`);
      if (!res.ok) return;
      const data = await res.json();
      const draft = data.draft;
      setDraftId(draft.id);
      setSubject(draft.subject);
      setBlocks(Array.isArray(draft.content) ? draft.content : []);
      setAudience({ listType: draft.listType || "general" });
      setDraftsOpen(false);
      showToast("Concept geladen", "success");
    } catch {
      showToast("Concept laden mislukt", "error");
    }
  };

  // Process loop
  const processLoop = async (newsletterId: string) => {
    let done = false;
    while (!done) {
      try {
        const res = await fetch("/api/admin/newsletter/send/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newsletterId }),
        });
        if (!res.ok) break;
        const data = await res.json();
        setSendProgress((prev) =>
          prev ? { ...prev, sent: data.sent, failed: data.failed, done: data.done } : prev
        );
        done = data.done;
        if (!done) {
          await new Promise((r) => setTimeout(r, 500));
        }
      } catch {
        break;
      }
    }
  };

  // Status poller
  const startStatusPoller = (newsletterId: string) => {
    if (statusPollerRef.current) clearInterval(statusPollerRef.current);
    statusPollerRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/newsletter/send/status?id=${newsletterId}`);
        if (!res.ok) return;
        const data = await res.json();
        setSendProgress((prev) =>
          prev ? { ...prev, sent: data.sent, failed: data.failed, done: data.done, total: data.total } : prev
        );
        if (data.done) {
          if (statusPollerRef.current) clearInterval(statusPollerRef.current);
          statusPollerRef.current = null;
        }
      } catch {
        // ignore
      }
    }, 2000);
  };

  // Send newsletter
  const handleSend = async () => {
    setSending(true);
    try {
      const payload = {
        subject,
        content: blocks,
        ...(draftId && { draftId }),
        listType: audience.listType,
        ...(audience.listId && { listId: audience.listId }),
      };
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "SEND_FAILED");
      }
      const data = await res.json();
      const { newsletterId, recipientCount } = data;
      setSendProgress({ newsletterId, sent: 0, total: recipientCount, failed: 0, done: false });
      startStatusPoller(newsletterId);
      await processLoop(newsletterId);
      showToast(`Newsletter verzonden naar ${recipientCount} ontvangers`, "success");
      setConfirmOpen(false);
      setSendProgress(null);
      if (statusPollerRef.current) {
        clearInterval(statusPollerRef.current);
        statusPollerRef.current = null;
      }
      setSubject("");
      setBlocks([]);
      setDraftId(null);
    } catch {
      showToast("Verzenden mislukt", "error");
      setSendProgress(null);
      if (statusPollerRef.current) {
        clearInterval(statusPollerRef.current);
        statusPollerRef.current = null;
      }
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (statusPollerRef.current) clearInterval(statusPollerRef.current);
    };
  }, []);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const progressPercent = sendProgress
    ? sendProgress.total > 0
      ? Math.round((sendProgress.sent / sendProgress.total) * 100)
      : 0
    : 0;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Newsletter
          </h1>
          <p className="text-muted text-sm mt-1">Stel uw nieuwsbrief samen en verstuur</p>
        </div>
        <button
          onClick={() => { loadDrafts(); setDraftsOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-[#333] text-muted hover:text-white hover:border-primary/50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          Concepten
        </button>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label htmlFor="subject" className="text-white text-sm font-medium">
          Onderwerp
        </label>
        <input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={200}
          placeholder="Onderwerp van de nieuwsbrief..."
          className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] text-white px-4 py-2.5 text-sm placeholder:text-muted/40 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Email Editor */}
      <EmailEditorShell key={draftId || "new"} initialBlocks={blocks} onChange={handleBlocksChange} />

      {/* Bottom bar: audience + actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-[#333] bg-[#1a1a1a] p-5">
            <NewsletterAudienceSelector value={audience} onChange={handleAudienceChange} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={saving || !subject.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg border border-[#333] text-muted hover:text-white hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            )}
            Concept opslaan
          </button>
          <button
            onClick={handleTestSend}
            disabled={!canSend || testSending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg border border-[#333] text-muted hover:text-white hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testSending ? (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            )}
            Testmail versturen
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={!canSend || sending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-lg btn-gradient font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            Verzenden
          </button>
        </div>
      </div>

      {/* Confirm Send / Progress Dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => { if (!sending) setConfirmOpen(false); }}>
          <div className="bg-[#222222] border border-[#333] rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-2">Newsletter verzenden</h2>
            {sendProgress ? (
              <div className="space-y-4 py-2">
                <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">
                    Verzenden... {sendProgress.sent}/{sendProgress.total}
                  </span>
                  <span className="text-white font-medium">{progressPercent}%</span>
                </div>
                {sendProgress.failed > 0 && (
                  <p className="text-yellow-400 text-sm">{sendProgress.failed} mislukt</p>
                )}
              </div>
            ) : (
              <>
                <p className="text-muted text-sm mb-6">
                  Weet u zeker dat u deze nieuwsbrief wilt verzenden naar {audienceCount} ontvangers?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmOpen(false)}
                    className="px-4 py-2 text-sm rounded-lg border border-[#333] text-muted hover:text-white transition-colors"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={sending}
                    className="px-4 py-2 text-sm rounded-lg btn-gradient font-semibold disabled:opacity-50"
                  >
                    {sending ? "Verzenden..." : "Bevestigen"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Drafts Dialog */}
      {draftsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDraftsOpen(false)}>
          <div className="bg-[#222222] border border-[#333] rounded-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Concepten</h2>
              <button onClick={() => setDraftsOpen(false)} className="text-muted hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {drafts.length === 0 ? (
                <p className="text-muted text-sm py-4 text-center">Geen concepten gevonden</p>
              ) : (
                drafts.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-2 p-3 rounded-lg border border-[#333] hover:border-primary/40 transition-colors bg-[#1a1a1a]"
                  >
                    <button
                      onClick={() => loadDraft(d.id)}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="text-white text-sm font-medium truncate">{d.subject}</div>
                      <div className="text-muted text-xs mt-1">
                        {d.listType} &middot; {new Date(d.updatedAt).toLocaleDateString("nl-NL")}
                      </div>
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const res = await fetch(`/api/admin/newsletter/draft?id=${d.id}`, { method: "DELETE" });
                          if (!res.ok) throw new Error();
                          setDrafts((prev) => prev.filter((x) => x.id !== d.id));
                          if (draftId === d.id) setDraftId(null);
                          showToast("Concept verwijderd", "success");
                        } catch {
                          showToast("Verwijderen mislukt", "error");
                        }
                      }}
                      className="shrink-0 p-1.5 text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                      title="Verwijderen"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
