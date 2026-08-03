import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-faint sm:flex-row">
        <p>
          © {year} {site.name}
        </p>
        <p className="text-center sm:text-right">
          Built with Next.js and deployed on Vercel.
        </p>
      </div>
    </footer>
  );
}
