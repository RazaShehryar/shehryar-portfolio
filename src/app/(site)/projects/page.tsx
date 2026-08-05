import type { Metadata } from "next";
import { ProjectFilter } from "@/components/project-filter";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Products that shipped: urpay, a digital wallet used across Saudi Arabia; MakolaHub, a B2B marketplace in Ghana; Hera; Votly; and a decade of client work.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return <ProjectFilter />;
}
