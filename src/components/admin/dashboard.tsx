"use client";

import { useEffect, useMemo, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { loadFirestore } from "@/lib/firebase";
import {
  DWELL_LABELS,
  EVENT_LABELS,
  SOURCE_LABELS,
  countryName,
  dayKey,
  type SourceKey,
} from "@/lib/analytics";
import { featured, moreWork } from "@/lib/projects";

type Maps = Record<string, Record<string, number>>;

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date | null;
};

const RANGES = [7, 30, 90] as const;

/** Dimension maps carried on each `stats` document. */
const DIMENSIONS = [
  "sources",
  "devices",
  "browsers",
  "os",
  "hours",
  "langs",
  "countries",
  "visitorType",
] as const;

const PROJECT_NAMES: Record<string, string> = {
  ...Object.fromEntries(featured.map((p) => [p.slug, p.name])),
  ...Object.fromEntries(moreWork.map((p) => [p.slug, p.name])),
};

function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(dayKey(new Date(Date.now() - i * 86_400_000)));
  return out;
}

/** Sums a nested counter map across every document inside the window. */
function accumulate(
  target: Record<string, number>,
  source: Record<string, unknown> | undefined,
) {
  if (!source) return;
  for (const [k, v] of Object.entries(source)) {
    if (typeof v === "number") target[k] = (target[k] ?? 0) + v;
  }
}

