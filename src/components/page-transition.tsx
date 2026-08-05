"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";

/**
 * Fades and lifts each route as it arrives.
 *
 * Keyed on the pathname so React remounts the subtree on navigation, which
 * also resets every scroll-linked animation inside it — without that, a
 * showcase entered mid-scroll would keep the previous page's progress.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // Next preserves scroll position across navigations by default; for a set
  // of sibling pages each should open at the top.
  useEffect(() => {
    // A hash target owns the scroll position, so only reset when there isn't one.
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      data-reveal=""
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
