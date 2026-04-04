"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type GlobalStats = {
  totalSent: number;
  totalSubscribers: number;
  avgOpenRate: number;
  avgClickRate: number;
  trend: { date: string; sent: number; opened: number; clicked: number }[];
};

type NewsletterSummary = {
  id: string;
  subject: string;
  sentAt: string;
  recipientCount: number;
  openRate: number;
  clickRate: number;
};

type NewsletterDetail = {
  newsletter: { id: string; subject: string; sentAt: string };
  metrics: {
    total: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  };
  clicksByUrl: { url: string; count: number }[];
};

function MetricCard({ iconPath, label, value, subtitle }: { iconPath: string; label: string; value: string | number; subtitle?: string }) {
  return (
    <div className="rounded-xl border border-card-border bg-[#1a1a1a] p-5">
      <div className="flex items-center gap-3 mb-2">
        <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
        <span className="text-muted text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subtitle && <div className="text-xs text-muted/60 mt-1">{subtitle}</div>}
    </div>
  );
}

function TrendChart({ trend }: { trend: GlobalStats["trend"] }) {
  const maxVal = useMemo(() => Math.max(1, ...trend.map((d) => d.sent)), [trend]);
  const barWidth = 100 / trend.length;

  return (
    <div className="rounded-xl border border-card-border bg-[#1a1a1a] p-5">
      <h3 className="text-white font-semibold mb-4">Trend (30 dagen)</h3>
      <div className="overflow-x-auto">
        <svg viewBox="0 0 600 180" className="w-full min-w-[400px]" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1="40" y1={150 - f * 130} x2="590" y2={150 - f * 130} stroke="#333" strokeWidth="0.5" />
          ))}
          {/* Y-axis labels */}
          {[0, 0.5, 1].map((f) => (
            <text key={f} x="35" y={154 - f * 130} textAnchor="end" fill="#888" fontSize="9">
              {Math.round(maxVal * f)}
            </text>
          ))}
          {/* Bars */}
          {trend.map((d, i) => {
            const x = 40 + (i / trend.length) * 550;
            const w = (550 / trend.length) * 0.7;
            const sentH = (d.sent / maxVal) * 130;
            const openedH = (d.opened / maxVal) * 130;
            const clickedH = (d.clicked / maxVal) * 130;

            return (
              <g key={d.date}>
                <title>{`${d.date}\nVerzonden: ${d.sent}\nGeopend: ${d.opened}\nGeklikt: ${d.clicked}`}</title>
                <rect x={x} y={150 - sentH} width={w} height={sentH} fill="#c9a55c" opacity="0.3" rx="1" />
                <rect x={x} y={150 - openedH} width={w} height={openedH} fill="#c9a55c" opacity="0.6" rx="1" />
                <rect x={x} y={150 - clickedH} width={w} height={clickedH} fill="#c9a55c" rx="1" />
              </g>
            );
          })}
          {/* X-axis: show every 5th date */}
          {trend.filter((_, i) => i % 5 === 0).map((d, i) => (
            <text key={d.date} x={40 + ((i * 5) / trend.length) * 550 + (550 / trend.length) * 0.35} y="168" textAnchor="middle" fill="#888" fontSize="8">
              {d.date.slice(5)}
            </text>
          ))}
        </svg>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: "#c9a55c", opacity: 0.3 }} /> Verzonden</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: "#c9a55c", opacity: 0.6 }} /> Geopend</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: "#c9a55c" }} /> Geklikt</span>
      </div>
    </div>
  );
}

