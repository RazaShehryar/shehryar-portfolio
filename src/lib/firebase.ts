"use client";

import type { Firestore } from "firebase/firestore";

/**
 * Firebase web config is public by design — it identifies the project rather
 * than authorising anything. Access is controlled by the rules in
 * `firestore.rules`, not by hiding these values.
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseReady = Boolean(config.apiKey && config.projectId);

/** The Firestore module plus a live handle, so callers need one import. */
export type FirestoreApi = typeof import("firebase/firestore") & { db: Firestore };

let pending: Promise<FirestoreApi | null> | null = null;

/**
 * Loads the Firestore SDK on demand and returns it with a ready handle.
 *
 * Nothing here imports `firebase/*` at the top level, and that is the point:
 * a static import anywhere in the public page graph put 568KB — 173KB over the
 * wire — into the initial bundle of every route. Every use of Firestore on the
 * public site is either analytics or a form submission, none of which is needed
 * for first paint, so it now arrives in its own chunk once the page is up.
 *
 * Resolves to null when the project is not configured, so callers degrade
 * instead of throwing during a build or a preview without env vars.
 */
export function loadFirestore(): Promise<FirestoreApi | null> {
  if (!firebaseReady) return Promise.resolve(null);

  pending ??= (async () => {
    try {
      const [app, firestore] = await Promise.all([
        import("firebase/app"),
        import("firebase/firestore"),
      ]);
      const instance = app.getApps().length ? app.getApp() : app.initializeApp(config);
      return { ...firestore, db: firestore.getFirestore(instance) };
    } catch {
      // Let a later call retry rather than caching the failure forever.
      pending = null;
      return null;
    }
  })();

  return pending;
}
