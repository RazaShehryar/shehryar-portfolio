"use client";

import { useEffect } from "react";

/**
 * Drives every scroll reveal on the page from a single IntersectionObserver.
 *
 * Previously each animated element was its own client component holding its
 * own viewport subscription — 73 of them on the homepage. One observer watching
 * everything costs the same as watching one thing, and it lets `Reveal` and the
 * text primitives go back to being plain server components with no JavaScript
 * shipped for them at all.
 *
 * A MutationObserver picks up nodes that arrive later, which is what makes this
 * work across client navigations and the filtered project grid.
 */
const SELECTOR = "[data-reveal]:not(.is-visible), [data-reveal-group]:not(.is-visible)";

export function RevealObserver() {
  useEffect(() => {
    // Reveals are decorative; with reduced motion the CSS already resolves them
    // to their final state, so there is nothing to observe.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          // Reveals run once. Releasing the target keeps the observer's set
          // small on long pages.
          io.unobserve(entry.target);
        }
      },
      // A visibility threshold rather than a negative margin: a negative bottom
      // margin never fires for content sitting on the initial fold.
      { threshold: 0.2 },
    );

    const scan = () => {
      for (const el of document.querySelectorAll(SELECTOR)) io.observe(el);
    };

    scan();

    // Batched into a frame so a burst of insertions costs one scan, not one per
    // mutation record.
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (queued) cancelAnimationFrame(queued);
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
