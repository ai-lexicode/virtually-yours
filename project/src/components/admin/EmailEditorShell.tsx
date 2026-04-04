"use client";

import { useState, useCallback, useMemo } from "react";

// ---- Block types (must match render-blocks-to-html.ts) ----

export type EmailBlockType =
  | "email-header"
  | "email-footer"
  | "email-heading"
  | "email-text"
  | "email-image"
  | "email-button"
  | "email-divider";

export type EmailBlock = {
  id: string;
  type: EmailBlockType;
  props: Record<string, string | number>;
  order: number;
};

const DEFAULT_PROPS: Record<EmailBlockType, Record<string, string | number>> = {
  "email-header": {
    logoUrl: "https://virtually-yours.nl/images/logo-email.png",
    title: "",
  },
  "email-footer": {
    text: "Virtually Yours \u2014 virtually-yours.nl",
    unsubscribeUrl: "{{unsubscribeUrl}}",
  },
  "email-heading": { text: "Titel", level: 1, color: "#ffffff", align: "left" },
  "email-text": { text: "Voer hier uw tekst in...", fontSize: 14, color: "#e0e0e0", align: "left" },
  "email-image": { src: "", alt: "", width: 600, align: "center", href: "" },
  "email-button": {
    text: "Klik hier",
    url: "https://",
    bgColor: "#c89c6f",
    textColor: "#1a1a1a",
    borderRadius: 8,
  },
  "email-divider": { color: "#333333", thickness: 1 },
};

/** Pinned block types that are auto-inserted and cannot be moved/deleted */
const PINNED_TYPES: EmailBlockType[] = ["email-header", "email-footer"];

function isPinned(type: EmailBlockType): boolean {
  return PINNED_TYPES.includes(type);
}

/** Ensure header (first) and footer (last) exist */
function ensureHeaderFooter(blocks: EmailBlock[]): EmailBlock[] {
  let result = [...blocks];
  const hasHeader = result.some((b) => b.type === "email-header");
  const hasFooter = result.some((b) => b.type === "email-footer");

  if (!hasHeader) {
    result.unshift({
      id: crypto.randomUUID(),
      type: "email-header",
      props: { ...DEFAULT_PROPS["email-header"] },
      order: 0,
    });
  }
  if (!hasFooter) {
    result.push({
      id: crypto.randomUUID(),
      type: "email-footer",
      props: { ...DEFAULT_PROPS["email-footer"] },
      order: result.length,
    });
  }

  // Reorder: header always 0, footer always last
  const header = result.find((b) => b.type === "email-header")!;
  const footer = result.find((b) => b.type === "email-footer")!;
  const middle = result.filter((b) => b.type !== "email-header" && b.type !== "email-footer");
  result = [header, ...middle, footer];
  result.forEach((b, i) => (b.order = i));
  return result;
}

// ---- Block preview renderer ----

