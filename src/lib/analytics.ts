/** Shared analytics vocabulary for the tracker and the nightly report. */

export type SourceKey =
  | "upwork"
  | "fiverr"
  | "linkedin"
  | "github"
  | "twitter"
  | "instagram"
  | "facebook"
  | "youtube"
  | "reddit"
  | "google"
  | "bing"
  | "email"
  | "whatsapp"
  | "direct"
  | "other";

/** Referrer hostnames mapped to a channel. Longest match wins. */
const HOSTS: [string, SourceKey][] = [
  ["upwork.com", "upwork"],
  ["fiverr.com", "fiverr"],
  ["linkedin.com", "linkedin"],
  ["lnkd.in", "linkedin"],
  ["github.com", "github"],
  ["x.com", "twitter"],
  ["twitter.com", "twitter"],
  ["t.co", "twitter"],
  ["instagram.com", "instagram"],
  ["facebook.com", "facebook"],
  ["fb.com", "facebook"],
  ["youtube.com", "youtube"],
  ["reddit.com", "reddit"],
  ["google.", "google"],
  ["bing.com", "bing"],
  ["duckduckgo.com", "other"],
  ["mail.google.com", "email"],
  ["outlook.", "email"],
  ["web.whatsapp.com", "whatsapp"],
  ["wa.me", "whatsapp"],
];

/**
 * Resolves a visit to a channel.
 *
 * An explicit `utm_source` always wins — that is the only way to attribute a
 * link pasted into an Upwork or Fiverr message, since those open without a
 * referrer. Otherwise the referrer hostname decides, and a visit with neither
 * counts as direct.
 */
export function resolveSource(referrer: string | null, utmSource: string | null): SourceKey {
  const utm = utmSource?.trim().toLowerCase();
  if (utm) {
    const known = ([
      "upwork",
      "fiverr",
      "linkedin",
      "github",
      "twitter",
      "instagram",
      "facebook",
      "youtube",
      "reddit",
      "google",
      "bing",
      "email",
      "whatsapp",
    ] as const).find((k) => utm.includes(k));
    if (known) return known;
    return "other";
  }

  if (!referrer) return "direct";

  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "other";
  }

  // A referrer from the site itself is an internal navigation, not a source.
  if (host.endsWith("shehryar-raza.dev")) return "direct";

  for (const [needle, key] of HOSTS) {
    if (host.includes(needle)) return key;
  }
  return "other";
}

export const SOURCE_LABELS: Record<SourceKey, string> = {
  upwork: "Upwork",
  fiverr: "Fiverr",
  linkedin: "LinkedIn",
  github: "GitHub",
  twitter: "X / Twitter",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  reddit: "Reddit",
  google: "Google",
  bing: "Bing",
  email: "Email",
  whatsapp: "WhatsApp",
  direct: "Direct",
  other: "Other",
};

/** Day key in the report's timezone, e.g. "2026-08-03". */
export function dayKey(date: Date, timeZone = "Asia/Karachi"): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
