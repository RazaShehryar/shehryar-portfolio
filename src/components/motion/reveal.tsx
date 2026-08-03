"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

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
 * Collapses to a plain fade when the visitor prefers reduced motion.
 */
export function Reveal({ children, delay = 0, y = 28, className }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      // A visibility threshold rather than a negative margin: a negative
      // bottom margin never fires for content sitting on the initial fold.
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: reduced ? 0.2 : 0.85,
        delay: reduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
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
  const reduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: reduced ? 0 : "100%", opacity: reduced ? 0 : 1 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: reduced ? 0.2 : 0.9,
              delay: reduced ? 0 : delay + i * 0.045,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
