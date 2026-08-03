"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Counts a numeric stat up when it first scrolls into view.
 *
 * Takes the display string ("2,000+", "7+", "3") and animates only the digits,
 * keeping whatever prefix and suffix were there. That way the data stays in
 * one place and this component doesn't need a parallel set of raw numbers.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const digits = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const target = Number(digits.replace(/,/g, ""));
  const hasNumber = match !== null && Number.isFinite(target);

  const [shown, setShown] = useState(hasNumber ? 0 : null);

  useEffect(() => {
    if (!hasNumber || !inView) return;
    if (reduced) {
      setShown(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, hasNumber, target, reduced]);

  if (!hasNumber) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {(shown ?? 0).toLocaleString()}
      {suffix}
    </span>
  );
}
