import { NextResponse } from "next/server";
import {
  DWELL_LABELS,
  SOURCE_LABELS,
  countryName,
  dayKey,
  type SourceKey,
} from "@/lib/analytics";
import { featured, moreWork } from "@/lib/projects";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const TZ = "Asia/Karachi";

const PROJECT_NAMES: Record<string, string> = {
  ...Object.fromEntries(featured.map((p) => [p.slug, p.name])),
  ...Object.fromEntries(moreWork.map((p) => [p.slug, p.name])),
};

type Counter = Record<string, number>;

type Snapshot = {
  views: number;
  uniques: number;
  sources: Counter;
  countries: Counter;
  devices: Counter;
  browsers: Counter;
  os: Counter;
  hours: Counter;
  visitorType: Counter;
  projects: Counter;
  depth: Counter;
  dwell: Counter;
  events: Counter;
  contacts: number;
};

/**
 * Reads one aggregate document over the Firestore REST API.
 *
 * The analytics collections are world-readable by rule — they hold nothing
 * but counters — so this needs no service account, which keeps the project on
 * the free Spark plan.
 */
async function readDoc(collection: string, day: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${collection}/${day}?key=${API_KEY}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()).fields ?? null;
}

function int(field: unknown): number {
  if (!field || typeof field !== "object") return 0;
  const f = field as { integerValue?: string; doubleValue?: number };
  if (f.integerValue != null) return Number(f.integerValue);
  if (f.doubleValue != null) return Math.round(f.doubleValue);
  return 0;
}

/** Flattens a Firestore mapValue into a plain counter object. */
function counter(field: unknown): Counter {
  const fields = (field as { mapValue?: { fields?: Record<string, unknown> } })?.mapValue?.fields;
  if (!fields) return {};
  const out: Counter = {};
  for (const [k, v] of Object.entries(fields)) out[k] = int(v);
  return out;
}

async function collect(day: string): Promise<Snapshot> {
  const [stats, contacts, proj, dep, eng, evt] = await Promise.all([
    readDoc("stats", day),
    readDoc("contactStats", day),
    readDoc("projectStats", day),
    readDoc("depthStats", day),
    readDoc("engagement", day),
    readDoc("events", day),
  ]);

  return {
    views: int(stats?.views),
    uniques: int(stats?.uniques),
    sources: counter(stats?.sources),
    countries: counter(stats?.countries),
    devices: counter(stats?.devices),
    browsers: counter(stats?.browsers),
    os: counter(stats?.os),
    hours: counter(stats?.hours),
    visitorType: counter(stats?.visitorType),
    projects: counter(proj?.projects),
    depth: counter(dep?.depth),
    dwell: counter(eng?.dwell),
    events: counter(evt?.e),
    contacts: int(contacts?.count),
  };
}

const rank = (c: Counter, n = 6) =>
  Object.entries(c)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);

function delta(now: number, before: number) {
  if (!before) return now > 0 ? `<span style="color:#16a34a">new</span>` : "—";
  const d = Math.round(((now - before) / before) * 100);
  if (d === 0) return `<span style="color:#71717a">level</span>`;
  const up = d > 0;
  return `<span style="color:${up ? "#16a34a" : "#dc2626"}">${up ? "▲" : "▼"} ${Math.abs(d)}%</span>`;
}

function table(rows: [string, number][], total: number, colour: string) {
  if (rows.length === 0)
    return `<p style="margin:0;color:#a1a1aa;font-size:13px">Nothing recorded.</p>`;
  const max = Math.max(...rows.map(([, n]) => n));
  return `<table style="width:100%;border-collapse:collapse;font-size:13px">${rows
    .map(
      ([label, n]) => `
    <tr>
      <td style="padding:5px 0;width:42%;text-transform:capitalize">${label}</td>
      <td style="padding:5px 0">
        <div style="background:#f1f1f4;border-radius:4px;height:7px;width:100%">
          <div style="background:${colour};border-radius:4px;height:7px;width:${Math.round((n / max) * 100)}%"></div>
        </div>
      </td>
      <td style="padding:5px 0 5px 10px;text-align:right;width:64px;font-variant-numeric:tabular-nums">
        <strong>${n}</strong>${total ? `<span style="color:#a1a1aa"> ${Math.round((n / total) * 100)}%</span>` : ""}
      </td>
    </tr>`,
    )
    .join("")}</table>`;
}

function section(title: string, body: string) {
  return `
  <h2 style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#71717a;margin:26px 0 10px;font-weight:600">${title}</h2>
  ${body}`;
}

