"use client";

import { useMemo, useState } from "react";
import { TAGS, featured, moreWork, type Tag } from "@/lib/projects";
import { ProjectShowcase } from "@/components/project-showcase";
import { MoreWork } from "@/components/more-work";
import { SectionHeading } from "@/components/section-heading";
import { trackEvent } from "@/lib/track-event";

/**
 * Filters both halves of the projects page from one control.
 *
 * Nineteen projects in a fixed order means someone hiring for React Native
 * reads all nineteen to find the eleven that matter to them. The chips narrow
 * the scroll showcase and the grid together, so the page always answers one
 * question at a time.
 *
 * Filtering is multi-select and additive (Mobile + Fintech shows anything that
 * is either), because a visitor clicking two chips is widening what they will
 * accept, not demanding both at once.
 */
export function ProjectFilter() {
  const [active, setActive] = useState<Tag[]>([]);

  const matches = useMemo(() => {
    if (!active.length) return { shown: featured, cards: moreWork };
    const hit = (tags: Tag[]) => tags.some((t) => active.includes(t));
    return {
      shown: featured.filter((p) => hit(p.tags)),
      cards: moreWork.filter((c) => hit(c.tags)),
    };
  }, [active]);

  const total = matches.shown.length + matches.cards.length;

  const toggle = (tag: Tag) => {
    setActive((prev) => {
      const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      // One event per filter used, so the analytics show which kind of work
      // people actually come looking for.
      if (!prev.includes(tag)) trackEvent(`filter_${tag.toLowerCase().replace(/[^a-z]/g, "_")}`);
      return next;
    });
  };

  // Counts sit on the chips so a visitor knows what a filter is worth before
  // spending a click on it.
  const counts = useMemo(() => {
    const map = {} as Record<Tag, number>;
    for (const tag of TAGS) {
      map[tag] =
        featured.filter((p) => p.tags.includes(tag)).length +
        moreWork.filter((c) => c.tags.includes(tag)).length;
    }
    return map;
  }, []);

  return (
    <>
      <section id="projects" className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-28 sm:pt-36">
          <SectionHeading
            eyebrow="Projects"
            title="Things that shipped"
            lead="Nineteen of them, going back to 2020. Four are in use right now, and those get the full treatment — keep scrolling and the screens move with you."
          />

          <div className="mb-16 flex flex-wrap items-center gap-2">
            <Chip
              label="Everything"
              count={featured.length + moreWork.length}
              active={active.length === 0}
              onClick={() => setActive([])}
            />
            {TAGS.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                count={counts[tag]}
                active={active.includes(tag)}
                onClick={() => toggle(tag)}
              />
            ))}

            <p aria-live="polite" className="ml-1 text-sm text-faint">
              {active.length === 0
                ? null
                : `${total} ${total === 1 ? "project" : "projects"}`}
            </p>
          </div>
        </div>

        {matches.shown.map((project, i) => (
          <ProjectShowcase key={project.slug} project={project} index={i} />
        ))}

        {matches.shown.length === 0 && matches.cards.length > 0 && (
          <p className="mx-auto max-w-7xl px-6 pb-4 text-sm text-faint">
            Nothing featured under that filter. The matches are in the grid below.
          </p>
        )}
      </section>

      <MoreWork cards={matches.cards} filtered={active.length > 0} />
    </>
  );
}

function Chip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
        active
          ? "border-accent/60 bg-accent/15 text-accent"
          : "border-line bg-white/[0.02] text-muted hover:border-white/25 hover:text-fg"
      }`}
    >
      {label}
      <span className={`font-mono text-[0.7rem] ${active ? "text-accent/70" : "text-faint"}`}>
        {count}
      </span>
    </button>
  );
}
