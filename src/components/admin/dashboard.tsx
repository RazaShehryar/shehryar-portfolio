"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { SOURCE_LABELS, dayKey, type SourceKey } from "@/lib/analytics";
import { featured, moreWork } from "@/lib/projects";

type DayRow = {
  day: string;
  views: number;
  uniques: number;
  sources: Partial<Record<SourceKey, number>>;
};

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date | null;
};

const RANGES = [7, 30, 90] as const;

/** Names keyed by slug so project stats can be shown as titles, not slugs. */
const PROJECT_NAMES: Record<string, string> = {
  ...Object.fromEntries(featured.map((p) => [p.slug, p.name])),
  ...Object.fromEntries(moreWork.map((p) => [p.slug, p.name])),
};

function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(dayKey(new Date(Date.now() - i * 86_400_000)));
  }
  return out;
}

export function Dashboard() {
  const [range, setRange] = useState<(typeof RANGES)[number]>(30);
  const [rows, setRows] = useState<DayRow[]>([]);
  const [projects, setProjects] = useState<Record<string, number>>({});
  const [depth, setDepth] = useState<Record<string, number>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const db = getDb();
    if (!db) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const days = new Set(lastNDays(range));

        // Whole-collection reads are fine here: one document per day means a
        // 90-day window is at most 90 documents.
        const [statsSnap, projSnap, depthSnap, msgSnap] = await Promise.all([
          getDocs(collection(db, "stats")),
          getDocs(collection(db, "projectStats")),
          getDocs(collection(db, "depthStats")),
          getDocs(query(collection(db, "contacts"), orderBy("createdAt", "desc"), limit(50))),
        ]);

        const dayRows: DayRow[] = [];
        statsSnap.forEach((d) => {
          if (!days.has(d.id)) return;
          const v = d.data();
          dayRows.push({
            day: d.id,
            views: v.views ?? 0,
            uniques: v.uniques ?? 0,
            sources: v.sources ?? {},
          });
        });
        dayRows.sort((a, b) => a.day.localeCompare(b.day));

        const proj: Record<string, number> = {};
        projSnap.forEach((d) => {
          if (!days.has(d.id)) return;
          for (const [slug, n] of Object.entries(d.data().projects ?? {})) {
            proj[slug] = (proj[slug] ?? 0) + (n as number);
          }
        });

        const dep: Record<string, number> = {};
        depthSnap.forEach((d) => {
          if (!days.has(d.id)) return;
          for (const [k, n] of Object.entries(d.data().depth ?? {})) {
            dep[k] = (dep[k] ?? 0) + (n as number);
          }
        });

        const msgs: Message[] = [];
        msgSnap.forEach((d) => {
          const v = d.data();
          msgs.push({
            id: d.id,
            name: v.name ?? "",
            email: v.email ?? "",
            message: v.message ?? "",
            createdAt: v.createdAt instanceof Timestamp ? v.createdAt.toDate() : null,
          });
        });

        if (cancelled) return;
        setRows(dayRows);
        setProjects(proj);
        setDepth(dep);
        setMessages(msgs);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [range]);

  const totals = useMemo(() => {
    const views = rows.reduce((n, r) => n + r.views, 0);
    const uniques = rows.reduce((n, r) => n + r.uniques, 0);
    const sources: Partial<Record<SourceKey, number>> = {};
    for (const r of rows) {
      for (const [k, n] of Object.entries(r.sources)) {
        sources[k as SourceKey] = (sources[k as SourceKey] ?? 0) + (n as number);
      }
    }
    return { views, uniques, sources };
  }, [rows]);

  const rankedSources = useMemo(
    () =>
      (Object.entries(totals.sources) as [SourceKey, number][])
        .filter(([, n]) => n > 0)
        .sort((a, b) => b[1] - a[1]),
    [totals.sources],
  );

  const rankedProjects = useMemo(
    () =>
      Object.entries(projects)
        .filter(([, n]) => n > 0)
        .sort((a, b) => b[1] - a[1]),
    [projects],
  );

  const series = useMemo(() => {
    const byDay = new Map(rows.map((r) => [r.day, r]));
    return lastNDays(range).map((d) => ({
      day: d,
      views: byDay.get(d)?.views ?? 0,
      uniques: byDay.get(d)?.uniques ?? 0,
    }));
  }, [rows, range]);

  const peak = Math.max(1, ...series.map((s) => s.views));

  return (
    <div className="space-y-8">
      {/* Range switch */}
      <div className="flex items-center gap-2">
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              range === r
                ? "bg-accent text-ink"
                : "border border-line text-muted hover:text-fg"
            }`}
          >
            {r} days
          </button>
        ))}
        {loading && <span className="text-xs text-faint">Loading…</span>}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>

      {/* Headline numbers */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile label="Visits" value={totals.views} />
        <Tile label="Unique visitors" value={totals.uniques} />
        <Tile label="Enquiries" value={messages.length} accent />
        <Tile
          label="Read to the end"
          value={depth.d100 ?? 0}
          suffix={totals.views ? ` · ${Math.round(((depth.d100 ?? 0) / totals.views) * 100)}%` : ""}
        />
      </div>

      {/* Traffic over time */}
      <Panel title="Traffic">
        {series.every((s) => s.views === 0) ? (
          <Empty>No visits recorded in this window.</Empty>
        ) : (
          <div className="flex h-44 items-end gap-[3px]">
            {series.map((s) => (
              <div key={s.day} className="group relative flex-1">
                <div
                  className="w-full rounded-t bg-accent/25 transition-colors group-hover:bg-accent/50"
                  style={{ height: `${(s.views / peak) * 100}%`, minHeight: s.views ? 3 : 0 }}
                />
                <div
                  className="absolute bottom-0 w-full rounded-t bg-accent"
                  style={{ height: `${(s.uniques / peak) * 100}%`, minHeight: s.uniques ? 3 : 0 }}
                />
                <div className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-line bg-ink px-2 py-1 text-[0.7rem] group-hover:block">
                  {s.day.slice(5)} · {s.views} / {s.uniques}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex gap-4 text-xs text-faint">
          <Legend colour="var(--color-accent)" label="Unique" />
          <Legend colour="color-mix(in srgb, var(--color-accent) 25%, transparent)" label="Total visits" />
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Where they came from */}
        <Panel title="Where they came from">
          {rankedSources.length === 0 ? (
            <Empty>Nothing recorded yet.</Empty>
          ) : (
            <ul className="space-y-2.5">
              {rankedSources.map(([key, n]) => (
                <li key={key}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span>{SOURCE_LABELS[key] ?? key}</span>
                    <span className="font-mono text-xs text-muted">
                      {n} · {Math.round((n / Math.max(1, totals.views)) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(n / Math.max(1, rankedSources[0][1])) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* What they looked at */}
        <Panel title="Projects they actually read">
          {rankedProjects.length === 0 ? (
            <Empty>No project has been on screen long enough yet.</Empty>
          ) : (
            <ul className="space-y-2.5">
              {rankedProjects.map(([slug, n]) => (
                <li key={slug}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span>{PROJECT_NAMES[slug] ?? slug}</span>
                    <span className="font-mono text-xs text-muted">{n}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${(n / rankedProjects[0][1]) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-faint">
            Counted only when a project stays on screen for two seconds, so this
            reflects reading rather than scrolling past.
          </p>
        </Panel>
      </div>

      {/* How far they got */}
      <Panel title="How far down the page they got">
        <div className="grid grid-cols-4 gap-3">
          {([25, 50, 75, 100] as const).map((mark) => {
            const n = depth[`d${mark}`] ?? 0;
            const share = totals.views ? Math.round((n / totals.views) * 100) : 0;
            return (
              <div key={mark} className="rounded-xl border border-line bg-white/[0.02] p-4">
                <div className="text-xs text-faint">{mark}% of page</div>
                <div className="mt-1 text-2xl font-semibold">{n}</div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.min(100, share)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Enquiries */}
      <Panel title={`Enquiries (${messages.length})`}>
        {messages.length === 0 ? (
          <Empty>No messages yet.</Empty>
        ) : (
          <ul className="divide-y divide-line">
            {messages.map((m) => (
              <li key={m.id} className="py-4 first:pt-0 last:pb-0">
                <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-medium">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="text-sm text-accent hover:underline">
                    {m.email}
                  </a>
                  <span className="ml-auto font-mono text-xs text-faint">
                    {m.createdAt ? m.createdAt.toLocaleString() : "—"}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
                  {m.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function Tile({
  label,
  value,
  suffix = "",
  accent = false,
}: {
  label: string;
  value: number;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-5">
      <div className="text-xs uppercase tracking-[0.12em] text-faint">{label}</div>
      <div className={`mt-1.5 text-3xl font-semibold ${accent ? "text-accent" : ""}`}>
        {value.toLocaleString()}
        {suffix && <span className="text-sm font-normal text-faint">{suffix}</span>}
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white/[0.02] p-6">
      <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.12em] text-accent">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-faint">{children}</p>;
}

function Legend({ colour, label }: { colour: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-sm" style={{ background: colour }} />
      {label}
    </span>
  );
}
