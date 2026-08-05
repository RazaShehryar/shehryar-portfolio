import type { Metadata, Viewport } from "next";
import { CvDocument } from "@/components/cv-document";

const title = "CV — Shehryar Raza, Principal Software Engineer";
const description =
  "Curriculum vitae of Shehryar Raza: Principal Software Engineer specialising in AI and agent engineering, model evaluation and RLHF, React, React Native, Node.js and AWS. Seven years across fintech, digital payments and enterprise SaaS.";

export const metadata: Metadata = {
  title: "CV",
  description,
  alternates: { canonical: "/cv" },
  openGraph: { title, description, url: "/cv", type: "profile" },
  robots: { index: true, follow: true },
};

/** The rest of the site is dark; this page prints, so it is not. */
export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

/** The public CV. No phone number — see `/cv/print` for the version the PDF is built from. */
export default function CvPage() {
  return <CvDocument />;
}
