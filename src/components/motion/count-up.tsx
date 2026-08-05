"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Runs before paint in the browser and falls back to `useEffect` on the
 * server, where layout effects do nothing and React warns about them.
 */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Counts a numeric stat up when it first scrolls into view.
 *
 * Takes the display string ("155k+", "7+", "3") and animates only the digits,
 * keeping whatever prefix and suffix were there. That way the data stays in
 * one place and this component doesn't need a parallel set of raw numbers.
 *
 * React renders the real figure and never re-renders: the animation writes to
 * the text node directly. That keeps the server HTML honest — a crawler that
 * runs no JavaScript reads "7+" rather than the "0+" an animated-from-zero
 * initial state would leave behind — and costs no renders on the way up. The
 * digits are blanked to zero in a layout effect, before the browser paints, so
 * a visitor still sees the count start from nothing.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const digitsRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const digits = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const target = Number(digits.replace(/,/g, ""));
  const hasNumber = match !== null && Number.isFinite(target);

  useBeforePaint(() => {
    if (hasNumber && !reduced && digitsRef.current) digitsRef.current.textContent = "0";
  }, [hasNumber, reduced]);

  useEffect(() => {
    const node = digitsRef.current;
    if (!hasNumber || !inView || !node) return;
    if (reduced) {
      node.textContent = target.toLocaleString();
      return;
    }
    const controls = animate(0, target, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = Math.round(v).toLocaleString();
      },
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
      <span ref={digitsRef}>{target.toLocaleString()}</span>
      {suffix}
    </span>
  );
}
