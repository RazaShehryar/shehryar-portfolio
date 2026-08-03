"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { timeline, type TimelineEntry } from "@/lib/projects";
import { SectionHeading } from "@/components/section-heading";

export function Timeline() {
  return (
    <section id="timeline" className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36">
      <SectionHeading
        eyebrow="Timeline"
        title="How it went"
        lead="Roughly in order. Some of it shipped, some of it quietly died, all of it taught me something."
      />

      <div className="relative">
        <div
          aria-hidden
          className="absolute left-[7px] top-0 h-full w-px bg-gradient-to-b from-accent/50 via-line to-transparent sm:left-2"
        />
        <div className="space-y-3">
          {timeline.map((entry, i) => (
            <Row key={`${entry.year}-${entry.name}`} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ entry, index }: { entry: TimelineEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 55%"],
  });

  // Each row slides in from the rail as it arrives.
  const x = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 34, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0, 1]);

  return (
    <motion.div ref={ref} style={{ x, opacity }} className="relative pl-8 sm:pl-12">
      <span
        aria-hidden
        className={`absolute left-0 top-[1.35rem] h-3.5 w-3.5 rounded-full border-2 sm:left-[1px] ${
          entry.status === "live"
            ? "border-emerald-400 bg-emerald-400/25"
            : "border-line bg-ink"
        }`}
      />

      <div className="group flex flex-col gap-1.5 rounded-xl border border-transparent px-4 py-4 transition-colors hover:border-line hover:bg-white/[0.02] sm:flex-row sm:items-baseline sm:gap-6">
        <span className="w-12 shrink-0 font-mono text-xs text-accent">{entry.year}</span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-medium tracking-tight">{entry.name}</h3>
            <span className="text-xs text-faint">{entry.kind}</span>
            {entry.status === "live" && (
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-emerald-400">
                Live
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">{entry.note}</p>
        </div>

      </div>

      {index === 0 && <span className="sr-only">Most recent</span>}
    </motion.div>
  );
}
