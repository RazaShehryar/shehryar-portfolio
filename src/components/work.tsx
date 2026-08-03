"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { education, experience } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 55%"],
  });
  // The rail fills as you read down the list.
  const fill = useSpring(scrollYProgress, { stiffness: 100, damping: 28 });

  return (
    <section id="work" className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36">
      <SectionHeading
        eyebrow="Work"
        title="Where I've worked"
        lead="No company names here, on purpose. The work is the part that matters anyway."
      />

      <div ref={ref} className="relative">
        {/* Vertical rail */}
        <div className="absolute left-0 top-2 hidden h-full w-px bg-line md:block">
          <motion.div
            className="h-full w-full origin-top bg-gradient-to-b from-accent to-accent/10"
            style={{ scaleY: fill }}
          />
        </div>

        <div className="space-y-14 md:space-y-20 md:pl-12">
          {experience.map((role, i) => (
            <Reveal key={`${role.period}-${role.title}`} delay={i * 0.04}>
              <article className="relative">
                <span
                  aria-hidden
                  className="absolute -left-12 top-2 hidden h-2 w-2 -translate-x-1/2 rounded-full bg-accent ring-4 ring-ink md:block"
                />

                <div className="mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-xs text-accent">{role.period}</span>
                  <span className="text-xs text-faint">{role.kind}</span>
                </div>

                <h3 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {role.title}
                </h3>

                <p className="mb-5 max-w-2xl leading-relaxed text-muted">{role.summary}</p>

                <ul className="mb-5 max-w-2xl space-y-2.5">
                  {role.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span
                        aria-hidden
                        className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-accent/70"
                      />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5">
                  {role.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-xs text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal>
            <article className="relative border-t border-line pt-10">
              <span
                aria-hidden
                className="absolute -left-12 top-[2.85rem] hidden h-2 w-2 -translate-x-1/2 rounded-full bg-line ring-4 ring-ink md:block"
              />
              <div className="mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-xs text-faint">{education.period}</span>
                <span className="text-xs text-faint">Education</span>
              </div>
              <h3 className="mb-1 text-xl font-semibold tracking-tight">{education.degree}</h3>
              <p className="mb-4 text-sm text-muted">{education.school}</p>
              <div className="flex flex-wrap gap-1.5">
                {education.research.map((r) => (
                  <span
                    key={r}
                    className="rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-xs text-muted"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
