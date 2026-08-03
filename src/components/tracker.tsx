"use client";

import { useEffect } from "react";
import { doc, increment, setDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { dayKey, resolveSource } from "@/lib/analytics";

const LOCAL_DAY_KEY = "srz_last_day";

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

/**
 * Records one visit per page load, plus how far down the page the reader gets.
 *
 * Uniques are deduped on a browser fingerprint rather than localStorage, so
 * clearing storage or opening a private window no longer inflates the count.
 * What reaches Firestore is a one-way hash under a per-day key and nothing
 * else — no IP, no user agent, no path history, no raw device signals. The
 * marker documents are write-once, so they cannot be read back to reconstruct
 * anyone's history.
 *
 * `navigator.doNotTrack` disables the whole thing, fingerprint included.
 */
export function Tracker() {
  useEffect(() => {
    const db = getDb();
    if (!db) return;

    // An explicit do-not-track signal opts out of fingerprinting entirely.
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;

    const today = dayKey(new Date());
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
        // Fingerprinting unavailable (blocked or failed): fall back to the
        // local marker so the count degrades rather than disappearing.
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

        await setDoc(
          doc(db, "stats", today),
          {
            views: increment(1),
            ...(isNewToday ? { uniques: increment(1) } : {}),
            sources: { [source]: increment(1) },
          },
          { merge: true },
        );
      } catch {
        // Analytics must never surface an error to a reader.
      }
    };

    // Defer past first paint so tracking never competes with rendering.
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
          setDoc(
            doc(db, "depthStats", today),
            { depth: { [`d${mark}`]: increment(1) } },
            { merge: true },
          ).catch(() => {});
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
