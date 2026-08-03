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
    slug: "urpay",
    name: "urpay",
    blurb: "A digital wallet used across Saudi Arabia",
    description:
      "A production digital wallet for peer-to-peer and international transfers, bill payments and card issuance. I led full-cycle development of the React Native application, including the secure transaction flows and audit logging behind every payment.",
    year: "2023 — Present",
    role: "Lead mobile engineer · React Native",
    accent: "#2D5BFF",
    status: "live",
    icon: "/projects/urpay-icon.webp",
    links: [
      { label: "urpay.com.sa", href: "https://urpay.com.sa" },
      { label: "App Store", href: "https://apps.apple.com/us/app/urpay/id1585778338" },
    ],
    stack: ["React Native", "TypeScript", "Payments", "Apple Pay", "Secure flows"],
    highlights: [
      "Rated 4.6 across more than 155,000 App Store reviews.",
      "Still shipping — currently at version 5.35, updated August 2026.",
      "Transfers to over 140 countries through MoneyGram, Ria and Tahweel Al Rajhi.",
      "Top-ups via bank cards, Apple Pay, Samsung Pay and bank transfer.",
      "Built secure transaction flows with structured error handling and audit logs.",
    ],
    shots: [{ src: "/projects/urpay-web.webp", alt: "urpay digital wallet", frame: "browser" }],
  },
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
    slug: "hera",
    name: "Hera",
    blurb: "Operations software for Amazon delivery partners",
    description:
      "A workforce platform for Amazon delivery service partners, covering scheduling, driver coaching, compliance and performance tracking. Built for the operators who run those fleets day to day.",
    year: "2024 — 2025",
    role: "Frontend engineer",
    accent: "#16A97F",
    status: "live",
    links: [{ label: "hera.app", href: "https://hera.app" }],
    stack: ["React", "TypeScript", "Node", "Scheduling", "Reporting"],
    highlights: [
      "Scheduling, coaching, compliance and performance tracking in one platform.",
      "Priced per active driver, so the interface had to stay legible at fleet scale.",
      "Built for daily operational use rather than occasional reporting.",
    ],
    shots: [{ src: "/projects/hera-web.webp", alt: "Hera operations platform", frame: "browser" }],
  },
];

export type WorkCard = {
  slug: string;
  name: string;
  year: string;
  role: string;
  note: string;
  stack: string[];
  image?: string;
  /** Portrait art is shown inside a phone frame; landscape fills the card. */
  imageShape?: "portrait" | "landscape";
  icon?: string;
  accent: string;
  status?: "live" | "archived";
  preview?: string;
  links?: { label: string; href: string }[];
};

/**
 * Everything else worth showing, as a grid rather than a full scroll
 * showcase. Several of these predate any surviving screenshots — where only
 * an app icon exists, that is what is shown rather than a stand-in mockup.
 */
export const moreWork: WorkCard[] = [
  {
    slug: "securehire",
    name: "SecureHire",
    year: "2023",
    role: "Full-stack engineer",
    note: "Pre-employment screening platform with a candidate app and an employer dashboard. I wrote both the application and the backing service.",
    stack: ["React Native", "Node", "Express", "MongoDB"],
    image: "/projects/securehire-web.webp",
    accent: "#F2A93B",
    status: "live",
    preview: "https://securehire.com",
    links: [{ label: "securehire.com", href: "https://securehire.com" }],
  },
  {
    slug: "contango",
    name: "Contango",
    year: "2024",
    role: "Contracted engineer",
    note: "Engaged through Contango as a contracted resource on a United Arab Emirates government digital transformation programme.",
    stack: ["React", "TypeScript", "Enterprise"],
    image: "/projects/contango-web.webp",
    accent: "#8B6CF0",
    status: "live",
    preview: "https://www.contango.ae/",
    links: [{ label: "contango.ae", href: "https://www.contango.ae/" }],
  },
  {
    slug: "legacy-memoirs",
    name: "Legacy Memoirs",
    year: "2022 — 2023",
    role: "Lead mobile engineer",
    note: "An app for recording and preserving family life stories. I wrote 320 of its 327 commits, effectively building it end to end.",
    stack: ["React Native", "Expo", "Firebase"],
    image: "/projects/legacy-2.webp",
    imageShape: "portrait",
    icon: "/projects/legacy-icon.webp",
    accent: "#E06B4F",
  },
  {
    slug: "smaplr",
    name: "SMAPLR",
    year: "2022 — 2025",
    role: "Frontend engineer, React",
    note: "A multi-tenant planning platform. I built the sub-domain routing that gave every client its own database, workspace and interface theme from one codebase. 388 of its 426 commits are mine.",
    stack: ["React", "TypeScript", "Multi-tenancy", "Sub-domain routing"],
    accent: "#4C8DFF",
    status: "archived",
  },
  {
    slug: "early-friday",
    name: "Early Friday",
    year: "2022",
    role: "Frontend engineer, React",
    note: "Client workspace product built on the same multi-tenant approach: isolated databases and per-client theming behind a shared frontend.",
    stack: ["React", "JavaScript", "Multi-tenancy"],
    accent: "#D9A441",
    status: "archived",
  },
  {
    slug: "seven-invites",
    name: "Seven Invites",
    year: "2021 — 2022",
    role: "Senior software engineer",
    note: "Consumer social invitations platform. I contributed 2,143 commits, built the reusable component library and the Stripe and Twilio integrations behind it.",
    stack: ["React", "TypeScript", "Stripe", "Twilio", "GCP Tasks"],
    accent: "#E0518F",
    links: [{ label: "Instagram", href: "https://www.instagram.com/seveninvites/" }],
  },
  {
    slug: "srvhub",
    name: "SrvHub & SrvHub Pro",
    year: "2021",
    role: "Mobile engineer",
    note: "Paired marketplace apps for home services — one for customers, one for providers — sharing a design system and backend.",
    stack: ["React Native", "Expo", "Firebase"],
    icon: "/projects/srvhub-icon.webp",
    accent: "#3BA9C4",
    status: "archived",
  },
  {
    slug: "bensboat",
    name: "BensBoat English",
    year: "2021 — 2022",
    role: "Sole engineer",
    note: "English-learning app built for Thai schools. Every one of its 129 commits is mine.",
    stack: ["React Native", "Expo", "Firebase Realtime DB"],
    icon: "/projects/bensboat-icon.webp",
    accent: "#5FBF7F",
    status: "archived",
  },
  {
    slug: "pikkett",
    name: "Pikkitt",
    year: "2021",
    role: "Sole engineer",
    note: "Early-stage consumer app taken from empty repository to a working build.",
    stack: ["React Native", "Expo"],
    icon: "/projects/pikkett-icon.webp",
    accent: "#9B6BD6",
    status: "archived",
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
    year: "2020",
    name: "Open-source React Native work",
    kind: "Community",
    note: "Contributions and forks across action sheets, carousels, skeletons and device info.",
  },
];
