export const site = {
  name: "Shehryar Raza",
  role: "Principal Software Engineer",
  domain: "https://shehryar-raza.dev",
  tagline:
    "I build products end to end — and increasingly, I build the agentic systems that build them.",
  intro:
    "Seven years shipping web and mobile products from first commit to app store. Lately my work sits at the intersection of product engineering and agentic AI: designing coding agents, evaluating frontier models, and running large refactors with AI in the loop.",
  email: "shehryarraza320@gmail.com",
  github: "https://github.com/RazaShehryar",
  linkedin: "https://www.linkedin.com/in/shehryarraza/",
  location: "Remote",
} as const;

/** Headline numbers. Every figure here is counted from real git history. */
export const stats = [
  { value: "7+", label: "Years shipping" },
  { value: "2,000+", label: "Commits on Makola" },
  { value: "30+", label: "Products delivered" },
  { value: "3", label: "Live on the app stores" },
] as const;

/**
 * Roles are described by the work, not the employer.
 * Company names are deliberately omitted.
 */
export const experience = [
  {
    period: "2025 — Present",
    title: "Evals & Agentic AI Engineering",
    kind: "Frontier AI lab client",
    summary:
      "Design and run evaluations for coding agents and agentic applications. Previously contributed RLHF data for model training; now focused on measuring whether agents actually do the job.",
    points: [
      "Built and maintained an internal eval tooling platform, authoring 608 of its 883 commits.",
      "Write adversarial and multi-turn evals that probe agent failure modes rather than happy paths.",
      "Review agent-authored pull requests against real production repositories and grade correctness, not plausibility.",
      "Develop rubrics and scoring harnesses used to compare model versions across releases.",
    ],
    stack: ["Agent evals", "RLHF", "TypeScript", "Python", "Prompt engineering"],
  },
  {
    period: "2023 — Present",
    title: "Lead Engineer, B2B Marketplace Platform",
    kind: "Freelance — Ghana",
    summary:
      "Sole lead engineer on a marketplace serving Ghanaian businesses across iOS, Android, web and admin. Took it from prototype to a live, transacting platform.",
    points: [
      "Authored 1,002 of 1,034 commits in the production monorepo covering four applications.",
      "Shipped the React Native app to both stores and kept it current through version 4.0.4.",
      "Built the Node backend handling search, payments, notifications and onboarding on Google App Engine.",
      "Added AI-powered matchmaking using OpenAI embeddings over a Postgres vector store.",
      "Consolidated six separate repositories into a single Nx monorepo.",
    ],
    stack: ["React Native", "Next.js", "Node", "GraphQL", "Firebase", "GCP", "OpenAI"],
  },
  {
    period: "2020 — 2023",
    title: "Senior Mobile & Full-Stack Engineer",
    kind: "Social and fintech products",
    summary:
      "Core engineer on consumer social and fintech apps, several of which reached the app stores and are still live today.",
    points: [
      "Contributed 2,143 commits to a social invitations platform across its entire lifecycle.",
      "Wrote 1,022 commits on a sports social product spanning app and backend.",
      "Shipped a blockchain voting app still live on both stores five years after release.",
      "Rebuilt an enterprise planning dashboard, authoring 388 of its 426 commits.",
    ],
    stack: ["React Native", "React", "TypeScript", "Node", "Firebase", "AWS"],
  },
  {
    period: "2018 — 2020",
    title: "Mobile Engineer",
    kind: "Agency and early-stage clients",
    summary:
      "Delivered client applications across services marketplaces, education and media, and published open-source React Native components along the way.",
    points: [
      "Shipped paired customer and provider apps for a home services marketplace.",
      "Built an English-learning app used in Thai schools.",
      "Maintained several React Native open-source libraries.",
    ],
    stack: ["React Native", "JavaScript", "Firebase", "Redux"],
  },
] as const;

export const skillGroups = [
  {
    title: "Agentic AI",
    items: [
      "Coding agents",
      "Agent evaluation",
      "RLHF",
      "Prompt engineering",
      "OpenAI / Anthropic APIs",
      "Embeddings & RAG",
      "MCP",
    ],
  },
  {
    title: "Mobile",
    items: ["React Native", "Expo", "iOS", "Android", "Reanimated", "App Store delivery"],
  },
  {
    title: "Web",
    items: ["Next.js", "React", "TypeScript", "Tailwind", "MUI", "Framer Motion"],
  },
  {
    title: "Backend & Infra",
    items: ["Node", "Express", "GraphQL / Hasura", "Postgres", "Firebase", "GCP", "Nx monorepos"],
  },
] as const;
