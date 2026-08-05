/**
 * A slow-drifting field of blurred colour behind the whole page.
 *
 * Three blobs orbit on independent CSS loops. Because the layer is fixed and
 * blurred to 160px, it reads as ambient light rather than as shapes.
 *
 * The previous version pulled the palette through a scroll-linked
 * `hue-rotate` applied over that 160px blur, which forced the browser to
 * re-filter the entire viewport on every frame of every scroll — by some
 * distance the most expensive thing on the site. The drift is now pure
 * compositor work and the colour is fixed. Reduced motion is handled by the
 * global rule in `globals.css`, which stops the animations.
 */
export function Aurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden [filter:blur(160px)]"
    >
      <div className="aurora-a absolute left-[6%] top-[8%] h-[48vh] w-[48vw] rounded-full bg-accent/20" />
      <div className="aurora-b absolute right-[4%] top-[38%] h-[44vh] w-[42vw] rounded-full bg-indigo-500/18" />
      <div className="aurora-c absolute bottom-[6%] left-[32%] h-[40vh] w-[40vw] rounded-full bg-fuchsia-500/12" />
    </div>
  );
}
