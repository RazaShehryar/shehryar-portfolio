"use client";

import { useRef, type ReactNode } from "react";

/**
 * Pulls its child toward the cursor while the pointer is nearby, then eases
 * back on exit. The displacement is a fraction of the distance from centre so
 * it reads as attraction rather than as the button running away.
 *
 * The transform is written straight to the node. Following a cursor through
 * React state would re-render on every pointer event, and a spring library is
 * a lot of bytes for what a transition does adequately: a short duration while
 * tracking keeps it responsive, a longer one on release gives it the settle.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}
      onPointerMove={(e) => {
        // Coarse pointers have no hover, and on touch this would fire once on
        // tap and leave the element offset.
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transition = "transform 0.12s linear";
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }}
      onPointerLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.transition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.transform = "";
      }}
    >
      {children}
    </div>
  );
}
