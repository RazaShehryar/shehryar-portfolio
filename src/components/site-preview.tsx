"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, Loader2, Monitor, Smartphone, X } from "lucide-react";

type Props = {
  url: string;
  name: string;
  open: boolean;
  onClose: () => void;
};

/**
 * Opens a live site inside a browser-chrome modal so visitors can actually
 * click around the product without leaving the portfolio.
 *
 * Both embedded sites were checked for `X-Frame-Options` and CSP
 * `frame-ancestors`; neither sets them, so framing is permitted. Any site that
 * does block it would render blank, which is why the "open in a new tab"
 * escape hatch is always present rather than a fallback.
 */
export function SitePreview({ url, name, open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => setMounted(true), []);

  // Lock the page behind the modal and wire up Escape.
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

  // Every reopen should start from the site's own landing page.
  useEffect(() => {
    if (open) setLoading(true);
  }, [open, device]);

  if (!mounted) return null;

  const host = (() => {
    try {
      return new URL(url).host;
    } catch {
      return url;
    }
  })();

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
            aria-label={`Live preview of ${name}`}
            className="relative flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-white/12 bg-[#0f0f15] shadow-[0_50px_140px_-30px_rgba(0,0,0,0.9)] sm:rounded-2xl"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Browser chrome */}
            <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-white/[0.04] px-3 py-2.5 sm:px-4">
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close preview"
                  className="h-3 w-3 rounded-full bg-[#ff5f57] transition-transform hover:scale-110"
                />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-black/40 px-3 py-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="truncate text-xs text-muted">{host}</span>
                {loading && (
                  <Loader2 className="ml-auto h-3 w-3 shrink-0 animate-spin text-faint" />
                )}
              </div>

              {/* Viewport toggle */}
              <div className="hidden items-center gap-0.5 rounded-full border border-line p-0.5 md:flex">
                <ToggleButton
                  active={device === "desktop"}
                  onClick={() => setDevice("desktop")}
                  label="Desktop view"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </ToggleButton>
                <ToggleButton
                  active={device === "mobile"}
                  onClick={() => setDevice("mobile")}
                  label="Mobile view"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </ToggleButton>
              </div>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/60 hover:text-accent"
              >
                <span className="hidden sm:inline">Open</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="shrink-0 rounded-full p-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Frame */}
            <div className="relative flex flex-1 justify-center overflow-hidden bg-[#08080b]">
              {loading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#08080b]">
                  <Loader2 className="h-5 w-5 animate-spin text-accent" />
                  <p className="text-sm text-faint">Loading {name}…</p>
                </div>
              )}

              <iframe
                // Remounting on device change gives a clean reload at the new width.
                key={device}
                src={url}
                title={`${name} live preview`}
                onLoad={() => setLoading(false)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                // allow-same-origin scopes to the framed site's own origin, not this
                // one. The storage-access token lets it keep its own session cookies
                // after a click, which sign-in flows need to work at all in a frame.
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation"
                className={`h-full border-0 bg-white transition-[width] duration-500 ${
                  device === "mobile" ? "w-full max-w-[420px]" : "w-full"
                }`}
              />
            </div>

            <p className="shrink-0 border-t border-white/10 px-4 py-2 text-center text-[0.7rem] text-faint">
              Live site, embedded. Some flows may behave differently in a frame —
              open it in a tab for the full experience.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`rounded-full p-1.5 transition-colors ${
        active ? "bg-white/[0.1] text-fg" : "text-faint hover:text-muted"
      }`}
    >
      {children}
    </button>
  );
}
