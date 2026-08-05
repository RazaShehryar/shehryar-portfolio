import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.intro,
  keywords: [
    "Shehryar Raza",
    "Principal Software Engineer",
    "agentic AI engineer",
    "AI model evaluation",
    "RLHF engineer",
    "coding agents",
    "prompt engineering",
    "retrieval-augmented generation",
    "React Native developer",
    "Next.js developer",
    "Node.js engineer",
    "TypeScript",
    "AWS CDK",
    "full stack engineer",
    "fintech engineer",
    "MakolaHub",
    "urpay",
  ],
  authors: [{ name: site.name, url: site.domain }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.domain,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    // Not `site.intro`: that paragraph opens with "Seven years of it", which
    // reads as a fragment once a share card strips away the line above it.
    description: site.share,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.share,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
};

/** Structured data so search engines resolve the person, not just the page. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.domain,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  sameAs: [site.github, site.linkedin],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Information Technology University (ITU), Lahore",
  },
  hasOccupation: {
    "@type": "Occupation",
    name: "Principal Software Engineer",
    occupationalCategory: "15-1252.00", // BLS SOC: Software Developers
    skills:
      "AI agent evaluation, RLHF, prompt engineering, retrieval-augmented generation, React, React Native, Next.js, Node.js, TypeScript, AWS CDK",
  },
  knowsAbout: [
    "Agentic AI",
    "Large language models",
    "AI model evaluation",
    "RLHF",
    "Prompt engineering",
    "Retrieval-augmented generation",
    "React",
    "React Native",
    "Next.js",
    "Vue 3",
    "TypeScript",
    "Node.js",
    "Python",
    "GraphQL",
    "AWS CDK",
    "Infrastructure as Code",
    "Fintech",
    "Digital payments",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <head>
        {/*
          Scroll-triggered content is server-rendered with an inline
          `opacity: 0` that only JavaScript clears, and the intro curtain is
          server-rendered covering the page. With scripts blocked or broken,
          both of those leave a blank screen — these rules undo them.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}[data-curtain]{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="grain antialiased">
        <script
          type="application/ld+json"
          // Static, author-controlled object; no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
