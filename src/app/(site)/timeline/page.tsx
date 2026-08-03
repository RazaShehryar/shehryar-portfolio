import type { Metadata } from "next";
import { Timeline } from "@/components/timeline";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "A chronological run through seven years of shipped software, from early React Native apps to agent evaluation platforms.",
  alternates: { canonical: "/timeline" },
};

export default function TimelinePage() {
  return <Timeline />;
}
