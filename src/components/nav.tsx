"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/timeline", label: "Timeline" },
  { href: "/skills", label: "Skills" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const barRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // One passive listener drives both the backdrop state and the progress
    // bar. The bar is written straight to the element's transform rather than
    // through React, so scrolling never triggers a render.
    let queued = 0;
    const onScroll = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        setScrolled(window.scrollY > 24);
        const bar = barRef.current;
        if (!bar) return;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        bar.style.transform = `scaleX(${progress})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (queued) cancelAnimationFrame(queued);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /**
   * Slides the active pill onto the current tab.
   *
   * Measuring the link and moving one absolutely positioned element gives the
   * same glide a layout animation would, for a transform transition and no
   * library. Width and position are set together so the pill stretches as it
   * travels rather than resizing on arrival.
   */
  const placed = useRef(false);
  const movePill = useCallback(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;
    const active = list.querySelector<HTMLElement>("[data-active='true']");
    if (!active) {
      pill.style.opacity = "0";
      placed.current = false;
      return;
    }
    // The first placement jumps. Only movement between tabs should glide —
    // otherwise the pill visibly slides in from the left on every page load.
    if (!placed.current) {
      pill.style.transition = "none";
      requestAnimationFrame(() => {
        pill.style.transition = "";
      });
      placed.current = true;
    }
    pill.style.opacity = "1";
    pill.style.width = `${active.offsetWidth}px`;
    pill.style.transform = `translateX(${active.offsetLeft}px)`;
  }, []);

  // Before paint, so the pill is never seen at the previous tab's position.
  useLayoutEffect(movePill, [pathname, movePill]);

  useEffect(() => {
    window.addEventListener("resize", movePill);
    return () => window.removeEventListener("resize", movePill);
  }, [movePill]);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-line/70 bg-ink/70 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div
        ref={barRef}
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
      />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2 text-sm font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
          Shehryar Raza
        </Link>

        <div ref={listRef} className="relative hidden items-center gap-1 md:flex">
          <span
            ref={pillRef}
            aria-hidden
            className="absolute left-0 top-1/2 -z-10 h-[calc(100%-0.25rem)] -translate-y-1/2 rounded-full bg-white/[0.07] transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ opacity: 0 }}
          />
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                data-active={active}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-full border border-line p-2 md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-ink/95 px-6 py-3 backdrop-blur-xl md:hidden">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`block py-2.5 text-sm transition-colors ${
                  active ? "text-accent" : "text-muted hover:text-fg"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