function BlockPreview({ block }: { block: EmailBlock }) {
  const p = block.props;
  switch (block.type) {
    case "email-header": {
      return (
        <div className="text-center py-2">
          {p.logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={String(p.logoUrl)}
              alt={String(p.title || "Logo")}
              className="h-12 mx-auto mb-1"
            />
          ) : (
            <div className="text-xs text-muted">[Logo]</div>
          )}
          {p.title && (
            <div className="text-sm font-bold text-primary">{String(p.title)}</div>
          )}
        </div>
      );
    }
    case "email-footer":
      return (
        <div className="text-center py-2 border-t border-[#333]">
          <p className="text-xs text-muted">{String(p.text)}</p>
          <p className="text-[10px] text-muted/60 mt-1">Unsubscribe</p>
        </div>
      );
    case "email-heading": {
      const Tag = p.level === 2 ? "h2" : "h1";
      return (
        <Tag
          className={p.level === 2 ? "text-xl font-bold" : "text-2xl font-bold"}
          style={{ color: String(p.color || "#ffffff"), textAlign: (String(p.align) || "left") as "left" | "center" | "right" }}
        >
          {String(p.text) || "Titel"}
        </Tag>
      );
    }
    case "email-text":
      return (
        <p
          className="text-sm whitespace-pre-wrap"
          style={{
            color: String(p.color || "#e0e0e0"),
            fontSize: Number(p.fontSize || 14),
            textAlign: (String(p.align) || "left") as "left" | "center" | "right",
          }}
        >
          {String(p.text)}
        </p>
      );
    case "email-button": {
      const bgColor = String(p.bgColor || "#c89c6f");
      const textColor = String(p.textColor || "#1a1a1a");
      const borderRadius = Number(p.borderRadius || 8);
      return (
        <div className="text-center py-2">
          <span
            className="inline-block px-6 py-2.5 text-sm font-semibold"
            style={{ backgroundColor: bgColor, color: textColor, borderRadius }}
          >
            {String(p.text) || "Button"}
          </span>
        </div>
      );
    }
    case "email-image":
      return p.src ? (
        <div style={{ textAlign: (String(p.align) || "center") as "left" | "center" | "right" }} className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={String(p.src)}
            alt={String(p.alt || "")}
            className="max-w-full h-auto rounded-lg"
            style={{ maxHeight: 200, width: Number(p.width || 600), maxWidth: "100%" }}
          />
          {p.href && String(p.href).trim() !== "" && (
            <span className="absolute top-1 right-1 bg-[#2a2a2a]/80 text-primary text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.04a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364l1.757 1.757" />
              </svg>
              Link
            </span>
          )}
        </div>
      ) : (
        <div className="h-24 rounded-lg border-2 border-dashed border-[#333] flex items-center justify-center text-muted text-sm">
          Afbeelding URL invoeren of uploaden
        </div>
      );
    case "email-divider": {
      const divColor = String(p.color || "#333333");
      const thickness = Number(p.thickness || 1);
      return <hr style={{ borderTop: `${thickness}px solid ${divColor}`, borderBottom: "none" }} className="my-2" />;
    }
    default:
      return <div className="text-muted text-sm">Onbekend blok</div>;
  }
}

// ---- Block editor form ----

function BlockEditor({
  block,
  onUpdate,
}: {
  block: EmailBlock;
  onUpdate: (props: Record<string, string | number>) => void;
}) {
  const p = block.props;
  const [uploading, setUploading] = useState(false);

  const field = (
    label: string,
    key: string,
    type: "text" | "textarea" | "number" | "color" | "select" | "readonly" = "text",
    options?: string[],
  ) => (
    <div key={key} className="space-y-1">
      <label className="text-xs text-muted font-medium">{label}</label>
      {type === "readonly" ? (
        <input
          value={String(p[key] ?? "")}
          readOnly
          className="w-full rounded-lg border border-[#333] bg-[#111] text-muted text-sm px-3 py-2 cursor-not-allowed"
        />
      ) : type === "textarea" ? (
        <textarea
          value={String(p[key] ?? "")}
          onChange={(e) => onUpdate({ [key]: e.target.value })}
          rows={4}
          className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] text-white text-sm px-3 py-2 focus:border-primary focus:outline-none resize-y"
        />
      ) : type === "number" ? (
        <input
          type="number"
          value={Number(p[key] ?? 0)}
          onChange={(e) => onUpdate({ [key]: Number(e.target.value) })}
          className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] text-white text-sm px-3 py-2 focus:border-primary focus:outline-none"
        />
      ) : type === "color" ? (
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={String(p[key] ?? "#c89c6f")}
            onChange={(e) => onUpdate({ [key]: e.target.value })}
            className="h-8 w-8 rounded border border-[#333] bg-transparent cursor-pointer"
          />
          <input
            value={String(p[key] ?? "")}
            onChange={(e) => onUpdate({ [key]: e.target.value })}
            className="flex-1 rounded-lg border border-[#333] bg-[#1a1a1a] text-white text-sm px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>
      ) : type === "select" ? (
        <select
          value={String(p[key] ?? "")}
          onChange={(e) => onUpdate({ [key]: e.target.value })}
          className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] text-white text-sm px-3 py-2 focus:border-primary focus:outline-none"
        >
          {options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={String(p[key] ?? "")}
          onChange={(e) => onUpdate({ [key]: e.target.value })}
          className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] text-white text-sm px-3 py-2 focus:border-primary focus:outline-none"
        />
      )}
    </div>
  );

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/newsletter/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload mislukt");
      }
      const data = await res.json();
      onUpdate({ src: data.url });
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  switch (block.type) {
    case "email-header":
      return (
        <div className="space-y-3">
          {field("Logo URL", "logoUrl")}
          {field("Titel", "title")}
        </div>
      );
    case "email-footer":
      return (
        <div className="space-y-3">
          {field("Tekst", "text")}
          {field("Uitschrijf-URL", "unsubscribeUrl", "readonly")}
        </div>
      );
    case "email-heading":
      return (
        <div className="space-y-3">
          {field("Tekst", "text")}
          {field("Niveau", "level", "select", ["1", "2"])}
          {field("Kleur", "color", "color")}
          {field("Uitlijning", "align", "select", ["left", "center", "right"])}
        </div>
      );
    case "email-text":
      return (
        <div className="space-y-3">
          {field("Tekst", "text", "textarea")}
          {field("Lettergrootte", "fontSize", "number")}
          {field("Kleur", "color", "color")}
          {field("Uitlijning", "align", "select", ["left", "center", "right"])}
        </div>
      );
    case "email-button":
      return (
        <div className="space-y-3">
          {field("Tekst", "text")}
          {field("URL", "url")}
          {field("Achtergrondkleur", "bgColor", "color")}
          {field("Tekstkleur", "textColor", "color")}
          {field("Hoekradius", "borderRadius", "number")}
        </div>
      );
    case "email-image":
      return (
        <div className="space-y-3">
          {field("URL", "src")}
          <div className="space-y-1">
            <label className="text-xs text-muted font-medium">Of upload een afbeelding</label>
            <div className="relative">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                disabled={uploading}
                className="w-full text-sm text-muted file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#333] file:bg-[#2a2a2a] file:text-muted file:text-xs file:cursor-pointer hover:file:text-white disabled:opacity-50"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]/80 rounded-lg">
                  <svg
                    className="h-5 w-5 animate-spin text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
          {field("Alt tekst", "alt")}
          {field("Link URL", "href")}
          {field("Breedte (px)", "width", "number")}
          {field("Uitlijning", "align", "select", ["left", "center", "right"])}
        </div>
      );
    case "email-divider":
      return (
        <div className="space-y-3">
          {field("Kleur", "color", "color")}
          {field("Dikte (px)", "thickness", "number")}
        </div>
      );
    default:
      return null;
  }
}