function buildEmail(day: string, t: Snapshot, prev: Snapshot) {
  // Bands are cumulative, so the widest one is the count of real reads.
  const engaged = t.dwell.s10 ?? 0;
  const dwellTotal = t.views;

  const previews = Object.entries(t.events)
    .filter(([k]) => k.startsWith("preview_"))
    .map(([k, v]) => [PROJECT_NAMES[k.slice(8).replace(/_/g, "-")] ?? k.slice(8), v] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  const outbound = Object.entries(t.events)
    .filter(([k]) => k.startsWith("out_"))
    .map(([k, v]) => [k.slice(4).replace(/_/g, " "), v] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const tile = (label: string, value: number, before?: number, hint?: string) => `
    <td style="padding:12px 14px;background:#fafafa;border:1px solid #eeeef1;border-radius:10px;vertical-align:top">
      <div style="font-size:10px;color:#71717a;text-transform:uppercase;letter-spacing:.08em">${label}</div>
      <div style="font-size:24px;font-weight:700;margin:3px 0 1px">${value}</div>
      <div style="font-size:11px">${hint ?? (before !== undefined ? delta(value, before) : "")}</div>
    </td>`;

  const funnel = [
    ["Visits", t.views],
    ["Read past 10s", engaged],
    ["Started the form", t.events.contact_start ?? 0],
    ["Sent a message", t.events.contact_sent ?? 0],
  ] as [string, number][];

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f4f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#18181b">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;border:1px solid #eeeef1">
    <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#ff7a30;font-weight:700">Daily report</div>
    <h1 style="margin:6px 0 2px;font-size:20px">shehryar-raza.dev</h1>
    <p style="margin:0 0 20px;color:#71717a;font-size:13px">${day} · Asia/Karachi</p>

    <table style="width:100%;border-collapse:separate;border-spacing:6px 0"><tr>
      ${tile("Visits", t.views, prev.views)}
      ${tile("Unique", t.uniques, prev.uniques)}
      ${tile("Engaged", engaged, undefined, dwellTotal ? `${Math.round((engaged / dwellTotal) * 100)}% stayed` : "—")}
      ${tile("Enquiries", t.contacts, prev.contacts)}
    </tr></table>

    ${section("Where they came from", table(rank(t.sources), t.views, "#ff7a30"))}
    ${section("Countries", table(rank(t.countries).map(([c, n]) => [countryName(c), n]), t.views, "#4c8dff"))}
    ${section("Projects they actually read", table(rank(t.projects).map(([s, n]) => [PROJECT_NAMES[s] ?? s, n]), 0, "#34d399"))}
    ${previews.length ? section("Live previews opened", table(previews, 0, "#f2a93b")) : ""}
    ${section("Devices", table(rank(t.devices), t.views, "#a78bfa"))}
    ${section("Time on page", table(Object.entries(t.dwell).map(([k, n]) => [DWELL_LABELS[k] ?? k, n]), dwellTotal, "#2dd4bf"))}
    ${section("How far down they got", table([25, 50, 75, 100].map((m) => [`${m}% of page`, t.depth[`d${m}`] ?? 0] as [string, number]), t.views, "#ff7a30"))}
    ${section("From visit to enquiry", table(funnel, t.views, "#ff7a30"))}
    ${outbound.length ? section("Outbound clicks", table(outbound, 0, "#94a3b8")) : ""}

    ${
      t.contacts > 0
        ? `<div style="margin-top:24px;padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;font-size:14px">
             <strong>${t.contacts} new ${t.contacts === 1 ? "enquiry" : "enquiries"}</strong> —
             read them at <a href="https://admin.shehryar-raza.dev" style="color:#c2410c">admin.shehryar-raza.dev</a>
           </div>`
        : `<p style="margin:24px 0 0;font-size:13px;color:#71717a">
             Full breakdown at <a href="https://admin.shehryar-raza.dev" style="color:#ff7a30">admin.shehryar-raza.dev</a>
           </p>`
    }

    <p style="margin:22px 0 0;font-size:11px;color:#a1a1aa;line-height:1.6;border-top:1px solid #f1f1f4;padding-top:14px">
      Counters only — no IP, no raw user agent, no path history. Uniques dedupe on a
      browser fingerprint. Links shared on Upwork or Fiverr only attribute when they
      carry <code>?utm_source=upwork</code>, since those platforms strip the referrer.
    </p>
  </div>
</body></html>`;
}

export async function GET(request: Request) {
  // Vercel Cron signs its requests; a manual call needs the same secret.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  if (!PROJECT || !API_KEY) {
    return NextResponse.json({ error: "firebase not configured" }, { status: 500 });
  }

  const now = new Date();
  const today = dayKey(now, TZ);
  const yesterday = dayKey(new Date(now.getTime() - 86_400_000), TZ);

  const [current, previous] = await Promise.all([collect(today), collect(yesterday)]);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.REPORT_TO ?? site.email;
  const from = process.env.REPORT_FROM ?? "Portfolio <onboarding@resend.dev>";
  const html = buildEmail(today, current, previous);

  if (!apiKey) {
    return NextResponse.json({
      sent: false,
      reason: "RESEND_API_KEY missing",
      day: today,
      ...current,
    });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `${current.views} visits · ${current.uniques} unique · ${current.contacts} enquiries — ${today}`,
      html,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { sent: false, status: res.status, detail: await res.text() },
      { status: 502 },
    );
  }

  return NextResponse.json({ sent: true, day: today, ...current });
}
