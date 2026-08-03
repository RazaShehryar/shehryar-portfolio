import type { Metadata } from "next";
import { Projects } from "@/components/projects";
import { MoreWork } from "@/components/more-work";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Products that shipped: urpay, a digital wallet used across Saudi Arabia; MakolaHub, a B2B marketplace in Ghana; Hera; Votly; and a decade of client work.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <Projects />
      <MoreWork />
    </>
  );
}
