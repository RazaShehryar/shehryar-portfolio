import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/work", label: "Work" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

/**
 * Lives at the app root rather than inside `(site)`, so it also catches bad
 * URLs outside the public route group. That means no shared nav to inherit —
 * the links below stand in for it.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[45vh] w-[70vw] -translate-x-1/2 rounded-full bg-accent/8 blur-[150px]"
      />

      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">404</p>

      <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
        Nothing here
      </h1>

      <p className="mt-5 max-w-md leading-relaxed text-muted">
        That link points at a page that doesn&apos;t exist, or stopped existing.
        The rest of the site is still where you left it.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent-soft"
        >
          Back home
        </Link>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full border border-line px-6 py-3 text-sm text-muted transition-colors hover:border-white/25 hover:text-fg"
          >
            {l.label}
          </Link>
        ))}
      </div>

      <p className="mt-12 text-sm text-faint">
        Sure it should be here?{" "}
        <a href={`mailto:${site.email}`} className="text-muted underline underline-offset-4 hover:text-fg">
          Tell me
        </a>
        .
      </p>
    </div>
  );
}
