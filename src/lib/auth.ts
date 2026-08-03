"use client";

import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { getApp, getApps, initializeApp } from "firebase/app";
import { firebaseReady } from "@/lib/firebase";

/**
 * The single account permitted into the admin portal.
 *
 * This constant only controls what the interface offers. The real boundary is
 * in `firestore.rules`, which checks the same address on every read — a client
 * check alone would be trivially bypassed by calling Firestore directly.
 */
export const ADMIN_EMAIL = "shehryarraza320@gmail.com";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let auth: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  if (!firebaseReady) return null;
  if (!auth) {
    const app = getApps().length ? getApp() : initializeApp(config);
    auth = getAuth(app);
  }
  return auth;
}

export async function signInWithGoogle() {
  const a = getFirebaseAuth();
  if (!a) throw new Error("Firebase is not configured.");
  const provider = new GoogleAuthProvider();
  // Always show the chooser so a wrong account can be switched out.
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(a, provider);
}

export async function signOutAdmin() {
  const a = getFirebaseAuth();
  if (a) await signOut(a);
}

export function watchAuth(cb: (user: User | null) => void) {
  const a = getFirebaseAuth();
  if (!a) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(a, cb);
}

export function isAdmin(user: User | null) {
  return user?.email?.toLowerCase() === ADMIN_EMAIL;
}