export function Dashboard() {
  const [range, setRange] = useState<(typeof RANGES)[number]>(30);
  const [series, setSeries] = useState<{ day: string; views: number; uniques: number }[]>([]);
  const [dims, setDims] = useState<Maps>({});
  const [projects, setProjects] = useState<Record<string, number>>({});
  const [depth, setDepth] = useState<Record<string, number>>({});
  const [dwell, setDwell] = useState<Record<string, number>>({});
  const [events, setEvents] = useState<Record<string, number>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const fs = await loadFirestore();
        if (!fs || cancelled) return;
        const { db, collection, getDocs, limit, orderBy, query } = fs;

        const days = lastNDays(range);
        const inWindow = new Set(days);

        const [statsSnap, projSnap, depthSnap, engSnap, evtSnap, msgSnap] = await Promise.all([
          getDocs(collection(db, "stats")),
          getDocs(collection(db, "projectStats")),
          getDocs(collection(db, "depthStats")),
          getDocs(collection(db, "engagement")),
          getDocs(collection(db, "events")),
          getDocs(query(collection(db, "contacts"), orderBy("createdAt", "desc"), limit(100))),
        ]);

        const byDay = new Map<string, { views: number; uniques: number }>();
        const nextDims: Maps = Object.fromEntries(DIMENSIONS.map((d) => [d, {}]));

        statsSnap.forEach((d) => {
          if (!inWindow.has(d.id)) return;
          const v = d.data();
          byDay.set(d.id, { views: v.views ?? 0, uniques: v.uniques ?? 0 });
          for (const dim of DIMENSIONS) accumulate(nextDims[dim], v[dim]);
        });

        const proj: Record<string, number> = {};
        projSnap.forEach((d) => {
          if (inWindow.has(d.id)) accumulate(proj, d.data().projects);
        });

        const dep: Record<string, number> = {};
        depthSnap.forEach((d) => {
          if (inWindow.has(d.id)) accumulate(dep, d.data().depth);
        });

        const dw: Record<string, number> = {};
        engSnap.forEach((d) => {
          if (inWindow.has(d.id)) accumulate(dw, d.data().dwell);
        });

        const ev: Record<string, number> = {};
        evtSnap.forEach((d) => {
          if (inWindow.has(d.id)) accumulate(ev, d.data().e);
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
        setSeries(
          days.map((d) => ({
            day: d,
            views: byDay.get(d)?.views ?? 0,
            uniques: byDay.get(d)?.uniques ?? 0,
          })),
        );
        setDims(nextDims);
        setProjects(proj);
        setDepth(dep);
        setDwell(dw);
        setEvents(ev);
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

  const totalViews = useMemo(() => series.reduce((n, s) => n + s.views, 0), [series]);
  const totalUniques = useMemo(() => series.reduce((n, s) => n + s.uniques, 0), [series]);
  const peak = Math.max(1, ...series.map((s) => s.views));

  // Bands are cumulative, so the widest one is the count of real reads.
  const engaged = dwell.s10 ?? 0;
  const dwellTotal = totalViews;

  const previewOpens = useMemo(
    () =>
      Object.entries(events)
        .filter(([k]) => k.startsWith("preview_"))
        .map(([k, v]) => [PROJECT_NAMES[k.slice(8).replace(/_/g, "-")] ?? k.slice(8), v] as [string, number]),
    [events],
  );

  const outbound = useMemo(
    () =>
      Object.entries(events)
        .filter(([k]) => k.startsWith("out_"))
        .map(([k, v]) => [k.slice(4).replace(/_/g, " "), v] as [string, number]),
    [events],
  );

  const funnel = [
    { label: "Visits", n: totalViews },
    { label: "Read past 10s", n: engaged },
    { label: "Started the form", n: events.contact_start ?? 0 },
    { label: "Sent a message", n: events.contact_sent ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              range === r ? "bg-accent text-ink" : "border border-line text-muted hover:text-fg"
            }`}
          >
            {r} days
          </button>
        ))}
        {loading && <span className="text-xs text-faint">Loading…</span>}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile label="Visits" value={totalViews} />
        <Tile label="Unique" value={totalUniques} />
        <Tile
          label="Engaged"
          value={engaged}
          hint={dwellTotal ? `${Math.round((engaged / dwellTotal) * 100)}% stayed` : undefined}
        />
        <Tile label="Enquiries" value={messages.length} accent />
      </div>

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
                <div className="pointer-events-none absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-line bg-ink px-2 py-1 text-[0.7rem] group-hover:block">
                  {s.day.slice(5)} · {s.views} / {s.uniques}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex gap-4 text-xs text-faint">
          <Legend colour="var(--color-accent)" label="Unique" />
          <Legend colour="color-mix(in srgb, var(--color-accent) 25%, transparent)" label="Total" />
        </div>
      </Panel>

      {/* Conversion funnel */}
      <Panel title="From visit to enquiry">
        <div className="space-y-2.5">
          {funnel.map((step, i) => (
            <div key={step.label}>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span>{step.label}</span>
                <span className="font-mono text-xs text-muted">
                  {step.n}
                  {i > 0 && funnel[0].n > 0 && (
                    <span className="ml-2 text-faint">
                      {Math.round((step.n / funnel[0].n) * 100)}%
                    </span>
                  )}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-soft"
                  style={{ width: `${funnel[0].n ? (step.n / funnel[0].n) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Where they came from">
          <BarList
            rows={Object.entries(dims.sources ?? {}).map(([k, v]) => [
              SOURCE_LABELS[k as SourceKey] ?? k,
              v,
            ])}
            total={totalViews}
            empty="Nothing recorded yet."
          />
        </Panel>

        <Panel title="Countries">
          <BarList
            rows={Object.entries(dims.countries ?? {}).map(([k, v]) => [countryName(k), v])}
            total={totalViews}
            colour="#4C8DFF"
            empty="No country data yet."
          />
        </Panel>

        <Panel title="Projects they actually read">
          <BarList
            rows={Object.entries(projects).map(([k, v]) => [PROJECT_NAMES[k] ?? k, v])}
            colour="#34D399"
            empty="No project has held attention yet."
          />
          <p className="mt-4 text-xs text-faint">
            Counted only after a project stays on screen for two seconds.
          </p>
        </Panel>

        <Panel title="Previews opened">
          <BarList rows={previewOpens} colour="#F2A93B" empty="Nobody has opened a live preview yet." />
        </Panel>

        <Panel title="Devices">
          <BarList
            rows={Object.entries(dims.devices ?? {}).map(([k, v]) => [
              k.charAt(0).toUpperCase() + k.slice(1),
              v,
            ])}
            total={totalViews}
            colour="#A78BFA"
            empty="No device data yet."
          />
        </Panel>

        <Panel title="Browsers & OS">
          <div className="grid grid-cols-2 gap-5">
            <BarList rows={Object.entries(dims.browsers ?? {})} colour="#60A5FA" empty="—" compact />
            <BarList rows={Object.entries(dims.os ?? {})} colour="#F472B6" empty="—" compact />
          </div>
        </Panel>

        <Panel title="Time on page">
          <BarList
            rows={
              // Cumulative bands, so they read top-down in milestone order.
              (["s10", "s30", "s60", "s180", "s600"] as const).map(
                (k) => [DWELL_LABELS[k], dwell[k] ?? 0] as [string, number],
              )
            }
            total={dwellTotal}
            colour="#2DD4BF"
            empty="No sessions measured yet."
            preserveOrder
          />
        </Panel>

        <Panel title="New vs returning">
          <BarList
            rows={Object.entries(dims.visitorType ?? {}).map(([k, v]) => [
              k.charAt(0).toUpperCase() + k.slice(1),
              v,
            ])}
            total={totalViews}
            colour="#FBBF24"
            empty="—"
          />
        </Panel>
      </div>

      {/* When they visit */}
      <Panel title="When they visit (your time)">
        {Object.keys(dims.hours ?? {}).length === 0 ? (
          <Empty>No data yet.</Empty>
        ) : (
          <div className="flex h-28 items-end gap-1">
            {Array.from({ length: 24 }, (_, h) => {
              const key = `h${String(h).padStart(2, "0")}`;
              const n = dims.hours?.[key] ?? 0;
              const max = Math.max(1, ...Object.values(dims.hours ?? {}));
              return (
                <div key={key} className="group relative flex-1">
                  <div
                    className="w-full rounded-t bg-accent/70 transition-colors group-hover:bg-accent"
                    style={{ height: `${(n / max) * 100}%`, minHeight: n ? 3 : 1 }}
                  />
                  <div className="mt-1.5 text-center text-[0.6rem] text-faint">
                    {h % 6 === 0 ? h : ""}
                  </div>
                  <div className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-line bg-ink px-2 py-1 text-[0.7rem] group-hover:block">
                    {String(h).padStart(2, "0")}:00 · {n}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="How far down they got">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {([25, 50, 75, 100] as const).map((mark) => {
              const n = depth[`d${mark}`] ?? 0;
              const share = totalViews ? Math.round((n / totalViews) * 100) : 0;
              return (
                <div key={mark} className="rounded-xl border border-line bg-white/[0.02] p-4">
                  <div className="text-xs text-faint">{mark}%</div>
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

        <Panel title="Outbound clicks">
          <BarList rows={outbound} colour="#94A3B8" empty="No outbound links clicked yet." />
        </Panel>
      </div>

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

      <p className="pb-4 text-center text-xs text-faint">
        {Object.entries(EVENT_LABELS).length > 0 && "Counters only — no IP, no raw user agent, no path history."}
      </p>
    </div>
  );
}

function BarList({
  rows,
  total,
  colour = "var(--color-accent)",
  empty,
  compact = false,
  preserveOrder = false,
}: {
  rows: [string, number][];
  total?: number;
  colour?: string;
  empty: string;
  compact?: boolean;
  preserveOrder?: boolean;
}) {
  const cleaned = rows.filter(([, n]) => n > 0);
  const sorted = preserveOrder ? cleaned : [...cleaned].sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return <Empty>{empty}</Empty>;
  const max = Math.max(...sorted.map(([, n]) => n));

  return (
    <ul className={compact ? "space-y-2" : "space-y-2.5"}>
      {sorted.map(([label, n]) => (
        <li key={label}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate capitalize">{label}</span>
            <span className="shrink-0 font-mono text-xs text-muted">
              {n}
              {total ? <span className="ml-1.5 text-faint">{Math.round((n / total) * 100)}%</span> : null}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full"
              style={{ width: `${(n / max) * 100}%`, background: colour }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Tile({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-5">
      <div className="text-xs uppercase tracking-[0.12em] text-faint">{label}</div>
      <div className={`mt-1.5 text-3xl font-semibold ${accent ? "text-accent" : ""}`}>
        {value.toLocaleString()}
      </div>
      {hint && <div className="mt-1 text-xs text-faint">{hint}</div>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white/[0.02] p-6">
      <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.12em] text-accent">{title}</h2>
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
