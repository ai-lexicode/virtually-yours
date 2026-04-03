"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type MappedRow = {
  email: string;
  firstName?: string;
  lastName?: string;
};

type FieldMapping = Record<number, string>;

type ImportResult = {
  imported: number;
  duplicates: number;
  errors: Array<{ row: number; reason: string }>;
};

type ListOption = { id: string; name: string };

const DEST_FIELDS = ["email", "firstName", "lastName", "skip"] as const;
const CHUNK_SIZE = 100;
const CHUNK_TIMEOUT_MS = 30_000;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function sendChunkWithRetry(
  chunk: MappedRow[],
  listId: string | undefined,
  retries = 1
): Promise<ImportResult> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CHUNK_TIMEOUT_MS);
    try {
      const res = await fetch("/api/admin/newsletter/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mappedData: chunk, listId: listId || undefined }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (attempt < retries) continue;
      return {
        imported: 0,
        duplicates: 0,
        errors: chunk.map((_, i) => ({ row: i + 1, reason: err instanceof Error ? err.message : String(err) })),
      };
    }
  }
  return { imported: 0, duplicates: 0, errors: [] };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === "," || char === ";") && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export default function NewsletterImport() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"upload" | "map" | "preview" | "importing" | "result">("upload");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<FieldMapping>({});
  const [mappedData, setMappedData] = useState<MappedRow[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [lists, setLists] = useState<ListOption[]>([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [progress, setProgress] = useState<{ processed: number; total: number; imported: number; duplicates: number; errors: number } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLists = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/newsletter/lists");
      if (!res.ok) return;
      const data = await res.json();
      setLists(data.map((l: ListOption) => ({ id: l.id, name: l.name })));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => { fetchLists(); }, [fetchLists]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast("Bestand te groot (max 5MB)", "error"); return; }
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") { showToast("Alleen CSV-bestanden", "error"); return; }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter((line) => line.trim());
      if (lines.length < 2) { showToast("Geen data gevonden", "error"); return; }

      const parsedHeaders = parseCSVLine(lines[0]);
      const parsedRows = lines.slice(1).map(parseCSVLine);
      setHeaders(parsedHeaders);
      setRows(parsedRows);

      // Auto-detect mapping
      const autoMapping: FieldMapping = {};
      parsedHeaders.forEach((header, idx) => {
        const lower = header.toLowerCase().trim();
        if (lower.includes("email") || lower === "e-mail") autoMapping[idx] = "email";
        else if (lower.includes("firstname") || lower === "first_name" || lower === "voornaam") autoMapping[idx] = "firstName";
        else if (lower.includes("lastname") || lower === "last_name" || lower === "achternaam") autoMapping[idx] = "lastName";
        else autoMapping[idx] = "skip";
      });
      setMapping(autoMapping);
      setStep("map");
    };
    reader.readAsText(file);
  };

  const hasEmailMapping = Object.values(mapping).includes("email");

  const handlePreview = () => {
    const emailIdx = Object.entries(mapping).find(([, v]) => v === "email")?.[0];
    if (emailIdx === undefined) return;
    const data: MappedRow[] = rows
      .map((row) => {
        const mapped: MappedRow = { email: "" };
        Object.entries(mapping).forEach(([idx, field]) => {
          if (field !== "skip" && row[parseInt(idx)]) {
            (mapped as Record<string, string>)[field] = row[parseInt(idx)];
          }
        });
        return mapped;
      })
      .filter((row) => row.email && row.email.includes("@"));
    setMappedData(data);
    setStep("preview");
  };

  const handleImport = async () => {
    setStep("importing");
    const chunks = chunkArray(mappedData, CHUNK_SIZE);
    const totalEmails = mappedData.length;
    const accumulated: ImportResult = { imported: 0, duplicates: 0, errors: [] };
    setProgress({ processed: 0, total: totalEmails, imported: 0, duplicates: 0, errors: 0 });

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const baseRow = i * CHUNK_SIZE;
      const chunkResult = await sendChunkWithRetry(chunk, selectedListId || undefined);
      accumulated.imported += chunkResult.imported;
      accumulated.duplicates += chunkResult.duplicates;
      accumulated.errors.push(...chunkResult.errors.map((e) => ({ row: baseRow + e.row, reason: e.reason })));
      setProgress({
        processed: Math.min(baseRow + chunk.length, totalEmails),
        total: totalEmails,
        imported: accumulated.imported,
        duplicates: accumulated.duplicates,
        errors: accumulated.errors.length,
      });
    }
    setResult(accumulated);
    setStep("result");
    showToast("Import voltooid", "success");
  };

  const reset = () => {
    setStep("upload");
    setHeaders([]);
    setRows([]);
    setMapping({});
    setMappedData([]);
    setResult(null);
    setSelectedListId("");
    setProgress(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const selectClass = "rounded-lg border border-[#333] bg-[#1a1a1a] text-white px-2 py-1.5 text-sm focus:border-primary focus:outline-none";

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${
          toast.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {toast.message}
        </div>
      )}

      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        Import
      </h1>

      {/* Step 1: Upload */}
      {step === "upload" && (
        <div className="rounded-xl border-2 border-dashed border-[#333] p-12 text-center">
          <svg className="h-12 w-12 text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-white mb-2">Upload een CSV-bestand</p>
          <p className="text-muted text-sm mb-6">Kolommen: email, voornaam, achternaam (max 5MB)</p>
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="px-6 py-2.5 text-sm rounded-lg btn-gradient font-semibold">
            Bestand selecteren
          </button>
        </div>
      )}

      {/* Step 2: Map columns */}
      {step === "map" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Kolommen toewijzen</h2>
          <p className="text-muted text-sm">{rows.length} rijen gevonden. Wijs de kolommen toe.</p>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Toevoegen aan lijst (optioneel)</label>
            <select value={selectedListId} onChange={(e) => setSelectedListId(e.target.value)} className={selectClass + " w-full"}>
              <option value="">Geen lijst</option>
              {lists.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="w-full">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3">CSV kolom</th>
                  <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3">Veld</th>
                  <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3">Voorbeeld</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {headers.map((header, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-white font-mono text-sm">{header}</td>
                    <td className="px-4 py-3">
                      <select value={mapping[idx] || "skip"} onChange={(e) => setMapping((prev) => ({ ...prev, [idx]: e.target.value }))} className={selectClass}>
                        {DEST_FIELDS.map((field) => (
                          <option key={field} value={field}>{field === "skip" ? "Overslaan" : field}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted text-sm">{rows[0]?.[idx] || "\u2014"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button onClick={reset} className="px-4 py-2 text-sm rounded-lg border border-[#333] text-muted hover:text-white transition-colors">
              Terug
            </button>
            <button onClick={handlePreview} disabled={!hasEmailMapping} className="px-4 py-2 text-sm rounded-lg btn-gradient font-semibold disabled:opacity-50">
              Voorbeeld
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === "preview" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Voorbeeld</h2>
          <p className="text-muted text-sm">{mappedData.length} geldige rijen gevonden</p>

          <div className="overflow-x-auto rounded-xl border border-card-border">
            <table className="w-full">
              <thead className="bg-[#1a1a1a]">
                <tr>
                  <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3">E-mail</th>
                  <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3">Voornaam</th>
                  <th className="text-left text-xs font-medium text-muted uppercase px-4 py-3">Achternaam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {mappedData.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 text-white text-sm">{row.email}</td>
                    <td className="px-4 py-2 text-muted text-sm">{row.firstName || "\u2014"}</td>
                    <td className="px-4 py-2 text-muted text-sm">{row.lastName || "\u2014"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {mappedData.length > 10 && (
            <p className="text-muted text-sm text-center">en {mappedData.length - 10} meer...</p>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep("map")} className="px-4 py-2 text-sm rounded-lg border border-[#333] text-muted hover:text-white transition-colors">
              Terug
            </button>
            <button onClick={handleImport} className="px-4 py-2 text-sm rounded-lg btn-gradient font-semibold">
              Importeren
            </button>
          </div>
        </div>
      )}

      {/* Step 3.5: Importing */}
      {step === "importing" && progress && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Importeren...
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted">
              <span>{progress.processed} / {progress.total} e-mails</span>
            </div>
            <div className="w-full bg-[#1a1a1a] rounded-full h-3 border border-[#333]">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${progress.total > 0 ? (progress.processed / progress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-[#333] p-3 text-center">
              <div className="text-lg font-bold text-green-400">{progress.imported}</div>
              <div className="text-xs text-muted">Geimporteerd</div>
            </div>
            <div className="rounded-lg border border-[#333] p-3 text-center">
              <div className="text-lg font-bold text-yellow-400">{progress.duplicates}</div>
              <div className="text-xs text-muted">Duplicaten</div>
            </div>
            <div className="rounded-lg border border-[#333] p-3 text-center">
              <div className="text-lg font-bold text-red-400">{progress.errors}</div>
              <div className="text-xs text-muted">Fouten</div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === "result" && result && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Resultaten</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center">
              <svg className="h-8 w-8 text-green-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-2xl font-bold text-green-400">{result.imported}</div>
              <div className="text-sm text-green-300">Geimporteerd</div>
            </div>
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
              <svg className="h-8 w-8 text-yellow-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <div className="text-2xl font-bold text-yellow-400">{result.duplicates}</div>
              <div className="text-sm text-yellow-300">Duplicaten</div>
            </div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
              <svg className="h-8 w-8 text-red-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <div className="text-2xl font-bold text-red-400">{result.errors.length}</div>
              <div className="text-sm text-red-300">Fouten</div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
              <h3 className="text-red-400 font-medium mb-2">Foutdetails</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((err, idx) => (
                  <p key={idx} className="text-red-300 text-sm">Rij {err.row}: {err.reason}</p>
                ))}
              </div>
            </div>
          )}

          <button onClick={reset} className="px-6 py-2.5 text-sm rounded-lg btn-gradient font-semibold">
            Opnieuw importeren
          </button>
        </div>
      )}
    </div>
  );
}
