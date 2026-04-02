"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

type Question = {
  id: string;
  sort_order: number;
  question_key: string;
  question_text: string;
  question_type: string;
  placeholder: string | null;
  options: string[] | null;
  is_required: boolean;
  help_text: string | null;
};

type QuestionnaireInfo = {
  id: string;
  status: string;
  progress: number;
  documentTitle: string;
  documentSlug: string;
  orderNumber: string;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function QuestionnairePage() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<QuestionnaireInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // Track which answers have been modified since last save
  const pendingRef = useRef<Set<string>>(new Set());
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load questionnaire data
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/questionnaire/${id}/answers`);
      if (!res.ok) return;
      const data = await res.json();
      setInfo(data.questionnaire);
      setQuestions(data.questions);
      setAnswers(data.answers);

      // Resume from first unanswered question
      const firstEmpty = data.questions.findIndex(
        (q: Question) => !data.answers[q.id]
      );
      setCurrentStep(firstEmpty >= 0 ? firstEmpty : 0);
      setLoading(false);
    }
    load();
  }, [id]);

  // Autosave function
  const saveAnswers = useCallback(async () => {
    if (pendingRef.current.size === 0) return;

    const toSave = Array.from(pendingRef.current).map((questionId) => ({
      question_id: questionId,
      answer: answers[questionId] ?? "",
    }));
    pendingRef.current.clear();

    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/questionnaire/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: toSave }),
      });
      if (res.ok) {
        const data = await res.json();
        setInfo((prev) =>
          prev ? { ...prev, progress: data.progress, status: data.status } : prev
        );
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  }, [answers, id]);

  // Debounced autosave: 1.5s after last change
  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveAnswers();
    }, 1500);
  }, [saveAnswers]);

  // Save on unmount / page leave
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingRef.current.size > 0) {
        const toSave = Array.from(pendingRef.current).map((questionId) => ({
          question_id: questionId,
          answer: answers[questionId] ?? "",
        }));
        navigator.sendBeacon(
          `/api/questionnaire/${id}/answers`,
          new Blob(
            [JSON.stringify({ answers: toSave })],
            { type: "application/json" }
          )
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [answers, id]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    pendingRef.current.add(questionId);
    scheduleSave();
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSaveAndExit = async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    await saveAnswers();
    window.location.href = "/vragenlijsten";
  };

  const [generating, setGenerating] = useState(false);

  const handleComplete = async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    // Save any pending + mark final
    const allAnswers = questions.map((q) => ({
      question_id: q.id,
      answer: answers[q.id] ?? "",
    }));
    setSaveStatus("saving");
    const res = await fetch(`/api/questionnaire/${id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: allAnswers }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status === "completed") {
        setGenerating(true);
        // Give backend a moment to start generation, then redirect
        setTimeout(() => {
          window.location.href = "/vragenlijsten";
        }, 2000);
      } else {
        setSaveStatus("saved");
        window.location.href = "/vragenlijsten";
      }
    } else {
      setSaveStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-muted">
        Laden...
      </div>
    );
  }

  if (!info || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <p className="text-muted">Vragenlijst niet gevonden of geen vragen beschikbaar.</p>
        <Link href="/vragenlijsten" className="text-primary hover:underline mt-4 inline-block">
          Terug naar overzicht
        </Link>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <div className="h-12 w-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <h2 className="text-xl font-bold">Uw document wordt gegenereerd</h2>
        <p className="text-muted">
          Dit kan enkele seconden duren. U wordt automatisch doorgestuurd...
        </p>
      </div>
    );
  }

  const question = questions[currentStep];
  const totalSteps = questions.length;
  const isAnswered = (q: Question) => {
    const val = answers[q.id]?.trim();
    if (!val) return false;
    if (q.question_type === "checkbox") {
      try { return JSON.parse(val).length > 0; }
      catch { return false; }
    }
    return true;
  };
  const answeredCount = questions.filter(isAnswered).length;
  const progress = Math.round((answeredCount / totalSteps) * 100);
  const allRequiredAnswered = questions
    .filter((q) => q.is_required)
    .every(isAnswered);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/vragenlijsten"
          className="h-10 w-10 rounded-lg bg-card border border-card-border flex items-center justify-center text-muted hover:text-foreground transition-colors"
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
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{info.documentTitle}</h1>
          <p className="text-sm text-muted">Bestelling: {info.orderNumber}</p>
        </div>

        {/* Save status indicator */}
        <div className="text-xs text-muted flex items-center gap-1.5">
          {saveStatus === "saving" && (
            <>
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Opslaan...
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <span className="h-2 w-2 rounded-full bg-success" />
              Opgeslagen
            </>
          )}
          {saveStatus === "error" && (
            <>
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Fout bij opslaan
            </>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-card border border-card-border rounded-xl p-4">
        <div className="flex items-center justify-between text-sm text-muted mb-2">
          <span>
            Vraag {currentStep + 1} van {totalSteps}
          </span>
          <span>{progress}% voltooid</span>
        </div>
        <div className="h-2 bg-card-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Step dots */}
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentStep(i)}
              className={`h-2 min-w-[8px] rounded-full transition-all ${
                i === currentStep
                  ? "bg-primary w-6"
                  : answers[q.id]?.trim()
                    ? isAnswered(q) ? "bg-success/60 w-2" : "bg-card-border w-2"
                    : "bg-card-border w-2"
              }`}
              title={`Vraag ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="bg-card border border-card-border rounded-xl p-4 sm:p-8">
        <h2 className="text-lg font-semibold mb-2">{question.question_text}</h2>
        {question.help_text && (
          <p className="text-sm text-muted mb-4">{question.help_text}</p>
        )}
        {!question.help_text && <div className="mb-4" />}

        {(question.question_type === "text" ||
          question.question_type === "email" ||
          question.question_type === "number") && (
          <input
            type={question.question_type}
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleNext(); } }}
            placeholder={question.placeholder || ""}
            className="w-full bg-background border border-card-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        )}

        {question.question_type === "date" && (
          <input
            type="date"
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleNext(); } }}
            className="w-full bg-background border border-card-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        )}

        {question.question_type === "textarea" && (
          <textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder={question.placeholder || ""}
            rows={4}
            className="w-full bg-background border border-card-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-y"
          />
        )}

        {question.question_type === "select" && question.options && (
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(question.id, option)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  answers[question.id] === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-card-border hover:border-primary/50 text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {question.question_type === "radio" && question.options && (
          <div className="flex flex-wrap gap-3">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(question.id, option)}
                className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg border transition-colors text-center ${
                  answers[question.id] === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-card-border hover:border-primary/50 text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {question.question_type === "checkbox" && question.options && (() => {
          const selected: string[] = (() => {
            try { return JSON.parse(answers[question.id] || "[]"); }
            catch { return []; }
          })();
          const toggle = (option: string) => {
            const next = selected.includes(option)
              ? selected.filter((s) => s !== option)
              : [...selected, option];
            handleAnswer(question.id, next.length > 0 ? JSON.stringify(next) : "");
          };
          return (
            <div className="space-y-2">
              {question.options.map((option) => (
                <button
                  key={option}
                  onClick={() => toggle(option)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center gap-3 ${
                    selected.includes(option)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-card-border hover:border-primary/50 text-foreground"
                  }`}
                >
                  <span className={`flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selected.includes(option)
                      ? "border-primary bg-primary"
                      : "border-card-border"
                  }`}>
                    {selected.includes(option) && (
                      <svg className="h-3 w-3 text-background" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          );
        })()}

        {!question.is_required && (
          <p className="text-xs text-muted mt-3">Optioneel</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors py-2"
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
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Vorige
        </button>

        <button
          onClick={handleSaveAndExit}
          className="text-sm text-muted hover:text-foreground transition-colors py-2 hidden sm:flex items-center gap-1.5"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
          Opslaan en later verdergaan
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            Volgende
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
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={!allRequiredAnswered}
            className="flex items-center gap-2 bg-success hover:bg-success/90 text-white font-medium text-sm px-5 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Voltooien
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
          </button>
        )}
      </div>

      {/* Mobile save button */}
      <div className="sm:hidden">
        <button
          onClick={handleSaveAndExit}
          className="w-full text-sm text-muted hover:text-foreground border border-card-border rounded-lg py-2.5 transition-colors flex items-center justify-center gap-1.5"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
          Opslaan en later verdergaan
        </button>
      </div>
    </div>
  );
}
