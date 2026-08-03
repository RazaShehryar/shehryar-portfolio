"use client";

import { useEffect, useRef, useState } from "react";
import { doc, getDoc, increment, setDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { dayKey } from "@/lib/analytics";

/** Slugs this tab has already counted, so scrolling back is free. */
const counted = new Set<string>();

/**
 * Counts a project as viewed only once it has actually been on screen for a
 * moment, then returns its running total.
 *
 * Counting on mount would credit every project on every page load, since they
 * all render up front — which tells you nothing about what people look at.
 * Requiring real visibility makes the number mean something.
 */
export function useProjectViews(slug: string) {
  const [views, setViews] = useState<number | null>(null);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const db = getDb();
    if (!db) return;

    let cancelled = false;
    let dwell: number | undefined;

    const record = async () => {
      if (counted.has(slug)) return;
      counted.add(slug);
      const today = dayKey(new Date());
      try {
        await setDoc(doc(db, "views", slug), { count: increment(1) }, { merge: true });
        await setDoc(
          doc(db, "projectStats", today),
          { projects: { [slug]: increment(1) } },
          { merge: true },
        );
        const snap = await getDoc(doc(db, "views", slug));
        if (!cancelled && snap.exists()) setViews(snap.data().count ?? 0);
      } catch {
        /* never surface analytics failures to a reader */
      }
    };

    const readOnly = async () => {
      try {
        const snap = await getDoc(doc(db, "views", slug));
        if (!cancelled && snap.exists()) setViews(snap.data().count ?? 0);
      } catch {
        /* ignore */
      }
    };

    if (counted.has(slug)) {
      readOnly();
      return () => {
        cancelled = true;
      };
    }

    const el = ref.current;
    if (!el) {
      // No element wired up: fall back to reading the total without counting.
      readOnly();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Two seconds on screen separates reading from scrolling past.
          dwell = window.setTimeout(record, 2000);
        } else if (dwell) {
          window.clearTimeout(dwell);
          dwell = undefined;
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      if (dwell) window.clearTimeout(dwell);
      observer.disconnect();
    };
  }, [slug]);

  return { views, ref };
}
