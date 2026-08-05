import type { Metadata, Viewport } from "next";
import { CvDocument } from "@/components/cv-document";

/**
 * The source the resume PDF is printed from.
 *
 * Identical to `/cv` except that it carries the phone number, which belongs in
 * a file a recruiter downloads rather than in HTML that address harvesters
 * crawl. Kept out of the sitemap, noindexed here, and disallowed in robots.txt.
 */
export const metadata: Metadata = {
  title: "CV (print)",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function CvPrintPage() {
  return <CvDocument showPhone />;
}
