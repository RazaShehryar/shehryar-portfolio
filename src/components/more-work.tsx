"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, MousePointerClick } from "lucide-react";
import { moreWork, type WorkCard } from "@/lib/projects";
import { Reveal } from "@/components/motion/reveal";
import { Spotlight } from "@/components/motion/spotlight";
import { PhoneFrame } from "@/components/frames";
import { SitePreview } from "@/components/site-preview";
import { SectionHeading } from "@/components/section-heading";

export function MoreWork() {
  return (
    <section id="more-work" className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36">
      <SectionHeading
        eyebrow="Selected work"
        title="The rest of the shelf"
        lead="Client and product work going back to 2021. Where a project predates any surviving screenshots, its app icon stands in rather than a mockup."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {moreWork.map((card, i) => (
          <Reveal key={card.slug} delay={(i % 3) * 0.07}>
            <Card card={card} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Card({ card }: { card: WorkCard }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <Spotlight className="h-full overflow-hidden rounded-2xl border border-line bg-white/[0.02]">
        <div className="flex h-full flex-col">
          {/* Visual */}
          <div
            className="relative aspect-[16/10] overflow-hidden border-b border-line"
            style={{
              background: `radial-gradient(120% 120% at 50% 0%, ${card.accent}30 0%, transparent 70%)`,
            }}
          >
            {card.image && card.imageShape === "portrait" ? (
              // Portrait art would crop to its blank top edge if it filled the
              // card, so it sits in a phone instead.
              <div className="flex h-full items-end justify-center px-6 pt-5">
                <div className="w-[38%] translate-y-3 transition-transform duration-700 hover:-translate-y-1">
                  <PhoneFrame src={card.image} alt={`${card.name} app screen`} />
                </div>
              </div>
            ) : card.image ? (
              <Image
                src={card.image}
                alt={`${card.name} interface`}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                className="object-cover object-top transition-transform duration-700 hover:scale-[1.04]"
              />
            ) : card.icon ? (
              <div className="flex h-full items-center justify-center">
                <Image
                  src={card.icon}
                  alt={`${card.name} app icon`}
                  width={88}
                  height={88}
                  className="rounded-[22%] border border-white/10 shadow-2xl"
                />
              </div>
            ) : (
              // No surviving asset: a monogram rather than a fake screenshot.
              <div className="flex h-full items-center justify-center">
                <span
                  className="text-5xl font-semibold tracking-tight opacity-60"
                  style={{ color: card.accent }}
                >
                  {card.name.charAt(0)}
                </span>
              </div>
            )}

            {card.status === "live" && (
              <span className="absolute right-3 top-3 rounded-full border border-emerald-500/30 bg-ink/80 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-emerald-400 backdrop-blur-sm">
                Live
              </span>
            )}
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col p-5">
            <div className="mb-1.5 flex items-baseline gap-3">
              <h3 className="font-semibold tracking-tight">{card.name}</h3>
              <span className="font-mono text-[0.7rem] text-faint">{card.year}</span>
            </div>
            <p className="mb-3 text-xs uppercase tracking-[0.12em]" style={{ color: card.accent }}>
              {card.role}
            </p>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">{card.note}</p>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {card.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line bg-white/[0.03] px-2 py-0.5 text-[0.7rem] text-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {card.preview && (
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink transition-transform hover:scale-[1.04]"
                  style={{ background: card.accent }}
                >
                  <MousePointerClick className="h-3 w-3" />
                  Explore
                </button>
              )}
              {card.links?.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/60 hover:text-accent"
                >
                  {l.label}
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Spotlight>

      {card.preview && (
        <SitePreview
          url={card.preview}
          name={card.name}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}
