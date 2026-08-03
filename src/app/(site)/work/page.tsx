import type { Metadata } from "next";
import { Work } from "@/components/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Seven years of engineering work across fintech, digital payments and enterprise SaaS — infrastructure as code, mobile delivery, and AI-assisted development workflows.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return <Work />;
}
