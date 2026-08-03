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
    blurb: "Moving real money, in Saudi Arabia",
    description:
      "A wallet people in Saudi Arabia use to move money, pay bills and issue cards. I led the React Native build, including the transaction flows and the audit trail sitting behind every payment. Working on something where a bug costs someone real money changes how carefully you write.",
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
      "4.6 stars across more than 155,000 App Store reviews.",
      "Still shipping. Version 5.35 went out in August 2026.",
      "Sends money to over 140 countries through MoneyGram, Ria and Tahweel Al Rajhi.",
      "Top-ups from bank cards, Apple Pay, Samsung Pay or a transfer.",
    ],
    shots: [{ src: "/projects/urpay-web.webp", alt: "urpay digital wallet", frame: "browser" }],
  },
  {
    slug: "makolahub",
    name: "MakolaHub",
    blurb: "Getting Ghanaian businesses online",
    description:
      "Over 90% of Ghanaian businesses aren't online at all. MakolaHub gives them a storefront: products, services, job listings, RFQs, with escrow so neither side has to trust the other first. I'm the only engineer on it, across all four apps.",
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
      "Live on iOS at 4.0.4 and on Google Play, still shipping through 2026.",
      "Matchmaking runs on OpenAI embeddings over a Postgres vector store.",
      "Pulled six separate repositories into one Nx workspace, which I should have done a year earlier.",
      "Escrow through Paystack, secrets handled by KMS on App Engine.",
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
    blurb: "Still running, five years later",
    description:
      "Polls settled on-chain. Shipped in 2021 and somehow still getting updates, which makes it the longest-lived thing I've touched.",
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
      "On both stores at 4.3.0, last updated in 2026.",
      "4.2 stars, though only 31 people bothered to rate it.",
      "Built with a distributed team across several years of releases.",
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
    blurb: "Running Amazon delivery fleets",
    description:
      "Scheduling, coaching and compliance for the people who run Amazon delivery fleets. Built for operators who live in it all day, not managers who open it once a month.",
    year: "2024 — Present",
    role: "Frontend engineer",
    accent: "#16A97F",
    status: "live",
    links: [{ label: "hera.app", href: "https://hera.app" }],
    stack: ["React", "TypeScript", "Node", "Scheduling", "Reporting"],
    highlights: [
      "Scheduling, coaching, compliance and performance in one place.",
      "Priced per active driver, so it had to stay readable with a few hundred of them.",
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
    note: "Background screening, with an app for candidates and a dashboard for employers. I wrote both ends of it.",
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
    note: "Contracted through Contango onto a UAE government programme. Enterprise pace, lots of stakeholders, useful lesson in patience.",
    stack: ["React", "TypeScript", "Enterprise"],
    image: "/projects/contango-web.webp",
    accent: "#8B6CF0",
    status: "live",
    preview: "https://www.contango.ae/",
    links: [{ label: "contango.ae", href: "https://www.contango.ae/" }],
  },
  {
    slug: "fluyo",
    name: "Fluyo",
    year: "2020 — 2021",
    role: "React Native developer",
    note: "Language learning disguised as a game. Biomes, creatures, a dolphin that follows you around. I worked on the mobile client.",
    stack: ["React Native", "Animations", "Game UI"],
    image: "/projects/fluyo-web.webp",
    icon: "/projects/fluyo-icon.webp",
    accent: "#2BB7C4",
    status: "live",
    preview: "https://fluyo.com/",
    links: [
      { label: "App Store", href: "https://apps.apple.com/us/app/fluyo-fun-language-lessons/id1524967327" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.fluyo" },
    ],
  },
  {
    slug: "central-pro",
    name: "Central Pro Services",
    year: "2021 — 2023",
    role: "Frontend engineer",
    note: "Scheduling and job management for a company that renovates apartments between tenants.",
    stack: ["React", "TypeScript", "Node"],
    image: "/projects/centralproserv-web.webp",
    accent: "#4F9BD9",
    status: "live",
    preview: "https://centralproserv.com/",
    links: [{ label: "centralproserv.com", href: "https://centralproserv.com/" }],
  },
  {
    slug: "apple-music-module",
    name: "Workout + Apple Music",
    year: "2024",
    role: "React Native & Swift",
    note: "A workout app that drives Apple Music. The bridge didn't do what I needed, so I wrote the Swift module myself: catalog playlists, fetching songs from a playlist, and fixing a queue bug that had been there a while.",
    stack: ["Swift", "MusicKit", "React Native", "Native modules"],
    // The app icon is near-white and reads as a blank blob on a dark card,
    // so this one falls through to the monogram.
    accent: "#FA2D5A",
    links: [
      { label: "Native module", href: "https://github.com/RazaShehryar/react-native-apple-music" },
      { label: "App repo", href: "https://github.com/RazaShehryar/workout" },
    ],
  },
  {
    slug: "duals",
    name: "Duals",
    year: "2020 — 2023",
    role: "Lead engineer",
    note: "Sports social app, client and server both. One of the biggest codebases I've lived in.",
    stack: ["React Native", "Node", "Firebase"],
    accent: "#7C5CE0",
  },
  {
    slug: "bite",
    name: "Bite",
    year: "2021 — 2022",
    role: "Mobile engineer",
    note: "Restaurant discovery with a social layer, built by a small team.",
    stack: ["React Native", "TypeScript", "Firebase"],
    icon: "/projects/bite-icon.webp",
    accent: "#E8664A",
  },
  {
    slug: "toksave",
    name: "TokSave",
    year: "2020 — 2022",
    role: "Sole engineer",
    note: "A tool for saving short-form video profiles. Just me on it, start to finish.",
    stack: ["React Native", "JavaScript"],
    accent: "#25C4D6",
    status: "archived",
  },
  {
    slug: "legacy-memoirs",
    name: "Legacy Memoirs",
    year: "2022 — 2023",
    role: "Lead mobile engineer",
    note: "An app for recording family stories before they're lost. I built the whole thing.",
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
    note: "A planning platform where every client got their own subdomain, their own database and their own theme, all from one codebase. The routing for that was mine.",
    stack: ["React", "TypeScript", "Multi-tenancy", "Sub-domain routing"],
    accent: "#4C8DFF",
    status: "archived",
  },
  {
    slug: "early-friday",
    name: "Early Friday",
    year: "2022",
    role: "Frontend engineer, React",
    note: "Same multi-tenant idea as SMAPLR. Separate databases, separate theming, one frontend underneath.",
    stack: ["React", "JavaScript", "Multi-tenancy"],
    accent: "#D9A441",
    status: "archived",
  },
  {
    slug: "seven-invites",
    name: "Seven Invites",
    year: "2021 — 2022",
    role: "Senior software engineer",
    note: "Social invitations app. I built the component library the rest of the team worked on top of, plus the Stripe and Twilio pieces.",
    stack: ["React", "TypeScript", "Stripe", "Twilio", "GCP Tasks"],
    accent: "#E0518F",
    links: [{ label: "Instagram", href: "https://www.instagram.com/seveninvites/" }],
  },
  {
    slug: "srvhub",
    name: "SrvHub & SrvHub Pro",
    year: "2021",
    role: "Mobile engineer",
    note: "Two apps for home services, one for customers and one for the people doing the work, sharing a design system and a backend.",
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
    note: "English learning for Thai schools. Mine from the first commit to release.",
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
    note: "Took an empty repo to a working build, then it stopped.",
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
    note: "The tooling I use to grade coding agents against real repositories.",
    status: "live",
  },
  {
    year: "2025",
    name: "MakolaHub monorepo",
    kind: "Freelance",
    note: "The year I finally merged six repositories into one workspace.",
    status: "live",
  },
  {
    year: "2024",
    name: "Marketplace admin & driver apps",
    kind: "Freelance",
    note: "An operations dashboard, plus a separate app for the drivers.",
  },
  {
    year: "2024",
    name: "Fitness tracking web app",
    kind: "Client",
    note: "Workout logging on the web. Simple, and it worked.",
  },
  {
    year: "2023",
    name: "Bath refinishing operations panel",
    kind: "Client",
    note: "Scheduling for a business that refinishes bathtubs. Not glamorous, very used.",
  },
  {
    year: "2022",
    name: "Social invitations platform",
    kind: "Product team",
    note: "Start to finish on a consumer social app, which taught me what maintenance actually costs.",
  },
  {
    year: "2022",
    name: "Enterprise planning dashboard",
    kind: "Client",
    note: "A forecasting and planning interface, mostly mine.",
  },
  {
    year: "2021",
    name: "Votly",
    kind: "Product team",
    note: "The voting app. Still going.",
    status: "live",
  },
  {
    year: "2020",
    name: "Open-source React Native work",
    kind: "Community",
    note: "Patches and forks on the React Native libraries I was relying on at the time.",
  },
];
