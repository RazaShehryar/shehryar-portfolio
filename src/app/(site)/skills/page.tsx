import type { Metadata } from "next";
import { Skills } from "@/components/skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Agentic AI, React and React Native, Node and NestJS, AWS CDK and Amplify Gen 2, Firebase and Google Cloud.",
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return <Skills />;
}
