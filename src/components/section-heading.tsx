import { Reveal } from "@/components/motion/reveal";
import { RevealChars } from "@/components/motion/text";

export function SectionHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mb-14 max-w-2xl">
      <Reveal>
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <span className="text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</span>
        </div>
      </Reveal>
      <h2 className="preserve-3d text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.02em] [perspective:700px]">
        <RevealChars text={title} stagger={0.022} />
      </h2>
      {lead && (
        <Reveal delay={0.16}>
          <p className="mt-5 leading-relaxed text-muted">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
