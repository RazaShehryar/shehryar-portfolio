export type Shot = {
  src: string;
  alt: string;
  /** Frame the screenshot is rendered inside during the scroll showcase. */
  frame: "browser" | "phone";
};

export type Project = {
  slug: string;
  name: string;
  blurb: string;
  description: string;
  year: string;
  role: string;
  /** Accent used for the ambient glow behind the device on scroll. */
  accent: string;
  status: "live" | "archived";
  icon?: string;
  /**
   * Site to embed in the in-page preview. Only set this for hosts that permit
   * framing — anything sending `X-Frame-Options` or a CSP `frame-ancestors`
   * directive renders as a blank panel.
   */
  preview?: string;
  links: { label: string; href: string }[];
  stack: string[];
  highlights: string[];
  shots: Shot[];
};

/** Projects that get the full scroll-driven showcase. */
export const featured: Project[] = [
  {
    slug: "makolahub",
    name: "MakolaHub",
    blurb: "A B2B marketplace putting Ghanaian businesses online",
    description:
      "More than 90% of Ghanaian businesses have no online presence. MakolaHub gives any of them a storefront — products, services, job listings and RFQs — with escrow-protected trade and AI matchmaking. I am the lead engineer across all four applications.",
    year: "2023 — Present",
    role: "Lead engineer · iOS, Android, web, backend",
    accent: "#2C7BE5",
    status: "live",
    icon: "/projects/makolahub-icon.webp",
    preview: "https://makolahub.com",
    links: [
      { label: "makolahub.com", href: "https://makolahub.com" },
      { label: "App Store", href: "https://apps.apple.com/us/app/makolahub/id6745556298" },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.makolahub.makolahub",
      },
    ],
    stack: [
      "React Native",
      "Expo",
      "Next.js 15",
      "React 19",
      "Node",
      "GraphQL",
      "Hasura",
      "Postgres",
      "Firebase",
      "Google Cloud",
      "OpenAI",
      "Nx",
    ],
    highlights: [
      "1,002 of 1,034 commits in the production monorepo are mine.",
      "Live on iOS at v4.0.4 and on Google Play, shipping updates through 2026.",
      "AI matchmaking built on OpenAI embeddings over a Postgres vector store.",
      "Consolidated six repositories into one Nx monorepo covering web, mobile, admin and backend.",
      "Escrow payments via Paystack, with KMS-backed secret handling on App Engine.",
    ],
    shots: [
      { src: "/projects/makolahub-web.webp", alt: "MakolaHub marketplace homepage", frame: "browser" },
      { src: "/projects/makolahub-products.webp", alt: "MakolaHub product listings", frame: "browser" },
      { src: "/projects/makolahub-services.webp", alt: "MakolaHub services directory", frame: "browser" },
      { src: "/projects/makolahub-mobile.webp", alt: "MakolaHub on mobile", frame: "phone" },
    ],
  },
  {
    slug: "votly",
    name: "Votly",
    blurb: "Blockchain-backed voting, still live five years on",
    description:
      "A social voting app where polls are settled on-chain. Released in 2021 and still maintained and shipping updates today, which makes it the longest-lived product I have worked on.",
    year: "2021 — 2023",
    role: "Mobile engineer",
    accent: "#7B61FF",
    status: "live",
    icon: "/projects/votly-icon.webp",
    links: [
      { label: "App Store", href: "https://apps.apple.com/us/app/votly/id1598662251" },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.theblockchainlabs.votly",
      },
    ],
    stack: ["React Native", "TypeScript", "Blockchain", "Firebase"],
    highlights: [
      "Live on both stores at v4.3.0, last updated in 2026.",
      "Rated 4.2 across 31 App Store reviews.",
      "Shipped inside a 1,086-commit codebase alongside a distributed team.",
    ],
    shots: [
      { src: "/projects/votly-0.webp", alt: "Votly feed", frame: "phone" },
      { src: "/projects/votly-1.webp", alt: "Votly poll detail", frame: "phone" },
      { src: "/projects/votly-3.webp", alt: "Votly results", frame: "phone" },
      { src: "/projects/votly-2.webp", alt: "Votly profile", frame: "phone" },
    ],
  },
  {
    slug: "securehire",
    name: "SecureHire",
    blurb: "Pre-employment screening, front to back",
    description:
      "An employment screening platform with a candidate-facing application and an employer dashboard. I built both the mobile app and the backing service.",
    year: "2023",
    role: "Full-stack engineer",
    accent: "#F2A93B",
    status: "live",
    preview: "https://securehire.com",
    links: [{ label: "securehire.com", href: "https://securehire.com" }],
    stack: ["React Native", "Node", "Express", "MongoDB"],
    highlights: [
      "Sole author of both the application and the backend service.",
      "Employer dashboard for ordering and tracking screening checks.",
    ],
    shots: [
      { src: "/projects/securehire-web.webp", alt: "SecureHire platform", frame: "browser" },
    ],
  },
];

