import { Intro } from "@/components/intro";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Aurora } from "@/components/aurora";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Work } from "@/components/work";
import { Projects } from "@/components/projects";
import { MoreWork } from "@/components/more-work";
import { Timeline } from "@/components/timeline";
import { Skills } from "@/components/skills";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Intro />
      <SmoothScroll />
      <Aurora />
      <Nav />
      <main>
        <Hero />
        <Work />
        <Projects />
        <MoreWork />
        <Timeline />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