// ---- Preview HTML renderer (inline, matches render-blocks-to-html.ts) ----

function renderBlocksToHtml(blocks: EmailBlock[]): string {
  const renderBlock = (b: EmailBlock): string => {
    const p = b.props;
    switch (b.type) {
      case "email-header": {
        const logo = p.logoUrl
          ? `<img src="${escapeHtml(String(p.logoUrl))}" alt="${escapeHtml(String(p.title || "Virtually Yours"))}" style="height:64px;margin-bottom:8px;" />`
          : "";
        const title = p.title
          ? `<div style="color:#c89c6f;font-size:20px;font-weight:700;">${escapeHtml(String(p.title))}</div>`
          : "";
        return `<div style="text-align:center;padding-bottom:24px;">${logo}${title}</div>`;
      }
      case "email-footer":
        return `<div style="padding:24px 0;text-align:center;border-top:1px solid rgba(200,156,111,0.2);"><p style="color:#666;font-size:12px;margin:0 0 4px;">${escapeHtml(String(p.text || "Virtually Yours"))}</p><p style="color:#555;font-size:11px;margin:0 0 8px;">Virtually Yours \u2014 Nederland</p><a href="#" style="color:#c89c6f;font-size:11px;text-decoration:underline;">Unsubscribe</a></div>`;
      case "email-heading": {
        const tag = p.level === 2 ? "h2" : "h1";
        const size = p.level === 2 ? "20px" : "26px";
        return `<${tag} style="color:${escapeHtml(String(p.color || "#ffffff"))};font-size:${size};font-weight:700;text-align:${escapeHtml(String(p.align || "left"))};margin:0 0 16px;font-family:Georgia,serif;">${escapeHtml(String(p.text))}</${tag}>`;
      }
      case "email-text":
        return `<p style="color:${escapeHtml(String(p.color || "#e0e0e0"))};font-size:${Number(p.fontSize || 14)}px;text-align:${escapeHtml(String(p.align || "left"))};line-height:1.6;margin:0 0 16px;white-space:pre-line;">${escapeHtml(String(p.text)).replace(/\n/g, "<br/>")}</p>`;
      case "email-button":
        return `<div style="text-align:center;margin:24px 0;"><a href="${escapeHtml(String(p.url))}" style="display:inline-block;padding:12px 28px;background-color:${escapeHtml(String(p.bgColor || "#c89c6f"))};color:${escapeHtml(String(p.textColor || "#1a1a1a"))};text-decoration:none;border-radius:${Number(p.borderRadius || 8)}px;font-weight:600;font-size:16px;">${escapeHtml(String(p.text))}</a></div>`;
      case "email-image": {
        if (!p.src) return "";
        const imgTag = `<img src="${escapeHtml(String(p.src))}" alt="${escapeHtml(String(p.alt || ""))}" style="width:${Number(p.width || 600)}px;max-width:100%;border-radius:8px;" />`;
        const inner = p.href && String(p.href).trim() !== ""
          ? `<a href="${escapeHtml(String(p.href))}" style="text-decoration:none;">${imgTag}</a>`
          : imgTag;
        return `<div style="text-align:${escapeHtml(String(p.align || "center"))};margin:16px 0;">${inner}</div>`;
      }
      case "email-divider":
        return `<hr style="border:none;border-top:${Number(p.thickness || 1)}px solid ${escapeHtml(String(p.color || "#333333"))};margin:16px 0;" />`;
      default:
        return "";
    }
  };

  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const headerBlock = sorted.find((b) => b.type === "email-header");
  const footerBlock = sorted.find((b) => b.type === "email-footer");
  const bodyBlocks = sorted.filter((b) => b.type !== "email-header" && b.type !== "email-footer");

  const headerHtml = headerBlock ? renderBlock(headerBlock) : "";
  const footerHtml = footerBlock ? renderBlock(footerBlock) : "";
  const bodyHtml = bodyBlocks.map(renderBlock).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body style="margin:0;padding:32px 16px;background-color:#1a1a1a;font-family:Arial,sans-serif;"><div style="max-width:600px;margin:0 auto;">${headerHtml}<div style="background-color:#222222;border-radius:12px;padding:32px;border:1px solid rgba(200,156,111,0.2);">${bodyHtml}</div>${footerHtml}</div></body></html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---- Widget palette (user-addable blocks only, no header/footer) ----

const WIDGET_OPTIONS: { type: EmailBlockType; label: string; iconPath: string }[] = [
  {
    type: "email-heading",
    label: "Titel",
    iconPath: "M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5",
  },
  {
    type: "email-text",
    label: "Tekst",
    iconPath:
      "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
  },
  {
    type: "email-button",
    label: "Button",
    iconPath:
      "M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59",
  },
  {
    type: "email-image",
    label: "Afbeelding",
    iconPath:
      "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21zm2.25-9.75a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z",
  },
  {
    type: "email-divider",
    label: "Lijn",
    iconPath: "M5 12h14",
  },
];

// ---- Main component ----

interface EmailEditorShellProps {
  initialBlocks: EmailBlock[];
  onChange: (blocks: EmailBlock[]) => void;
}

export default function EmailEditorShell({ initialBlocks, onChange }: EmailEditorShellProps) {
  const [blocks, setBlocks] = useState<EmailBlock[]>(() => ensureHeaderFooter(initialBlocks));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedId) ?? null,
    [blocks, selectedId],
  );

  const updateBlocks = useCallback(
    (newBlocks: EmailBlock[]) => {
      setBlocks(newBlocks);
      onChange(newBlocks);
    },
    [onChange],
  );

  const addBlock = useCallback(
    (type: EmailBlockType) => {
      const footerIdx = blocks.findIndex((b) => b.type === "email-footer");
      const insertAt = footerIdx >= 0 ? footerIdx : blocks.length;
      const newBlock: EmailBlock = {
        id: crypto.randomUUID(),
        type,
        props: { ...DEFAULT_PROPS[type] },
        order: insertAt,
      };
      const newBlocks = [...blocks];
      newBlocks.splice(insertAt, 0, newBlock);
      newBlocks.forEach((b, i) => (b.order = i));
      updateBlocks(newBlocks);
      setSelectedId(newBlock.id);
    },
    [blocks, updateBlocks],
  );

  const removeBlock = useCallback(
    (id: string) => {
      const block = blocks.find((b) => b.id === id);
      if (block && isPinned(block.type)) return; // Cannot delete pinned blocks
      const newBlocks = blocks.filter((b) => b.id !== id);
      newBlocks.forEach((b, i) => (b.order = i));
      updateBlocks(newBlocks);
      if (selectedId === id) setSelectedId(null);
    },
    [blocks, selectedId, updateBlocks],
  );

  const moveBlock = useCallback(
    (id: string, direction: "up" | "down") => {
      const block = blocks.find((b) => b.id === id);
      if (block && isPinned(block.type)) return; // Cannot move pinned blocks
      const idx = blocks.findIndex((b) => b.id === id);
      if (idx === -1) return;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= blocks.length) return;
      // Don't swap with pinned blocks
      if (isPinned(blocks[target].type)) return;
      const newBlocks = [...blocks];
      [newBlocks[idx], newBlocks[target]] = [newBlocks[target], newBlocks[idx]];
      newBlocks.forEach((b, i) => (b.order = i));
      updateBlocks(newBlocks);
    },
    [blocks, updateBlocks],
  );

  const updateBlockProps = useCallback(
    (id: string, props: Record<string, string | number>) => {
      const newBlocks = blocks.map((b) =>
        b.id === id ? { ...b, props: { ...b.props, ...props } } : b,
      );
      setBlocks(newBlocks);
      onChange(newBlocks);
    },
    [blocks, onChange],
  );

  const previewHtml = useMemo(() => renderBlocksToHtml(blocks), [blocks]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">E-mail inhoud</span>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
            previewMode
              ? "border-primary bg-primary/10 text-primary"
              : "border-[#333] text-muted hover:text-white hover:border-primary/50"
          }`}
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
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Preview
        </button>
      </div>

      {previewMode ? (
        <div
          className="rounded-xl border border-[#333] overflow-hidden"
          style={{ maxWidth: 600, margin: "0 auto" }}
        >
          <iframe
            srcDoc={previewHtml}
            style={{
              width: 600,
              maxWidth: "100%",
              height: 500,
              border: "none",
              background: "#1a1a1a",
            }}
            title="E-mail preview"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          {/* Canvas */}
          <div>
            <div className="rounded-xl border border-[#333] bg-[#222222] p-4 min-h-[200px]">
              {blocks.length === 0 ? (
                <div className="text-center py-12 text-muted text-sm">
                  Voeg blokken toe met de knoppen hieronder
                </div>
              ) : (
                <div className="space-y-2">
                  {blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block, idx) => {
                      const pinned = isPinned(block.type);
                      return (
                        <div
                          key={block.id}
                          onClick={() => setSelectedId(block.id)}
                          className={`group relative rounded-lg border p-3 cursor-pointer transition-colors ${
                            selectedId === block.id
                              ? "border-primary ring-1 ring-primary/40"
                              : "border-transparent hover:border-[#444]"
                          }`}
                        >
                          <BlockPreview block={block} />
                          {/* Block controls (hidden for pinned blocks) */}
                          {!pinned && (
                            <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveBlock(block.id, "up");
                                }}
                                disabled={idx <= 1} /* index 0 is header */
                                className="p-1 rounded bg-[#2a2a2a] text-muted hover:text-white disabled:opacity-30"
                                title="Omhoog"
                              >
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 15.75l7.5-7.5 7.5 7.5"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveBlock(block.id, "down");
                                }}
                                disabled={idx >= blocks.length - 2} /* last -1 is footer */
                                className="p-1 rounded bg-[#2a2a2a] text-muted hover:text-white disabled:opacity-30"
                                title="Omlaag"
                              >
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeBlock(block.id);
                                }}
                                className="p-1 rounded bg-[#2a2a2a] text-red-400 hover:text-red-300"
                                title="Verwijderen"
                              >
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Add block toolbar */}
            <div className="flex flex-wrap gap-2 mt-3">
              {WIDGET_OPTIONS.map((w) => (
                <button
                  key={w.type}
                  onClick={() => addBlock(w.type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#2a2a2a] text-muted border border-[#333] hover:border-primary/50 hover:text-white transition-colors"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={w.iconPath} />
                  </svg>
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inspector */}
          <div className="rounded-xl border border-[#333] bg-[#2a2a2a] p-4 h-fit lg:sticky lg:top-4">
            <h2 className="text-sm font-semibold text-primary mb-3">Eigenschappen</h2>
            {selectedBlock ? (
              <BlockEditor
                block={selectedBlock}
                onUpdate={(props) => updateBlockProps(selectedBlock.id, props)}
              />
            ) : (
              <p className="text-xs text-muted">
                Selecteer een blok om de eigenschappen te bewerken
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