function NewsletterDetailView({ newsletterId, onBack }: { newsletterId: string; onBack: () => void }) {
  const [data, setData] = useState<NewsletterDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/newsletter/stats/${newsletterId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [newsletterId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
      </div>
    );
  }

  if (!data) return <p className="text-muted text-center py-8">Geen data beschikbaar</p>;

  const { newsletter, metrics, clicksByUrl } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-[#333] text-muted hover:text-white transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Terug
        </button>
        <div>
          <h2 className="text-lg font-bold text-white">{newsletter.subject}</h2>
          <p className="text-muted text-xs">{new Date(newsletter.sentAt).toLocaleString("nl-NL", { hour12: false })}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard iconPath="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" label="Verzonden" value={metrics.total} />
        <MetricCard iconPath="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" label="Open %" value={`${metrics.openRate}%`} subtitle={`${metrics.opened} / ${metrics.total}`} />
        <MetricCard iconPath="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" label="Klik %" value={`${metrics.clickRate}%`} subtitle={`${metrics.clicked} / ${metrics.total}`} />
        <MetricCard iconPath="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" label="Bounce %" value={`${metrics.bounceRate}%`} subtitle={`${metrics.bounced} / ${metrics.total}`} />
      </div>

      {clicksByUrl.length > 0 && (
        <div className="rounded-xl border border-card-border bg-[#1a1a1a] p-5">
          <h3 className="text-white font-semibold mb-3">Klik-overzicht</h3>
          <div className="space-y-2">
            {clicksByUrl.map((c) => (
              <div key={c.url} className="flex items-center justify-between gap-2 text-sm py-1 border-b border-card-border/30 last:border-0">
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                  {c.url}
                </a>
                <span className="text-white font-medium whitespace-nowrap">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type Tab = "general" | "per-newsletter";

export default function NewsletterStats() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get("tab") as Tab) || "general";

  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNewsletter, setSelectedNewsletter] = useState<string | null>(null);
  const [newsletters, setNewsletters] = useState<NewsletterSummary[]>([]);

  const setTab = (tab: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`, { scroll: false });
    setSelectedNewsletter(null);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/newsletter/stats").then((r) => r.json()),
      fetch("/api/admin/newsletter/history?limit=50").then((r) => r.json()).catch(() => ({ items: [] })),
    ])
      .then(([statsData, historyData]) => {
        setStats(statsData);
        setNewsletters(historyData.items || []);
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
      </div>
    );
  }

  if (selectedNewsletter) {
    return <NewsletterDetailView newsletterId={selectedNewsletter} onBack={() => setSelectedNewsletter(null)} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        Statistieken
      </h1>

      {/* Tab bar */}
      <div className="flex border-b border-card-border">
        <button
          onClick={() => setTab("general")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "general"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-white"
          }`}
        >
          Algemeen
        </button>
        <button
          onClick={() => setTab("per-newsletter")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "per-newsletter"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-white"
          }`}
        >
          Per nieuwsbrief
        </button>
      </div>

      {/* General tab */}
      {activeTab === "general" && (
        <>
          {!stats ? (
            <p className="text-muted text-center py-8">Geen data beschikbaar</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard iconPath="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" label="Totaal verzonden" value={stats.totalSent} />
                <MetricCard iconPath="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" label="Abonnees" value={stats.totalSubscribers} />
                <MetricCard iconPath="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" label="Gem. open %" value={`${stats.avgOpenRate}%`} />
                <MetricCard iconPath="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" label="Gem. klik %" value={`${stats.avgClickRate}%`} />
              </div>

              {stats.trend && stats.trend.length > 0 && (
                <TrendChart trend={stats.trend} />
              )}
            </>
          )}
        </>
      )}

      {/* Per-newsletter tab */}
      {activeTab === "per-newsletter" && (
        <>
          {newsletters.length === 0 ? (
            <div className="text-center py-12">
              <svg className="h-12 w-12 text-muted/40 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <p className="text-muted">Nog geen nieuwsbrieven verzonden</p>
            </div>
          ) : (
            <div className="rounded-xl border border-card-border bg-[#1a1a1a] p-5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-muted text-left">
                      <th className="pb-2 pr-4">Onderwerp</th>
                      <th className="pb-2 pr-4">Datum</th>
                      <th className="pb-2 pr-4 text-right">Ontvangers</th>
                      <th className="pb-2 pr-4 text-right">Open %</th>
                      <th className="pb-2 pr-4 text-right">Klik %</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsletters.map((nl) => (
                      <tr key={nl.id} className="border-b border-card-border/30 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-2.5 pr-4 text-white">{nl.subject}</td>
                        <td className="py-2.5 pr-4 text-muted whitespace-nowrap">{nl.sentAt ? new Date(nl.sentAt).toLocaleDateString("nl-NL") : "\u2014"}</td>
                        <td className="py-2.5 pr-4 text-muted text-right">{nl.recipientCount}</td>
                        <td className="py-2.5 pr-4 text-right">
                          <span className={nl.openRate > 0 ? "text-green-400" : "text-muted"}>{nl.openRate}%</span>
                        </td>
                        <td className="py-2.5 pr-4 text-right">
                          <span className={nl.clickRate > 0 ? "text-green-400" : "text-muted"}>{nl.clickRate}%</span>
                        </td>
                        <td className="py-2.5">
                          <button onClick={() => setSelectedNewsletter(nl.id)} className="text-primary hover:text-primary/80 p-1" title="Details bekijken">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
