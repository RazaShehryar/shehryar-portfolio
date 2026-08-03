export const site = {
  name: "Shehryar Raza",
  role: "Principal Software Engineer",
  domain: "https://shehryar-raza.dev",
  tagline:
    "I build products end to end — and increasingly, I build the agentic systems that build them.",
  intro:
    "Seven years shipping production systems across fintech, digital payments and enterprise SaaS for clients in the US, UK and Saudi Arabia. Deep in the React and Node stack, with infrastructure as code, and a growing focus on AI-assisted delivery: orchestrating coding agents and evaluating the models behind them.",
  email: "shehryarraza320@gmail.com",
  phone: "+92 322 8409425",
  github: "https://github.com/RazaShehryar",
  linkedin: "https://www.linkedin.com/in/shehryarraza/",
  cv: "/shehryar-raza-cv.pdf",
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
      "Leading a cloud fleet operations platform and a production digital wallet, while pushing AI-assisted workflows into the delivery process itself.",
    points: [
      "Architected backend infrastructure on AWS Amplify Gen 2, defining dev, staging and production environments as CDK stacks.",
      "Built the fleet operations frontend in Vue 3 with the Composition API, including role-based access control for operators and admins.",
      "Drove AI-assisted development by writing custom steering files, orchestrating multiple agents and automating hooks that generate design docs, requirements, backlog and task artifacts.",
      "Cut the requirement-to-delivery cycle by roughly 35–40% through that structured automation.",
      "Led full-cycle development of a React Native digital wallet handling peer-to-peer and international transfers, bill payments and secure transaction flows with audit logging.",
    ],
    stack: ["AWS CDK", "Amplify Gen 2", "Vue 3", "React Native", "TypeScript", "Agent orchestration"],
  },
  {
    period: "2025 — Present",
    title: "Model Evaluation & RLHF",
    kind: "Frontier AI lab client · concurrent",
    summary:
      "Designing and running evaluations for coding agents and agentic applications. Started in RLHF data for model training; now focused on measuring whether agents actually do the job.",
    points: [
      "Built and maintained an internal eval tooling platform end to end.",
      "Write adversarial and multi-turn evals that probe agent failure modes rather than happy paths.",
      "Review agent-authored pull requests against real production repositories and grade correctness, not plausibility.",
      "Develop rubrics and scoring harnesses used to compare model versions across releases.",
    ],
    stack: ["Agent evals", "RLHF", "TypeScript", "Python", "Prompt engineering"],
  },
  {
    period: "2023 — Present",
    title: "Lead Engineer, B2B Marketplace",
    kind: "Freelance · Ghana",
    summary:
      "Sole lead engineer on a marketplace serving Ghanaian businesses across iOS, Android, web and admin. Took it from prototype to a live, transacting platform.",
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
      "Core engineer on a social invitations product, focused on reusable frontend architecture and the systems behind payments and messaging.",
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
      "Built a React Native point-of-sale application with integrated digital payments, working closely with design on usability.",
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
      "Data and reporting work inside a bank: query optimisation, internal tooling and automation of manual operational processes.",
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
