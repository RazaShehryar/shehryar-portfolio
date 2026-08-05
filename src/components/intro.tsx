"use client";

import { useEffect, useState } from "react";

const SEEN_KEY = "intro-seen";

/**
 * A short curtain on first paint: the name resolves, then the panel splits and
 * lifts away to reveal the hero.
 *
 * It plays once per browser session. The layout that renders it remounts on
 * every full page load, so without the session flag someone arriving on /work
 * from a search result would sit through the whole thing again, and so would
 * anyone who refreshed.
 *
 * The split is two CSS animations rather than an animation library, and the
 * element leaves the DOM on animation end rather than on a timer, so the two
 * can never disagree. `data-curtain` is what the `<noscript>` rule in the root
 * layout targets — this is server-rendered covering the page, so without
 * JavaScript it would otherwise stay up for good.
 */
export function Intro() {
  const [phase, setPhase] = useState<"idle" | "showing" | "leaving" | "done">("idle");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode or storage disabled — treat it as a first visit */
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setPhase("done");
      return;
    }

    setPhase("showing");
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => setPhase("leaving"), 600);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase === "done") document.body.style.overflow = "";
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      data-curtain=""
      className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center"
      onAnimationEnd={() => setPhase("done")}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1/2 bg-ink-soft ${
          phase === "leaving" ? "curtain-up" : ""
        }`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 h-1/2 bg-ink-soft ${
          phase === "leaving" ? "curtain-down" : ""
        }`}
      />
      <div
        className={`relative flex items-center gap-3 text-sm tracking-[0.3em] text-muted transition-opacity duration-300 ${
          phase === "leaving" ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="curtain-pulse h-1.5 w-1.5 rounded-full bg-accent" />
        SHEHRYAR RAZA
      </div>
    </div>
  );
}
