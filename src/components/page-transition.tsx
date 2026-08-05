"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades and lifts each route as it arrives.
 *
 * Keyed on the pathname so React remounts the subtree on navigation, which
 * also resets every scroll-linked animation inside it — without that, a
 * showcase entered mid-scroll would keep the previous page's progress.
 *
 * The fade itself is a CSS animation that runs once on mount, so there is no
 * animation library and no persistent subscription behind it. The `page-in`
 * class carries `both` fill, which means the opening frame is the element's
 * server-rendered state and nothing flashes.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Next preserves scroll position across navigations by default; for a set
  // of sibling pages each should open at the top.
  useEffect(() => {
    // A hash target owns the scroll position, so only reset when there isn't one.
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div key={pathname} className="page-in">
      {children}
    </div>
  );
}
