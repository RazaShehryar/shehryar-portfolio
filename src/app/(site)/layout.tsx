import { Intro } from "@/components/intro";
import { Tracker } from "@/components/tracker";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Aurora } from "@/components/aurora";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";

/**
 * Chrome shared by every public page.
 *
 * Living in a route group means the admin portal sits outside it and never
 * loads the nav, aurora or visitor tracking. Because this layout persists
 * across navigations, the intro curtain runs once per session rather than on
 * every tab change, and the smooth-scroll instance survives route changes.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Intro />
      <Tracker />
      <SmoothScroll />
      <Aurora />
      <Nav />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
