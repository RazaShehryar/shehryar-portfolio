"use client";

import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";

/**
 * A slow-drifting field of blurred colour behind the whole page.
 *
 * Three blobs orbit on independent loops while scroll progress pulls the
 * palette from warm (hero) through blue and violet (the project sections)
 * and back to warm at the contact form. Because it is fixed and blurred to
 * 160px, it reads as ambient light rather than as shapes.
 */
export function Aurora() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 30, restDelta: 0.001 });

  // A narrow sweep on purpose: rotating far enough to hit green turned whole
  // sections sickly, so this stays between warm amber and violet.
  const hueShift = useTransform(p, [0, 0.35, 0.7, 1], [0, -35, -70, -20]);
  const filter = useTransform(hueShift, (h) => `blur(160px) hue-rotate(${h}deg)`);
  const drift = useTransform(p, [0, 1], [0, -180]);

  if (reduced) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute left-[10%] top-[12%] h-[46vh] w-[46vw] rounded-full bg-accent/12 blur-[160px]" />
        <div className="absolute right-[8%] top-[45%] h-[42vh] w-[40vw] rounded-full bg-indigo-500/10 blur-[160px]" />
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      style={{ filter, y: drift }}
    >
      <motion.div
        className="absolute left-[6%] top-[8%] h-[48vh] w-[48vw] rounded-full bg-accent/20"
        animate={{ x: [0, 90, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.14, 0.94, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[4%] top-[38%] h-[44vh] w-[42vw] rounded-full bg-indigo-500/18"
        animate={{ x: [0, -80, 50, 0], y: [0, 70, -30, 0], scale: [1, 0.9, 1.16, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div
        className="absolute left-[32%] bottom-[6%] h-[40vh] w-[40vw] rounded-full bg-fuchsia-500/12"
        animate={{ x: [0, 60, -70, 0], y: [0, -50, 30, 0], scale: [1, 1.1, 0.92, 1] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </motion.div>
  );
}
