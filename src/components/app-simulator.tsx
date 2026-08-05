"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { Apple, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import type { AppPreview } from "@/lib/projects";

type Props = {
  preview: AppPreview;
  name: string;
  open: boolean;
  onClose: () => void;
};

/**
 * "Preview on simulator" modal.
 *
 * Two modes, one shell. `device` puts the app screens inside an interactive
 * iPhone frame — tap the sides, drag, use arrow keys, or let it advance on its
 * own — so it reads as the running app. `gallery` lays the screens out flat,
 * the way the App Store shows them, for apps whose only artwork is marketing
 * compositions. Both always offer the real store links, because an embedded
 * preview is a look, not a substitute for installing the thing.
 */
export function AppSimulator({ preview, name, open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  // createPortal needs document.body, which only exists after hydration; this
  // one-shot flag is the standard client-mount guard (same as site-preview).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Lock the page behind the modal and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-ink/85 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${name} app preview`}
            className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#0f0f15] shadow-[0_50px_140px_-30px_rgba(0,0,0,0.9)]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="text-sm font-medium">{name}</span>
                <span className="hidden text-xs text-faint sm:inline">
                  {preview.mode === "device" ? "Interactive preview" : "App Store preview"}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {preview.mode === "device" ? (
                <DeviceStage preview={preview} name={name} />
              ) : (
                <GalleryStage preview={preview} name={name} />
              )}
            </div>

            <StoreFooter preview={preview} name={name} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Interactive iPhone frame stepping through the app screens. */
function DeviceStage({ preview, name }: { preview: AppPreview; name: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  // Direction feeds the slide animation so back and forward read differently.
  const [dir, setDir] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = preview.screens.length;

  const go = useCallback(
    (next: number, d: number) => {
      setDir(d);
      setI((next + count) % count);
    },
    [count],
  );
  const next = useCallback(() => go(i + 1, 1), [go, i]);
  const prev = useCallback(() => go(i - 1, -1), [go, i]);

  // Arrow-key navigation while the modal is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Gentle auto-advance, unless paused (hover) or the visitor prefers less
  // motion. Restarts whenever the index changes so a manual tap resets it.
  useEffect(() => {
    if (reduced || paused || count < 2) return;
    const t = setTimeout(next, 3200);
    return () => clearTimeout(t);
  }, [reduced, paused, count, next, i]);

  // Swipe detection on a static wrapper. Using onPanEnd (not `drag`) means the
  // image itself never gets a competing transform, which is what left the
  // slide stuck off-centre before.
  const onPanEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60) prev();
  };

  return (
    <div
      className="flex flex-col items-center gap-4 px-4 py-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center gap-3 sm:gap-5">
        <ArrowButton side="left" onClick={prev} label="Previous screen" />

        {/* iPhone frame. Percentages keep the bezel and island in proportion. */}
        <div className="relative w-[min(74vw,236px)] shrink-0 rounded-[13%] border border-white/15 bg-[#050507] p-[2.6%] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)]">
          <motion.div
            className="relative aspect-[9/19.5] touch-pan-y overflow-hidden rounded-[11%] bg-black"
            onPanEnd={reduced ? undefined : onPanEnd}
          >
            <div className="pointer-events-none absolute left-1/2 top-[1.3%] z-20 w-[26%] -translate-x-1/2 rounded-full bg-black [aspect-ratio:7/2]" />
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={i}
                custom={dir}
                className="absolute inset-0"
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? "100%" : "-100%" }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? "-100%" : "100%" }}
                transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              >
                <Image
                  src={preview.screens[i].src}
                  alt={preview.screens[i].alt}
                  fill
                  sizes="236px"
                  // Slight scale pushes the cropped edges under the bezel.
                  className="scale-[1.02] select-none object-cover"
                  draggable={false}
                  priority={i === 0}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <ArrowButton side="right" onClick={next} label="Next screen" />
      </div>

      {/* Caption + dots */}
      <p className="min-h-[1.25rem] max-w-xs text-center text-xs text-muted">
        {preview.screens[i].alt.replace(/^[^—]+—\s*/, "")}
      </p>
      <div className="flex items-center gap-1.5" role="tablist" aria-label={`${name} screens`}>
        {preview.screens.map((s, idx) => (
          <button
            key={s.src}
            type="button"
            role="tab"
            aria-selected={idx === i}
            aria-label={`Screen ${idx + 1}`}
            onClick={() => go(idx, idx > i ? 1 : -1)}
            className={`h-1.5 rounded-full transition-all ${
              idx === i ? "w-5 bg-accent" : "w-1.5 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** Flat, horizontally scrolling App Store-style gallery. */
function GalleryStage({ preview, name }: { preview: AppPreview; name: string }) {
  return (
    <div className="px-4 py-6">
      {preview.note && (
        <p className="mb-4 text-center text-xs text-faint">{preview.note}</p>
      )}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
        {preview.screens.map((s, idx) => (
          <div
            key={s.src}
            className="relative aspect-[9/19.5] w-[min(60vw,220px)] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-black"
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="220px"
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-faint sm:hidden">Swipe to see more of {name}.</p>
    </div>
  );
}

function StoreFooter({ preview, name }: { preview: AppPreview; name: string }) {
  if (!preview.appStore && !preview.googlePlay) return null;
  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-center gap-3 border-t border-white/10 bg-white/[0.02] px-4 py-3">
      {preview.appStore && (
        <a
          href={preview.appStore}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
        >
          <Apple className="h-4 w-4" />
          App Store
        </a>
      )}
      {preview.googlePlay && (
        <a
          href={preview.googlePlay}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-2 text-sm transition-colors hover:border-accent/60 hover:text-accent"
        >
          <Play className="h-3.5 w-3.5" />
          Google Play
        </a>
      )}
      <span className="sr-only">Store links for {name}</span>
    </footer>
  );
}

function ArrowButton({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.03] text-muted transition-colors hover:border-accent/60 hover:text-accent"
    >
      {side === "left" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );
}
