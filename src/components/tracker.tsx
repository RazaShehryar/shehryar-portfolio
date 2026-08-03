"use client";

import { useEffect } from "react";
import { doc, increment, setDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { dayKey, dwellBucket, hourKey, parseClient, resolveSource } from "@/lib/analytics";

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
    const db = getDb();
    if (!db) return;
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;

    const now = new Date();
    const today = dayKey(now);
    let cancelled = false;

    /**
     * Claims today's marker for this visitor.
     *
     * Rules permit create and forbid update, so a successful write proves the
     * marker did not exist and this is a first visit today. A rejected write
     * means someone has already been counted — no read required, which keeps
     * the documents unreadable while still answering the question.
     */
    const claimUnique = async (visitorId: string | null): Promise<boolean> => {
      if (!visitorId) {
        const seen = localStorage.getItem(LOCAL_DAY_KEY) === today;
        if (!seen) localStorage.setItem(LOCAL_DAY_KEY, today);
        return !seen;
      }
      try {
        await setDoc(doc(db, "visitorDays", `${today}__${visitorId}`), { t: 1 });
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

        const visitorId = await getVisitorId();
        if (cancelled) return;

        const isNewToday = await claimUnique(visitorId);
        if (cancelled) return;

        // Returning is tracked separately from unique-today: someone can be a
        // returning visitor and still be their first visit of the day.
        const everSeen = localStorage.getItem(SEEN_KEY) === "1";
        if (!everSeen) localStorage.setItem(SEEN_KEY, "1");

        const { device, browser, os } = parseClient(navigator.userAgent);
        const country = readCookie("geo");
        const lang = (navigator.language || "").split("-")[0].slice(0, 5) || "unknown";

        await setDoc(
          doc(db, "stats", today),
          {
            views: increment(1),
            ...(isNewToday ? { uniques: increment(1) } : {}),
            sources: { [source]: increment(1) },
            devices: { [device]: increment(1) },
            browsers: { [browser]: increment(1) },
            os: { [os]: increment(1) },
            hours: { [`h${hourKey(now)}`]: increment(1) },
            langs: { [lang]: increment(1) },
            visitorType: { [everSeen ? "returning" : "new"]: increment(1) },
            ...(country ? { countries: { [country]: increment(1) } } : {}),
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
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const percent = Math.round((window.scrollY / scrollable) * 100);

      for (const mark of [25, 50, 75, 100]) {
        if (percent >= mark && !reached.has(mark)) {
          reached.add(mark);
          void setDoc(
            doc(db, "depthStats", today),
            { depth: { [`d${mark}`]: increment(1) } },
            { merge: true },
          ).catch(() => {});
        }
      }
    };

    // Dwell is written once, when the page is being left. `pagehide` and a
    // hidden `visibilitychange` are the only events that fire reliably on
    // mobile, where tabs are frozen rather than unloaded.
    const start = Date.now();
    let dwellSent = false;
    const sendDwell = () => {
      if (dwellSent) return;
      dwellSent = true;
      const seconds = Math.round((Date.now() - start) / 1000);
      void setDoc(
        doc(db, "engagement", today),
        { dwell: { [dwellBucket(seconds)]: increment(1) } },
        { merge: true },
      ).catch(() => {});
    };

    const onHidden = () => {
      if (document.visibilityState === "hidden") sendDwell();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", sendDwell);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", sendDwell);
    };
  }, []);

  return null;
}
