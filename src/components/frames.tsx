import Image from "next/image";

/**
 * A macOS-style browser chrome wrapping a desktop screenshot.
 * Sized by its container so the scroll showcase can scale it freely.
 */
export function BrowserFrame({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0f0f15] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)] sm:rounded-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-3 py-2 sm:px-4 sm:py-2.5">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57] sm:h-2.5 sm:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e] sm:h-2.5 sm:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-[#28c840] sm:h-2.5 sm:w-2.5" />
        <div className="ml-2 h-3.5 flex-1 rounded-full bg-white/[0.06] sm:h-4" />
      </div>
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1150}
        priority={priority}
        sizes="(max-width: 768px) 92vw, 60vw"
        className="h-auto w-full"
      />
    </div>
  );
}

/**
 * An iPhone-style frame for app screenshots.
 *
 * Every dimension is a percentage of the frame's own width so the bezel,
 * corner radius and island stay in proportion whether the phone is rendered
 * at 170px in a fanned row or full width on mobile.
 */
export function PhoneFrame({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative rounded-[13%] border border-white/15 bg-[#0f0f15] p-[2.2%] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)]">
      <div className="relative overflow-hidden rounded-[11%] bg-black">
        {/* Dynamic-island style cutout */}
        <div className="absolute left-1/2 top-[1.4%] z-10 w-[26%] -translate-x-1/2 rounded-full bg-black [aspect-ratio:7/2]" />
        <Image
          src={src}
          alt={alt}
          width={560}
          height={1000}
          priority={priority}
          sizes="(max-width: 768px) 60vw, 22vw"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
