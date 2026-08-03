"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { Lock, LogOut, ShieldAlert } from "lucide-react";
import { ADMIN_EMAIL, isAdmin, signInWithGoogle, signOutAdmin, watchAuth } from "@/lib/auth";
import { Dashboard } from "@/components/admin/dashboard";
import { GoogleIcon } from "@/components/icons";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () =>
      watchAuth((u) => {
        setUser(u);
        setReady(true);
      }),
    [],
  );

  const onSignIn = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      const code = (e as { code?: string })?.code ?? "";
      setError(
        code === "auth/popup-closed-by-user"
          ? "Sign-in was cancelled."
          : code === "auth/unauthorized-domain"
            ? "This domain isn't authorised in Firebase Auth."
            : e instanceof Error
              ? e.message
              : "Sign-in failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <Shell>
        <p className="text-sm text-faint">Checking session…</p>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <div className="w-full max-w-sm rounded-2xl border border-line bg-white/[0.02] p-8 text-center">
          <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-accent/15">
            <Lock className="h-5 w-5 text-accent" />
          </div>
          <h1 className="mb-1.5 text-xl font-semibold tracking-tight">Admin</h1>
          <p className="mb-7 text-sm text-muted">
            Sign in to see traffic, sources and enquiries.
          </p>
          {/* Google's own button spec: white surface, #747775 border,
              #1f1f1f label, logo untouched. */}
          <button
            type="button"
            onClick={onSignIn}
            disabled={busy}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-[#747775] bg-white px-6 py-3 text-sm font-medium text-[#1f1f1f] transition-colors hover:bg-[#f2f2f2] disabled:opacity-60"
          >
            <GoogleIcon className="h-[18px] w-[18px]" />
            {busy ? "Opening Google…" : "Continue with Google"}
          </button>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>
      </Shell>
    );
  }

  if (!isAdmin(user)) {
    return (
      <Shell>
        <div className="w-full max-w-sm rounded-2xl border border-red-500/25 bg-red-500/[0.06] p-8 text-center">
          <ShieldAlert className="mx-auto mb-4 h-6 w-6 text-red-400" />
          <h1 className="mb-1.5 text-lg font-semibold">Not authorised</h1>
          <p className="mb-6 text-sm text-muted">
            <span className="text-fg">{user.email}</span> can&apos;t access this portal.
            Only {ADMIN_EMAIL} is permitted.
          </p>
          <button
            type="button"
            onClick={() => signOutAdmin()}
            className="rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:border-accent/60 hover:text-accent"
          >
            Sign out
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-sm font-medium">Admin</span>
            <span className="text-xs text-faint">shehryar-raza.dev</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-faint sm:inline">{user.email}</span>
            <button
              type="button"
              onClick={() => signOutAdmin()}
              aria-label="Sign out"
              className="rounded-full border border-line p-2 text-muted transition-colors hover:border-accent/60 hover:text-accent"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Dashboard />
      </main>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">{children}</div>
  );
}
