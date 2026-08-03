"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/**
 * Characters rise out of a clipping mask one after another, each tipped
 * slightly forward in 3D so the line unfolds instead of merely sliding.
 * Words stay intact as inline-blocks so wrapping still works.
 */
export function RevealChars({
  text,
  className,
  delay = 0,
  stagger = 0.028,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) return <span className={className}>{text}</span>;

  return (
    // The in-view trigger lives here, on the unclipped wrapper. Watching the
    // characters themselves would deadlock: they start fully outside their
    // overflow-hidden parent, and IntersectionObserver subtracts ancestor
    // clipping, so their visible area is zero and the reveal never fires.
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, w) => (
        <span key={`${word}-${w}`} className="inline-block whitespace-nowrap" aria-hidden>
          {[...word].map((char, c) => (
            <span key={`${char}-${c}`} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block will-change-transform"
                variants={{
                  hidden: { y: "115%", rotateX: -55, opacity: 0 },
                  visible: {
                    y: "0%",
                    rotateX: 0,
                    opacity: 1,
                    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                {char}
              </motion.span>
            </span>
          ))}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}

/**
 * A paragraph that brightens word by word as it travels up the viewport,
 * so reading pace and scroll pace line up.
 */
export function ScrollLitText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = text.split(" ");

  if (reduced) return <p className={className}>{text}</p>;

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={`${word}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  // Each word owns a slice of the scroll range, with a little overlap so the
  // brightening sweeps rather than steps.
  const opacity = useTransform(progress, [range[0] - 0.08, range[1]], [0.18, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
      &nbsp;
    </motion.span>
  );
}
