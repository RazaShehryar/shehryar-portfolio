import { Intro } from "@/components/intro";
import { Tracker } from "@/components/tracker";
import { Aurora } from "@/components/aurora";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { RevealObserver } from "@/components/motion/reveal-observer";

/**
 * Chrome shared by every public page.
 *
 * Living in a route group means the admin portal sits outside it and never
 * loads the nav, aurora or visitor tracking. Because this layout persists
 * across navigations, the intro curtain runs once per session rather than on
 * every tab change, and one reveal observer serves the whole site.
 *
 * Inertial scrolling (Lenis) used to sit here. It was removed: it intercepted
 * wheel input for the whole document, which fought the scroll-linked project
 * showcase on trackpads, overrode a scrolling feel people are entitled to
 * expect from their own browser, and held a requestAnimationFrame loop open
 * for the life of every page.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Intro />
      <Tracker />
      <RevealObserver />
      <Aurora />
      <Nav />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
