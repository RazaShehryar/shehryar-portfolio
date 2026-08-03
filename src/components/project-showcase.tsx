"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight, MousePointerClick } from "lucide-react";
import type { Project } from "@/lib/projects";
import { BrowserFrame, PhoneFrame } from "@/components/frames";
import { SitePreview } from "@/components/site-preview";
import { useProjectViews } from "@/lib/use-views";

/**
 * One project, revealed across a tall scroll track.
 *
 * The device art is pinned in a sticky panel and driven entirely by scroll
 * progress: it tilts up out of the page, holds level while the copy is read,
 * then settles back as the section leaves. Screenshots crossfade on the way
 * through, so a single pinned frame shows several states of the product.
 */
export function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  // The same section element drives both the scroll animation and the
  // visibility check that decides whether this project counts as viewed.
  const { views, ref: viewRef } = useProjectViews(project.slug);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smoothing turns the raw scroll position into motion that keeps gliding
  // for a beat after the wheel stops, which is what makes it feel physical.
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.0005,
  });

  const rotateX = useTransform(p, [0, 0.32, 0.7, 1], [20, 0, 0, -10]);
  // A touch of yaw as well as pitch, so the panel turns to face you rather
  // than simply tipping up.
  const rotateY = useTransform(p, [0, 0.32, 0.7, 1], [index % 2 === 0 ? -12 : 12, 0, 0, index % 2 === 0 ? 8 : -8]);
  const scale = useTransform(p, [0, 0.32, 0.7, 1], [0.84, 1, 1, 0.92]);
  const y = useTransform(p, [0, 0.32, 0.7, 1], [90, 0, 0, -70]);
  const artOpacity = useTransform(p, [0, 0.14, 0.86, 1], [0, 1, 1, 0]);
  const glow = useTransform(p, [0, 0.35, 0.7, 1], [0, 0.55, 0.55, 0]);
  // Copy drifts against the art at a slower rate for depth separation.
  const copyY = useTransform(p, [0, 1], [60, -60]);

  const browserShots = project.shots.filter((s) => s.frame === "browser");
  const phoneShots = project.shots.filter((s) => s.frame === "phone");
  const layout = browserShots.length > 0 ? "web" : "phones";

  // useReducedMotion resolves to null before hydration; treat that as "animate".
  const still = reduced === true;

  return (
    <section
      ref={(node) => {
        ref.current = node;
        viewRef.current = node;
      }}
      id={`project-${project.slug}`}
      className="relative"
      // The track is taller than the viewport; that extra height is the
      // scroll budget the animation plays out over.
      style={{ height: still ? "auto" : "260vh" }}
    >
      <div
        className={
          still
            ? "py-20"
            : "sticky top-0 flex min-h-screen items-center overflow-hidden py-20"
        }
      >
        {/* Ambient wash in the project's own colour. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[75vh] w-[75vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
          style={{
            opacity: still ? 0.25 : glow,
            background: `radial-gradient(circle, ${project.accent}55 0%, transparent 68%)`,
          }}
        />

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* ── Copy ───────────────────────────────────────────────── */}
          <motion.div
            className="order-2 lg:order-1"
            style={still ? undefined : { y: copyY }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="font-mono text-xs text-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-8 bg-line" />
              <span className="text-xs uppercase tracking-[0.18em] text-muted">
                {project.year}
              </span>
              {project.status === "live" && <LivePip />}
            </div>

            <div className="mb-4 flex items-center gap-3.5">
              {project.icon && (
                <Image
                  src={project.icon}
                  alt=""
                  width={52}
                  height={52}
                  className="rounded-xl border border-white/10"
                />
              )}
              <h3 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {project.name}
              </h3>
            </div>

            <p className="mb-5 text-lg text-accent-soft">{project.blurb}</p>
            <p className="mb-7 max-w-xl leading-relaxed text-muted">
              {project.description}
            </p>

            <ul className="mb-7 space-y-2.5">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span
                    aria-hidden
                    className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full"
                    style={{ background: project.accent }}
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="mb-7 flex flex-wrap gap-1.5">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line bg-white/[0.03] px-2.5 py-1 text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {project.preview ? (
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
                  style={{ background: project.accent }}
                >
                  <MousePointerClick className="h-3.5 w-3.5" />
                  Explore it here
                </button>
              ) : (
                project.status === "live" &&
                project.links[0] && (
                  // This site sends framing headers that would render an embed
                  // blank, so the primary action opens it properly instead.
                  <a
                    href={project.links[0].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
                    style={{ background: project.accent }}
                  >
                    Visit the live site
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )
              )}
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-4 py-2 text-sm transition-colors hover:border-accent/60 hover:text-accent"
                >
                  {l.label}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
              {views !== null && (
                <span className="text-xs text-faint">
                  {views.toLocaleString()} {views === 1 ? "view" : "views"}
                </span>
              )}
            </div>
          </motion.div>

          {/* ── Device art ─────────────────────────────────────────── */}
          <div
            className={`stage order-1 lg:order-2 ${
              project.preview ? "group/art cursor-pointer" : ""
            }`}
            onClick={project.preview ? () => setPreviewOpen(true) : undefined}
            role={project.preview ? "button" : undefined}
            tabIndex={project.preview ? 0 : undefined}
            aria-label={project.preview ? `Open a live preview of ${project.name}` : undefined}
            onKeyDown={
              project.preview
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPreviewOpen(true);
                    }
                  }
                : undefined
            }
          >
            <motion.div
              className="preserve-3d relative"
              style={
                still
                  ? undefined
                  : {
                      rotateX,
                      rotateY,
                      scale,
                      y,
                      opacity: artOpacity,
                      transformOrigin: "50% 100%",
                    }
              }
            >
              {layout === "web" ? (
                <WebComposition
                  project={project}
                  progress={p}
                  still={still}
                  eager={index === 0}
                />
              ) : (
                <PhoneFan project={project} progress={p} still={still} />
              )}

              {project.preview && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/art:opacity-100">
                  <span className="flex items-center gap-2 rounded-full bg-ink/85 px-4 py-2 text-sm backdrop-blur-sm">
                    <MousePointerClick className="h-3.5 w-3.5 text-accent" />
                    Click to explore
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {project.preview && (
        <SitePreview
          url={project.preview}
          name={project.name}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </section>
  );
}

/** Pinned browser frame that crossfades between pages, with a phone in front. */
function WebComposition({
  project,
  progress,
  still,
  eager,
}: {
  project: Project;
  progress: MotionValue<number>;
  still: boolean;
  eager: boolean;
}) {
  const browserShots = project.shots.filter((s) => s.frame === "browser");
  const phone = project.shots.find((s) => s.frame === "phone");

  // The phone drifts on its own curve so the two planes separate in depth.
  const phoneY = useTransform(progress, [0.2, 0.85], [70, -50]);
  const phoneRotate = useTransform(progress, [0.2, 0.85], [-8, 4]);

  // Screenshots pan inside their frames, as if the page were being scrolled.
  // Kept inside the overscan the 1.08 scale provides, so no edge ever shows.
  const pageShift = useTransform(progress, [0.15, 0.9], ["-2.6%", "2.6%"]);
  const phoneShift = useTransform(progress, [0.15, 0.9], ["-1.8%", "1.8%"]);

  return (
    <div className="relative">
      <div className="relative">
        {browserShots.map((shot, i) => (
          <CrossfadeLayer
            key={shot.src}
            progress={progress}
            index={i}
            total={browserShots.length}
            still={still}
            absolute={i > 0}
          >
            <BrowserFrame
              src={shot.src}
              alt={shot.alt}
              priority={eager && i === 0}
              shift={still ? undefined : pageShift}
            />
          </CrossfadeLayer>
        ))}
      </div>

      {phone && (
        <motion.div
          className="absolute -bottom-14 -right-2 w-[26%] sm:-right-6 sm:w-[24%]"
          style={still ? undefined : { y: phoneY, rotate: phoneRotate }}
        >
          <PhoneFrame
            src={phone.src}
            alt={phone.alt}
            shift={still ? undefined : phoneShift}
          />
        </motion.div>
      )}
    </div>
  );
}

/** Several phones fanned across the panel, each on its own parallax rate. */
function PhoneFan({
  project,
  progress,
  still,
}: {
  project: Project;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const shots = project.shots.filter((s) => s.frame === "phone").slice(0, 4);

  return (
    <div className="preserve-3d flex items-center justify-center gap-3 sm:gap-5">
      {shots.map((shot, i) => (
        <FannedPhone
          key={shot.src}
          shot={shot}
          index={i}
          total={shots.length}
          progress={progress}
          still={still}
        />
      ))}
    </div>
  );
}

function FannedPhone({
  shot,
  index,
  total,
  progress,
  still,
}: {
  shot: { src: string; alt: string };
  index: number;
  total: number;
  progress: MotionValue<number>;
  still: boolean;
}) {
  // Distance from the centre of the fan drives both lift and tilt, so the
  // outer phones travel further and sit deeper than the middle ones.
  const offset = index - (total - 1) / 2;
  const depth = Math.abs(offset);

  const y = useTransform(progress, [0.15, 0.9], [60 + depth * 34, -40 - depth * 26]);
  const rotate = useTransform(progress, [0.15, 0.9], [offset * 5, offset * -3]);
  // Outer phones tip away from centre, which turns a flat row into a fan.
  const rotateY = useTransform(progress, [0.15, 0.5, 0.9], [offset * 9, offset * 4, offset * 10]);
  // Each screen pans a little, staggered by position, so they don't move in lockstep.
  const shift = useTransform(
    progress,
    [0.15, 0.9],
    [`${-2 - depth * 0.6}%`, `${2 + depth * 0.6}%`],
  );

  return (
    <motion.div
      className="w-[23%] shrink-0 sm:w-[21%]"
      style={
        still
          ? undefined
          : {
              y,
              rotate,
              rotateY,
              zIndex: total - depth,
              opacity: 1 - depth * 0.08,
            }
      }
    >
      <PhoneFrame src={shot.src} alt={shot.alt} shift={still ? undefined : shift} />
    </motion.div>
  );
}

/**
 * Fades one screenshot in while the previous fades out, keyed to the slice of
 * scroll progress that belongs to this index.
 */
function CrossfadeLayer({
  progress,
  index,
  total,
  still,
  absolute,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  still: boolean;
  absolute: boolean;
  children: React.ReactNode;
}) {
  // Screenshots cycle across the middle of the track, leaving the entrance
  // and exit of the section for the tilt.
  const start = 0.24;
  const end = 0.82;
  const span = (end - start) / total;
  const from = start + span * index;
  const to = from + span;

  const opacity = useTransform(
    progress,
    total === 1
      ? [0, 1]
      : [from - span * 0.45, from + span * 0.18, to - span * 0.18, to + span * 0.45],
    total === 1 ? [1, 1] : [0, 1, 1, 0],
  );

  return (
    <motion.div
      className={absolute ? "absolute inset-0" : "relative"}
      style={still ? { opacity: index === 0 ? 1 : 0 } : { opacity }}
    >
      {children}
    </motion.div>
  );
}

function LivePip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-emerald-400">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </span>
      Live
    </span>
  );
}
