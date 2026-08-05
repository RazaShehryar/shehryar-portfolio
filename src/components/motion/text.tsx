/**
 * Characters rise out of a clipping mask one after another, each tipped
 * slightly forward in 3D so the line unfolds instead of merely sliding.
 * Words stay intact as inline-blocks so wrapping still works.
 *
 * Plain markup with CSS transitions — `RevealObserver` adds the class that
 * starts them. The trigger sits on the unclipped wrapper on purpose: watching
 * the characters themselves would deadlock, since they start fully outside
 * their overflow-hidden parent and an IntersectionObserver subtracts ancestor
 * clipping, leaving a visible area of zero.
 */
export function RevealChars({
  text,
  className,
  delay = 0,
  stagger = 0.028,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  let index = 0;

  return (
    <span data-reveal-group="" className={className} aria-label={text}>
      {words.map((word, w) => (
        <span key={`${word}-${w}`} className="inline-block whitespace-nowrap" aria-hidden>
          {[...word].map((char, c) => (
            <span key={`${char}-${c}`} className="inline-block overflow-hidden align-bottom">
              <span
                data-reveal-item="char"
                style={{ ["--reveal-delay" as string]: `${delay + index++ * stagger}s` }}
              >
                {char}
              </span>
            </span>
          ))}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
