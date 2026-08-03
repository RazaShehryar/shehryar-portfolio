import { featured } from "@/lib/projects";
import { ProjectShowcase } from "@/components/project-showcase";
import { SectionHeading } from "@/components/section-heading";

export function Projects() {
  return (
    <section id="projects" className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-28 sm:pt-36">
        <SectionHeading
          eyebrow="Projects"
          title="Products that shipped"
          lead="Four that are live right now, from a wallet used across Saudi Arabia to a marketplace in Ghana. Scroll through each one — the screens move as you read."
        />
      </div>

      {featured.map((project, i) => (
        <ProjectShowcase key={project.slug} project={project} index={i} />
      ))}
    </section>
  );
}
