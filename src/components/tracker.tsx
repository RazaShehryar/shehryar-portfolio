"use client";

import { useEffect } from "react";
import { loadFirestore, type FirestoreApi } from "@/lib/firebase";
import { DWELL_MARKS, dayKey, hourKey, parseClient, resolveSource } from "@/lib/analytics";

const LOCAL_DAY_KEY = "srz_last_day";
const SEEN_KEY = "srz_seen";

/**
 * Resolves a stable visitor id via FingerprintJS.
 *
 * The library is imported dynamically so its ~30KB never lands in the initial
 * bundle — analytics must not slow down the first paint. Only the resulting
 * hash is ever used; the underlying device signals stay in the browser.
 */
async function getVisitorId(): Promise<string | null> {
  try {
    const FingerprintJS = (await import("@fingerprintjs/fingerprintjs")).default;
    const agent = await FingerprintJS.load();
    const { visitorId } = await agent.get();
    return visitorId || null;
  } catch {
    return null;
  }
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Records a visit with its coarse dimensions, the interaction depth reached,
 * and how long the reader stayed.
 *
 * Everything written is a bucket or a counter: country code, device class,
 * browser family, OS family, local hour, scroll depth, dwell band. No IP, no
 * raw user agent, no path history, no free-text. `navigator.doNotTrack`
 * disables the lot, fingerprinting included.
 */
export function Tracker() {
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;

    const now = new Date();
    const today = dayKey(now);
    let cancelled = false;

    // Held once the SDK has loaded, so the scroll and dwell handlers below can
    // use it without each awaiting their own copy.
    let fsRef: FirestoreApi | null = null;

    /**
     * Claims today's marker for this visitor.
     *
     * Rules permit create and forbid update, so a successful write proves the
     * marker did not exist and this is a first visit today. A rejected write
     * means someone has already been counted — no read required, which keeps
     * the documents unreadable while still answering the question.
     */
    const claimUnique = async (fs: FirestoreApi, visitorId: string | null): Promise<boolean> => {
      if (!visitorId) {
        const seen = localStorage.getItem(LOCAL_DAY_KEY) === today;
        if (!seen) localStorage.setItem(LOCAL_DAY_KEY, today);
        return !seen;
      }
      try {
        await fs.setDoc(fs.doc(fs.db, "visitorDays", `${today}__${visitorId}`), { t: 1 });
        return true;
      } catch {
        return false;
      }
    };

    const recordVisit = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const source = resolveSource(
          document.referrer || null,
          params.get("utm_source") ?? params.get("ref"),
        );

        const fs = await loadFirestore();
        if (!fs || cancelled) return;
        fsRef = fs;

        const visitorId = await getVisitorId();
        if (cancelled) return;

        const isNewToday = await claimUnique(fs, visitorId);
        if (cancelled) return;

        // Returning is tracked separately from unique-today: someone can be a
        // returning visitor and still be their first visit of the day.
        const everSeen = localStorage.getItem(SEEN_KEY) === "1";
        if (!everSeen) localStorage.setItem(SEEN_KEY, "1");

        const { device, browser, os } = parseClient(navigator.userAgent);
        const country = readCookie("geo");
        const lang = (navigator.language || "").split("-")[0].slice(0, 5) || "unknown";

        await fs.setDoc(
          fs.doc(fs.db, "stats", today),
          {
            views: fs.increment(1),
            ...(isNewToday ? { uniques: fs.increment(1) } : {}),
            sources: { [source]: fs.increment(1) },
            devices: { [device]: fs.increment(1) },
            browsers: { [browser]: fs.increment(1) },
            os: { [os]: fs.increment(1) },
            hours: { [`h${hourKey(now)}`]: fs.increment(1) },
            langs: { [lang]: fs.increment(1) },
            visitorType: { [everSeen ? "returning" : "new"]: fs.increment(1) },
            ...(country ? { countries: { [country]: fs.increment(1) } } : {}),
          },
          { merge: true },
        );
      } catch {
        // Analytics must never surface an error to a reader.
      }
    };

    const timer = window.setTimeout(recordVisit, 1200);

    // Each depth threshold is recorded once per load, so one reader scrolling
    // up and down cannot inflate it.
    const reached = new Set<number>();
    const onScroll = () => {
      // Before the SDK lands, depth marks are simply not recorded rather than
      // queued: a reader who leaves in the first second is not a data point
      // worth holding an import open for.
      if (!fsRef) return;
      const fs = fsRef;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = Math.round((window.scrollY / scrollable) * 100);

      for (const mark of [25, 50, 75, 100]) {
        if (percent >= mark && !reached.has(mark)) {
          reached.add(mark);
          void fs.setDoc(
            fs.doc(fs.db, "depthStats", today),
            { depth: { [`d${mark}`]: fs.increment(1) } },
            { merge: true },
          ).catch(() => {});
        }
      }
    };

    // Each dwell milestone is banked as it is passed, while the tab is still
    // alive. Writing once on pagehide loses the record — the request does not
    // finish before teardown — so this trades a little write volume for data
    // that actually arrives.
    const dwellTimers = DWELL_MARKS.map((mark) =>
      window.setTimeout(() => {
        const fs = fsRef;
        if (!fs) return;
        void fs.setDoc(
          fs.doc(fs.db, "engagement", today),
          { dwell: { [`s${mark}`]: fs.increment(1) } },
          { merge: true },
        ).catch(() => {});
      }, mark * 1000),
    );

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      for (const t of dwellTimers) window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
