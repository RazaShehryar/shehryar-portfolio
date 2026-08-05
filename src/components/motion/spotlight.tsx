"use client";

import { useRef, type ReactNode } from "react";

/**
 * A card that lights up under the cursor.
 *
 * Two layers move together: a soft radial wash inside the card, and a brighter
 * ring painted on the border via a masked overlay. The border highlight is what
 * sells it — a plain background glow alone looks flat.
 *
 * The pointer position is published as two custom properties and both gradients
 * are declared in CSS against them, so tracking the cursor costs two style
 * writes and no React render.
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

  return (
    <div
      ref={ref}
      className={`spotlight group/spot relative ${className}`}
      style={{ ["--spot-r" as string]: `${radius}px` }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        const r = el?.getBoundingClientRect();
        if (!el || !r) return;
        el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
        el.style.setProperty("--spot-o", "1");
      }}
      onPointerLeave={() => ref.current?.style.setProperty("--spot-o", "0")}
    >
      {/* Border highlight: a gradient clipped to a 1px inset ring. */}
      <span aria-hidden className="spotlight-edge" />
      {/* Interior wash. */}
      <span aria-hidden className="spotlight-wash" />
      <div className="relative">{children}</div>
    </div>
  );
}
