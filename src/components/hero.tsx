"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowDown, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { site, stats } from "@/lib/site";
import { RevealWords, Reveal } from "@/components/motion/reveal";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The hero sinks and dims as the next section climbs over it.
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden pt-28"
    >
      {/* Layered ambience: one warm bloom, one cool counterweight. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 -z-10 h-[60vh] w-[60vw] rounded-full bg-accent/12 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-[45vh] w-[45vw] rounded-full bg-indigo-500/10 blur-[140px]"
      />

      <motion.div
        className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-14 px-6 py-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20"
        style={reduced ? undefined : { y, opacity }}
      >
        <div>
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-xs text-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Available for select work
            </span>
          </Reveal>

          <h1 className="mb-6 text-[clamp(2.6rem,7.5vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
            <RevealWords text="Shehryar Raza" />
            <span className="mt-2 block text-[clamp(1.4rem,3.2vw,2.4rem)] font-normal tracking-tight text-muted">
              <RevealWords text={site.role} delay={0.18} />
            </span>
          </h1>

          <Reveal delay={0.32}>
            <p className="mb-4 max-w-2xl text-lg leading-relaxed text-fg/85 sm:text-xl">
              {site.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <p className="mb-9 max-w-xl leading-relaxed text-muted">{site.intro}</p>
          </Reveal>

          <Reveal delay={0.48}>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03] hover:bg-accent-soft"
              >
                See the work
              </a>
              <a
                href="#contact"
                className="rounded-full border border-line px-6 py-3 text-sm transition-colors hover:border-accent/60 hover:text-accent"
              >
                Get in touch
              </a>
              <div className="ml-1 flex items-center gap-1">
                <IconLink href={site.github} label="GitHub">
                  <GithubIcon className="h-4 w-4" />
                </IconLink>
                <IconLink href={site.linkedin} label="LinkedIn">
                  <LinkedinIcon className="h-4 w-4" />
                </IconLink>
                <IconLink href={`mailto:${site.email}`} label="Email">
                  <Mail className="h-4 w-4" />
                </IconLink>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Portrait */}
        <motion.div
          className="relative mx-auto w-56 sm:w-72 lg:w-full lg:max-w-sm"
          style={reduced ? undefined : { y: portraitY, scale }}
        >
          <Reveal y={40} delay={0.2}>
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-5 rounded-full bg-gradient-to-tr from-accent/25 via-transparent to-indigo-500/20 blur-2xl"
              />
              <div className="relative aspect-square overflow-hidden rounded-full border border-white/10">
                <Image
                  src="/profile.webp"
                  alt={`${site.name}, ${site.role}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 18rem, 24rem"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </motion.div>
      </motion.div>

      {/* Stats strip — sits in flow so it always lands on the fold. */}
      <div className="border-t border-line/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-line/60 px-6 sm:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.1 * i}>
              <div className="px-2 py-5 sm:px-5">
                <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-0.5 text-xs text-faint">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <motion.a
        href="#work"
        aria-label="Scroll to work"
        className="pointer-events-auto absolute bottom-[7.5rem] left-1/2 hidden -translate-x-1/2 text-faint transition-colors hover:text-accent lg:block"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="h-4 w-4" />
      </motion.a>
    </section>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="rounded-full p-2.5 text-muted transition-colors hover:bg-white/[0.05] hover:text-accent"
    >
      {children}
    </a>
  );
}
