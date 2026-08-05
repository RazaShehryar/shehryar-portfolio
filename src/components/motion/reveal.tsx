import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Stagger position when several reveals sit in the same block. */
  delay?: number;
  /** Distance in pixels the content travels on the way in. */
  y?: number;
  className?: string;
};

/**
 * Fades and lifts content the first time it enters the viewport.
 *
 * No `"use client"`, no hooks, no library: the transition lives in `globals.css`
 * and `RevealObserver` — one observer for the whole document — adds the class
 * that runs it. Reduced motion is handled in CSS, so this renders the same
 * markup either way.
 */
export function Reveal({ children, delay = 0, y = 28, className }: Props) {
  // Custom properties aren't in React's CSSProperties, so this is built as a
  // plain record and handed over on the way out.
  const vars: Record<string, string> = {};
  if (delay) vars["--reveal-delay"] = `${delay}s`;
  if (y !== 28) vars["--reveal-y"] = `${y}px`;

  return (
    <div data-reveal="" className={className} style={vars as CSSProperties}>
      {children}
    </div>
  );
}

/** Splits a line into words that rise in sequence, like a title card. */
export function RevealWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <span data-reveal-group="" className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span
            data-reveal-item=""
            style={{ ["--reveal-delay" as string]: `${delay + i * 0.045}s` }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
