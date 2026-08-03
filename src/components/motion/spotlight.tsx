"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from "motion/react";

/**
 * A card that lights up under the cursor.
 *
 * Two layers move together: a soft radial wash inside the card, and a brighter
 * ring painted on the border via a masked overlay. The border highlight is what
 * sells it — a plain background glow alone looks flat.
 */
export function Spotlight({
  children,
  className = "",
  radius = 320,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const opacity = useMotionValue(0);

  const wash = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, rgba(255,122,48,0.14), transparent 72%)`;
  const edge = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, rgba(255,140,70,0.55), transparent 68%)`;

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`group/spot relative ${className}`}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
        opacity.set(1);
      }}
      onPointerLeave={() => opacity.set(0)}
    >
      {/* Border highlight: a gradient clipped to a 1px inset ring. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: edge,
          opacity,
          padding: "1px",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {/* Interior wash. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: wash, opacity }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
