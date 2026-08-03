"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, increment, setDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";

/** Remembers which slugs this tab already counted, so a scroll-back is free. */
const counted = new Set<string>();

/**
 * Reads a project's view counter and bumps it once per session.
 * Returns null while loading, or when Firestore is unavailable, so callers
 * can simply omit the figure rather than render a zero.
 */
export function useProjectViews(slug: string): number | null {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const db = getDb();
    if (!db) return;

    let cancelled = false;
    const ref = doc(db, "views", slug);

    (async () => {
      try {
        if (counted.has(slug)) {
          const snap = await getDoc(ref);
          if (!cancelled && snap.exists()) setViews(snap.data().count ?? 0);
          return;
        }

        counted.add(slug);
        await setDoc(ref, { count: increment(1) }, { merge: true });
        const snap = await getDoc(ref);
        if (!cancelled && snap.exists()) setViews(snap.data().count ?? 0);
      } catch {
        // A blocked or offline write should never surface to the visitor.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return views;
}
