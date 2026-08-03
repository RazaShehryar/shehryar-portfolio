import { featured } from "@/lib/projects";
import { ProjectShowcase } from "@/components/project-showcase";
import { SectionHeading } from "@/components/section-heading";

export function Projects() {
  return (
    <section id="projects" className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-28 sm:pt-36">
        <SectionHeading
          eyebrow="Projects"
          title="Things that shipped"
          lead="Four of these are in use right now. Keep scrolling and the screens move with you."
        />
      </div>

      {featured.map((project, i) => (
        <ProjectShowcase key={project.slug} project={project} index={i} />
      ))}
    </section>
  );
}
