import { skillGroups } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";
import { Spotlight } from "@/components/motion/spotlight";
import { SectionHeading } from "@/components/section-heading";

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36">
      <SectionHeading
        eyebrow="Toolkit"
        title="What I reach for"
        lead="Deep in the React and Node ecosystem, and increasingly in the tooling around coding agents."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.07}>
            <Spotlight className="h-full rounded-2xl border border-line bg-white/[0.02]">
              <div className="h-full p-6">
                <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-accent">
                  {group.title}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted transition-colors hover:text-fg"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