export type TimelineEntry = {
  year: string;
  name: string;
  kind: string;
  note: string;
  commits?: number;
  status?: "live" | "archived";
};

/**
 * The wider body of work. Commit counts are the number authored by me,
 * read directly from each repository's history.
 */
export const timeline: TimelineEntry[] = [
  {
    year: "2026",
    name: "Agent eval tooling",
    kind: "Frontier AI lab",
    note: "Internal platform for grading coding agents on real repositories.",
    commits: 608,
    status: "live",
  },
  {
    year: "2025",
    name: "MakolaHub monorepo",
    kind: "Freelance",
    note: "Six repositories consolidated into one Nx workspace spanning four apps.",
    commits: 1002,
    status: "live",
  },
  {
    year: "2024",
    name: "Marketplace admin & driver apps",
    kind: "Freelance",
    note: "Operations dashboard and a companion delivery-driver application.",
    commits: 89,
  },
  {
    year: "2024",
    name: "Fitness tracking web app",
    kind: "Client",
    note: "Workout logging and progress tracking on the web.",
    commits: 85,
  },
  {
    year: "2023",
    name: "Legacy Memoirs",
    kind: "Client",
    note: "Life-story recording app; I wrote 320 of its 327 commits.",
    commits: 320,
  },
  {
    year: "2023",
    name: "SecureHire",
    kind: "Client",
    note: "Pre-employment screening app and backend.",
    commits: 66,
    status: "live",
  },
  {
    year: "2023",
    name: "Bath refinishing operations panel",
    kind: "Client",
    note: "Scheduling and job management for a refinishing business.",
    commits: 112,
  },
  {
    year: "2022",
    name: "Social invitations platform",
    kind: "Product team",
    note: "2,143 commits over the full lifecycle of a consumer social app.",
    commits: 2143,
  },
  {
    year: "2022",
    name: "Sports social app",
    kind: "Product team",
    note: "1,022 commits across the mobile client and its server.",
    commits: 1022,
  },
  {
    year: "2022",
    name: "Enterprise planning dashboard",
    kind: "Client",
    note: "Forecasting and planning interface; 388 of 426 commits mine.",
    commits: 388,
  },
  {
    year: "2022",
    name: "Food discovery app",
    kind: "Product team",
    note: "314 commits on a restaurant discovery product.",
    commits: 314,
  },
  {
    year: "2022",
    name: "TokSave",
    kind: "Side project",
    note: "Short-form video profile saver, 80 commits.",
    commits: 80,
  },
  {
    year: "2021",
    name: "Votly",
    kind: "Product team",
    note: "Blockchain voting app, still shipping today.",
    status: "live",
  },
  {
    year: "2021",
    name: "BensBoat English",
    kind: "Client",
    note: "English-learning app for Thai schools; every one of its 129 commits is mine.",
    commits: 129,
  },
  {
    year: "2021",
    name: "SrvHub customer & pro apps",
    kind: "Client",
    note: "Paired marketplace apps for home services.",
    commits: 64,
  },
  {
    year: "2020",
    name: "Open-source React Native work",
    kind: "Community",
    note: "Contributions and forks across action sheets, carousels, skeletons and device info.",
  },
];
