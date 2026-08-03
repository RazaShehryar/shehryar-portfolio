"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featured } from "@/lib/projects";
import { Reveal } from "@/components/motion/reveal";
import { Spotlight } from "@/components/motion/spotlight";
import { SectionHeading } from "@/components/section-heading";

/**
 * A compact strip of the headline projects on the landing page.
 *
 * The full scroll showcase lives on /projects; this exists so the home page
 * shows the work rather than ending at the hero, and gives the crawler
 * internal links into the deeper routes.
 */
export function FeaturedTeaser() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36">
      <SectionHeading
        eyebrow="Selected"
        title="In use today"
        lead="Four products with real users on them. One handles other people's money, which focuses the mind."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {featured.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.08}>
            <Link
              href={`/projects#project-${project.slug}`}
              className="block h-full"
              aria-label={`${project.name} — ${project.blurb}`}
            >
              <Spotlight className="h-full overflow-hidden rounded-2xl border border-line bg-white/[0.02]">
                <div
                  className="relative aspect-[16/9] overflow-hidden border-b border-line"
                  style={{
                    background: `radial-gradient(120% 120% at 50% 0%, ${project.accent}30 0%, transparent 70%)`,
                  }}
                >
                  <Image
                    src={project.shots[0].src}
                    alt={project.shots[0].alt}
                    fill
                    sizes="(max-width: 640px) 92vw, 46vw"
                    className={`transition-transform duration-700 hover:scale-[1.03] ${
                      project.shots[0].frame === "phone"
                        ? "object-contain p-6"
                        : "object-cover object-top"
                    }`}
                  />
                  <span className="absolute right-3 top-3 rounded-full border border-emerald-500/30 bg-ink/80 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-emerald-400 backdrop-blur-sm">
                    Live
                  </span>
                </div>

                <div className="p-6">
                  <div className="mb-2 flex items-center gap-3">
                    {project.icon && (
                      <Image
                        src={project.icon}
                        alt=""
                        width={30}
                        height={30}
                        className="rounded-lg border border-white/10"
                      />
                    )}
                    <h3 className="text-xl font-semibold tracking-tight">{project.name}</h3>
                    <span className="ml-auto font-mono text-xs text-faint">{project.year}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{project.blurb}</p>
                </div>
              </Spotlight>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-10 text-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm transition-colors hover:border-accent/60 hover:text-accent"
          >
            See all nineteen projects
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
