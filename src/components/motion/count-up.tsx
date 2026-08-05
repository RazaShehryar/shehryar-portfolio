"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Runs before paint in the browser and falls back to `useEffect` on the
 * server, where layout effects do nothing and React warns about them.
 */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** The library's default reveal curve, so this matches everything around it. */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts a numeric stat up when it first scrolls into view.
 *
 * Takes the display string ("155k+", "7+", "3") and animates only the digits,
 * keeping whatever prefix and suffix were there. That way the data stays in
 * one place and this component doesn't need a parallel set of raw numbers.
 *
 * React renders the real figure and never re-renders: the tween writes to the
 * text node directly. That keeps the server HTML honest — a crawler that runs
 * no JavaScript reads "7+" rather than the "0+" an animated-from-zero initial
 * state would leave behind — and costs no renders on the way up. The digits are
 * blanked to zero in a layout effect, before the browser paints, so a visitor
 * still sees the count start from nothing.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const digitsRef = useRef<HTMLSpanElement>(null);

  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const digits = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const target = Number(digits.replace(/,/g, ""));
  const hasNumber = match !== null && Number.isFinite(target);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useBeforePaint(() => {
    if (hasNumber && !reduced && digitsRef.current) digitsRef.current.textContent = "0";
  }, [hasNumber, reduced]);

  useEffect(() => {
    const host = ref.current;
    const node = digitsRef.current;
    if (!hasNumber || !host || !node || reduced) return;

    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      start ||= now;
      const t = Math.min(1, (now - start) / 1500);
      node.textContent = Math.round(easeOutExpo(t) * target).toLocaleString();
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    io.observe(host);
    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [hasNumber, target, reduced]);

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
