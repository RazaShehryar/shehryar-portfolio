"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * A short curtain on first paint: the name resolves, then the panel splits and
 * lifts away to reveal the hero. Deliberately under a second — long enough to
 * feel deliberate, short enough that it never becomes a toll booth.
 */
const SEEN_KEY = "intro-seen";

export function Intro() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The layout that renders this remounts on every full page load, so
    // without a session flag someone arriving on /work from a search result
    // would sit through the curtain again, and so would anyone who refreshed.
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode or storage disabled — treat it as a first visit */
    }

    if (reduced || seen) {
      setDone(true);
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setDone(true), 600);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          // Server-rendered before the effect above can dismiss it, so without
          // JavaScript this curtain would stay up for good. The `<noscript>`
          // rule in the root layout hides it.
          data-curtain=""
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink-soft"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-soft"
            exit={{ y: "100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />

          <motion.div
            className="relative flex items-center gap-3 text-sm tracking-[0.3em] text-muted"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              animate={{ scale: [1, 1.9, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            />
            SHEHRYAR RAZA
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
