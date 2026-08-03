import { NextResponse } from "next/server";
import { SOURCE_LABELS, dayKey, type SourceKey } from "@/lib/analytics";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const TZ = "Asia/Karachi";

type Counts = {
  views: number;
  uniques: number;
  sources: Partial<Record<SourceKey, number>>;
};

/**
 * Reads one aggregate document over the Firestore REST API.
 *
 * `stats` and `contactStats` are world-readable by rule — they hold nothing
 * but counters — so this needs no service account, which keeps the project on
 * the free Spark plan.
 */
async function readDoc(collection: string, day: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${collection}/${day}?key=${API_KEY}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.fields ?? null;
}

function int(field: unknown): number {
  if (!field || typeof field !== "object") return 0;
  const f = field as { integerValue?: string; doubleValue?: number };
  if (f.integerValue != null) return Number(f.integerValue);
  if (f.doubleValue != null) return Math.round(f.doubleValue);
  return 0;
}

async function collect(day: string): Promise<Counts & { contacts: number }> {
  const [stats, contacts] = await Promise.all([
    readDoc("stats", day),
    readDoc("contactStats", day),
  ]);

  const sourceFields = stats?.sources?.mapValue?.fields ?? {};
  const sources: Partial<Record<SourceKey, number>> = {};
  for (const [k, v] of Object.entries(sourceFields)) {
    sources[k as SourceKey] = int(v);
  }

  return {
    views: int(stats?.views),
    uniques: int(stats?.uniques),
    sources,
    contacts: int(contacts?.count),
  };
}

function pct(part: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function buildEmail(day: string, today: Counts & { contacts: number }, prev: Counts) {
  const ranked = (Object.entries(today.sources) as [SourceKey, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);

  const delta = (now: number, before: number) => {
    if (!before) return now > 0 ? `<span style="color:#16a34a">new</span>` : "—";
    const d = Math.round(((now - before) / before) * 100);
    if (d === 0) return `<span style="color:#71717a">no change</span>`;
    const up = d > 0;
    return `<span style="color:${up ? "#16a34a" : "#dc2626"}">${up ? "▲" : "▼"} ${Math.abs(d)}%</span>`;
  };

  const rows = ranked.length
    ? ranked
        .map(
          ([k, n]) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f1f1f4">${SOURCE_LABELS[k] ?? k}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f1f1f4;text-align:right;font-variant-numeric:tabular-nums"><strong>${n}</strong></td>
        <td style="padding:8px 0 8px 16px;border-bottom:1px solid #f1f1f4;text-align:right;color:#71717a;font-variant-numeric:tabular-nums">${pct(n, today.views)}</td>
      </tr>`,
        )
        .join("")
    : `<tr><td colspan="3" style="padding:14px 0;color:#a1a1aa">No traffic recorded.</td></tr>`;

  const tile = (label: string, value: number, before: number) => `
    <td style="padding:14px 16px;background:#fafafa;border:1px solid #eeeef1;border-radius:10px;width:33%">
      <div style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:.08em">${label}</div>
      <div style="font-size:28px;font-weight:700;margin:4px 0 2px">${value}</div>
      <div style="font-size:12px">${delta(value, before)} vs previous day</div>
    </td>`;

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f4f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#18181b">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;border:1px solid #eeeef1">
    <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#ff7a30;font-weight:600">Daily traffic</div>
    <h1 style="margin:6px 0 2px;font-size:20px">shehryar-raza.dev</h1>
    <p style="margin:0 0 22px;color:#71717a;font-size:14px">${day} · Asia/Karachi</p>

    <table style="width:100%;border-collapse:separate;border-spacing:8px 0;margin-bottom:24px"><tr>
      ${tile("Visits", today.views, prev.views)}
      ${tile("Unique", today.uniques, prev.uniques)}
      ${tile("Enquiries", today.contacts, 0)}
    </tr></table>

    <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#71717a;margin:0 0 8px">Where they came from</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>

    ${
      today.contacts > 0
        ? `<div style="margin-top:22px;padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;font-size:14px">
             <strong>${today.contacts} new ${today.contacts === 1 ? "enquiry" : "enquiries"}</strong> waiting in the Firebase console.
           </div>`
        : ""
    }

    <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa;line-height:1.5">
      Counts are per-day aggregates. Uniques are counted once per browser per day.
      Visits arriving from Upwork or Fiverr messages only attribute correctly when
      the link carries <code>?utm_source=upwork</code> — those platforms strip the referrer.
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
    // Still useful without email configured: hitting the route returns the data.
    return NextResponse.json({ sent: false, reason: "RESEND_API_KEY missing", day: today, ...current });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `${current.views} visits, ${current.uniques} unique — ${today}`,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json({ sent: false, status: res.status, detail }, { status: 502 });
  }

  return NextResponse.json({ sent: true, day: today, ...current });
}
