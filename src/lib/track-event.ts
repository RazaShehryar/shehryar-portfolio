"use client";

import { doc, increment, setDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { dayKey } from "@/lib/analytics";

/** Keys are stored raw, so keep them to a safe, predictable shape. */
const SAFE = /^[a-z0-9_]{1,60}$/;

/**
 * Counts one interaction against today's event tally.
 *
 * Fire-and-forget by design: an analytics write must never delay or break the
 * thing the visitor actually clicked.
 */
export function trackEvent(name: string) {
  if (!SAFE.test(name)) return;
  if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;

  const db = getDb();
  if (!db) return;

  void setDoc(
    doc(db, "events", dayKey(new Date())),
    { e: { [name]: increment(1) } },
    { merge: true },
  ).catch(() => {});
}

/** Convenience for the project-scoped events, keeping key shapes consistent. */
export const previewOpened = (slug: string) => trackEvent(`preview_${slug.replace(/-/g, "_")}`);
export const outboundClicked = (label: string) =>
  trackEvent(`out_${label.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 40)}`);
