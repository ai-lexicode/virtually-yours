"use client";

import { useState, useEffect, useCallback } from "react";

type ListOption = { id: string; name: string; memberCount: number };

export type AudienceSelection = {
  listType: "GENERAL" | "LIST";
  listId?: string;
};

export default function NewsletterAudienceSelector({
  value,
  onChange,
}: {
  value: AudienceSelection;
  onChange: (val: AudienceSelection) => void;
}) {
  const [count, setCount] = useState<number | null>(null);
  const [lists, setLists] = useState<ListOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAudience = useCallback(async (selection: AudienceSelection) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ listType: selection.listType });
      if (selection.listId) params.set("listId", selection.listId);
      const res = await fetch(`/api/admin/newsletter/audience?${params.toString()}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setCount(data.count);
      if (data.lists) setLists(data.lists);
    } catch {
      setCount(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAudience(value);
  }, [value, fetchAudience]);

  const radioClass = (active: boolean) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
      active
        ? "border-primary bg-primary/10 text-white"
        : "border-[#333] bg-[#1a1a1a] text-muted hover:border-primary/50"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-white font-medium text-sm">Doelgroep</span>
        {count !== null && (
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
            {loading ? "..." : `${count} ontvangers`}
          </span>
        )}
        {count === 0 && !loading && (
          <span className="text-red-400 text-xs">Geen ontvangers gevonden</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label className={radioClass(value.listType === "GENERAL")}>
          <input
            type="radio"
            name="listType"
            checked={value.listType === "GENERAL"}
            onChange={() => onChange({ listType: "GENERAL" })}
            className="accent-[#c89c6f]"
          />
          <span className="text-sm">Alle abonnees</span>
        </label>

        <label className={radioClass(value.listType === "LIST")}>
          <input
            type="radio"
            name="listType"
            checked={value.listType === "LIST"}
            onChange={() => onChange({ listType: "LIST" })}
            className="accent-[#c89c6f]"
          />
          <span className="text-sm">Specifieke lijst</span>
        </label>
      </div>

      {value.listType === "LIST" && (
        <select
          value={value.listId || ""}
          onChange={(e) =>
            onChange({ ...value, listId: e.target.value || undefined })
          }
          className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] text-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">Selecteer een lijst...</option>
          {lists.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} ({l.memberCount})
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
