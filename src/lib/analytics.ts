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

/** Local hour in the report's timezone, 0–23, as a two-digit bucket key. */
export function hourKey(date: Date, timeZone = "Asia/Karachi"): string {
  const h = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    hour12: false,
  }).format(date);
  return h.padStart(2, "0");
}

export type DeviceKind = "desktop" | "mobile" | "tablet";

/**
 * Coarse device, browser and OS buckets from the user agent.
 *
 * Deliberately hand-rolled and low-resolution: the goal is "are these people
 * on phones?", not device identification. The raw user agent is never stored.
 * Order matters — Edge and Opera both claim Chrome, and Chrome claims Safari.
 */
export function parseClient(ua: string): {
  device: DeviceKind;
  browser: string;
  os: string;
} {
  const s = ua.toLowerCase();

  const tablet = /ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s);
  const mobile = /iphone|ipod|android.*mobile|windows phone|blackberry|opera mini/.test(s);
  const device: DeviceKind = tablet ? "tablet" : mobile ? "mobile" : "desktop";

  let browser = "Other";
  if (/edg\//.test(s)) browser = "Edge";
  else if (/opr\/|opera/.test(s)) browser = "Opera";
  else if (/samsungbrowser/.test(s)) browser = "Samsung";
  else if (/firefox|fxios/.test(s)) browser = "Firefox";
  else if (/chrome|crios/.test(s)) browser = "Chrome";
  else if (/safari/.test(s)) browser = "Safari";

  let os = "Other";
  if (/windows/.test(s)) os = "Windows";
  else if (/iphone|ipad|ipod/.test(s)) os = "iOS";
  else if (/mac os x/.test(s)) os = "macOS";
  else if (/android/.test(s)) os = "Android";
  else if (/linux/.test(s)) os = "Linux";

  return { device, browser, os };
}

/**
 * Time-on-page milestones, in seconds.
 *
 * Recorded as they are passed rather than once on unload. Writes issued during
 * `pagehide` do not reliably complete before the page is torn down — which is
 * how the first version silently recorded nothing — so each threshold is
 * banked while the tab is still alive.
 *
 * The result is cumulative, like scroll depth: a five-minute visit counts in
 * every band up to three minutes.
 */
export const DWELL_MARKS = [10, 30, 60, 180, 600] as const;

export const DWELL_LABELS: Record<string, string> = {
  s10: "Stayed 10s+",
  s30: "30s+",
  s60: "1 min+",
  s180: "3 min+",
  s600: "10 min+",
};

/** Interaction events worth counting, keyed compactly for Firestore. */
export const EVENT_LABELS: Record<string, string> = {
  cv_download: "CV opened",
  contact_start: "Started the contact form",
  contact_sent: "Sent a message",
  nav_click: "Used the nav",
};

/** Two-letter country code to a readable name, for the codes we actually see. */
export function countryName(code: string): string {
  try {
    return (
      new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()) ?? code
    );
  } catch {
    return code;
  }
}
