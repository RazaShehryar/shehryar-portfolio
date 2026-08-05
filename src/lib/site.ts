export const site = {
  name: "Shehryar Raza",
  role: "Principal Software Engineer",
  domain: "https://shehryar-raza.dev",
  tagline:
    "I ship products. Mobile, web, and the backend underneath.",
  intro:
    "Seven years of it, mostly fintech and payments, for teams in the US, UK and Saudi Arabia. These days I split my time between a marketplace in Ghana and grading coding agents for an AI lab. The second one has quietly changed how I do the first.",
  email: "shehryarraza320@gmail.com",
  phone: "+92 322 8409425",
  github: "https://github.com/RazaShehryar",
  linkedin: "https://www.linkedin.com/in/shehryarraza/",
  /**
   * Filename carries the name and the word "Resume" because recruiters search
   * their downloads folder for exactly that. Generated from /cv by
   * `scripts/build-cv-pdf.mjs` — do not hand-edit the PDF.
   */
  cv: "/Shehryar_Raza_Resume.pdf",
  cvPage: "/cv",
  location: "Remote",
} as const;

export const stats = [
  { value: "7+", label: "Years shipping" },
  { value: "40%", label: "Faster delivery cycles" },
  { value: "30%", label: "Faster API responses" },
  { value: "4", label: "Apps live on the stores" },
] as const;

/**
 * Roles are described by the work, not the employer.
 * Company names are deliberately omitted throughout.
 */
export const experience = [
  {
    period: "2023 — Present",
    title: "Principal Software Engineer",
    kind: "Enterprise SaaS · fintech",
    summary:
      "Two things at once: a fleet operations platform and a digital wallet with real money moving through it. Somewhere in the middle I started rebuilding how the work itself gets planned.",
    points: [
      "Architected backend infrastructure on AWS Amplify Gen 2, defining dev, staging and production environments as CDK stacks.",
      "Built the fleet operations frontend in Vue 3 with the Composition API, including role-based access control for operators and admins.",
      "Wrote steering files and hooks so agents produce the design doc, the requirements and the backlog before anyone opens an editor.",
      "That cut roughly 35–40% off the time between a requirement landing and it shipping.",
      "Led full-cycle development of a React Native digital wallet handling peer-to-peer and international transfers, bill payments and secure transaction flows with audit logging.",
    ],
    stack: ["AWS CDK", "Amplify Gen 2", "Vue 3", "React Native", "TypeScript", "Agent orchestration"],
  },
  {
    period: "2025 — Present",
    title: "Model Evaluation & RLHF",
    kind: "Frontier AI lab client · concurrent",
    summary:
      "I grade coding agents. Started out writing RLHF data, then moved to the harder question of whether the thing actually works when you point it at a real repository.",
    points: [
      "Built and maintained an internal eval tooling platform end to end.",
      "Write the awkward evals — multi-turn, adversarial, the cases where an agent quietly does the wrong thing.",
      "Read agent-written pull requests against production code. Plausible and correct are not the same, and most of the job is telling them apart.",
      "Develop rubrics and scoring harnesses used to compare model versions across releases.",
    ],
    stack: ["Agent evals", "RLHF", "TypeScript", "Python", "Prompt engineering"],
  },
  {
    period: "2023 — Present",
    title: "Lead Engineer, B2B Marketplace",
    kind: "Freelance · Ghana",
    summary:
      "One engineer, four applications. Took it from a prototype to something Ghanaian businesses actually sell through.",
    points: [
      "Sole engineer on the production monorepo covering all four applications.",
      "Shipped the React Native app to both stores and kept it current through version 4.0.4.",
      "Built the Node backend handling search, payments, notifications and onboarding on Google App Engine.",
      "Added AI-powered matchmaking using OpenAI embeddings over a Postgres vector store.",
      "Consolidated six separate repositories into a single Nx monorepo.",
    ],
    stack: ["React Native", "Next.js", "Node", "GraphQL", "Firebase", "GCP", "OpenAI"],
  },
  {
    period: "2021 — 2022",
    title: "Senior Software Engineer",
    kind: "Consumer social platform",
    summary:
      "Consumer social product. I spent most of my time on the component library everyone else built on, plus the payments and messaging plumbing.",
    points: [
      "Developed reusable React component libraries that cut the feature development cycle by roughly 40%.",
      "Integrated Stripe payment processing with thorough validation and error handling.",
      "Built scalable notification infrastructure on Twilio and GCP Tasks with high delivery reliability.",
      "Contributed architecture improvements for long-term maintainability.",
    ],
    stack: ["React", "TypeScript", "Stripe", "Twilio", "GCP Tasks", "Node"],
  },
  {
    period: "2019 — 2021",
    title: "Software Developer",
    kind: "Point of sale · digital payments",
    summary:
      "A point-of-sale app with payments built in. First job where I sat with designers regularly, which changed how I write interfaces.",
    points: [
      "Shipped a React Native POS app with digital payment integration.",
      "Improved application response time by roughly 30% through performance work.",
      "Partnered with UI/UX to raise product usability and engagement.",
    ],
    stack: ["React Native", "JavaScript", "REST APIs", "Firebase"],
  },
  {
    period: "2018 — 2019",
    title: "Software Developer",
    kind: "Banking",
    summary:
      "Inside a bank, writing SQL. Unglamorous, and the best grounding in data I could have asked for.",
    points: [
      "Optimised SQL queries for roughly a 25% performance improvement.",
      "Automated operational reporting, saving over 10 hours of manual effort each week.",
      "Developed internal data tools in Oracle SQL and PL/SQL.",
    ],
    stack: ["Oracle SQL", "PL/SQL", "Power BI"],
  },
] as const;

export const education = {
  degree: "BSc Computer Science",
  school: "ITU, Lahore",
  period: "2013 — 2018",
  research: ["AI", "Human-computer interaction", "Computer vision", "Mobile development", "Agile"],
} as const;

export const skillGroups = [
  {
    title: "Agentic AI",
    items: [
      "Coding agents",
      "Agent orchestration",
      "Agent evaluation",
      "RLHF",
      "AI-assisted SDLC",
      "Prompt engineering",
      "Embeddings & RAG",
    ],
  },
  {
    title: "Frontend & Mobile",
    items: ["React", "React Native", "Next.js", "Vue 3", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Backend & API",
    items: ["Node.js", "Express", "NestJS", "GraphQL", "Strapi", "Firebase"],
  },
  {
    title: "Cloud & Data",
    items: [
      "AWS Amplify Gen 2",
      "AWS CDK (IaC)",
      "Google Cloud",
      "MongoDB",
      "Oracle SQL / PL-SQL",
      "Redis caching",
    ],
  },
] as const;
