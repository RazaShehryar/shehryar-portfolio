"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

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

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

/**
 * Returns the Firestore handle, creating it on first use.
 * Returns null when the project is not configured so the UI can degrade
 * instead of throwing during a build or preview without env vars.
 */
export function getDb(): Firestore | null {
  if (!firebaseReady) return null;
  if (!db) {
    app = getApps().length ? getApp() : initializeApp(config);
    db = getFirestore(app);
  }
  return db;
}
