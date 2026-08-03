"use client";

import { useEffect } from "react";
import { doc, increment, setDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { dayKey, resolveSource } from "@/lib/analytics";

const VISITOR_KEY = "srz_visitor";
const LAST_DAY_KEY = "srz_last_day";

/**
 * Records one visit per page load into a per-day aggregate document.
 *
 * Only counters are stored — no IP, no user agent, no path history and no
 * identifier that leaves the visitor's own browser. The visitor id exists
 * purely so a returning reader isn't counted as unique twice, and it never
 * reaches Firestore.
 */
export function Tracker() {
  useEffect(() => {
    const db = getDb();
    if (!db) return;

    // Respect an explicit do-not-track signal.
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;

    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const source = resolveSource(
          document.referrer || null,
          params.get("utm_source") ?? params.get("ref"),
        );
        const today = dayKey(new Date());

        let visitor = localStorage.getItem(VISITOR_KEY);
        if (!visitor) {
          visitor = crypto.randomUUID();
          localStorage.setItem(VISITOR_KEY, visitor);
        }

        // First load of the day from this browser counts as a unique visitor.
        const isNewToday = localStorage.getItem(LAST_DAY_KEY) !== today;
        if (isNewToday) localStorage.setItem(LAST_DAY_KEY, today);

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
    const id = window.setTimeout(run, 1200);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
