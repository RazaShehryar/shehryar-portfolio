/**
 * Source of truth for the CV.
 *
 * Deliberately separate from `site.ts`. The public site describes roles by the
 * work and leaves employers out; a CV cannot do that — applicant tracking
 * systems parse employment history by company name and date range, and a
 * missing employer reads as a gap. So this file names companies, uses MM/YYYY
 * dates, and keeps employed and freelance work in separate sections.
 *
 * Weighted toward AI and agent engineering: the summary leads with it, the
 * skills block lists it first, and the highlights band puts every AI keyword
 * on page one regardless of where the freelance section falls.
 */

export const cvContact = {
  name: "Shehryar Raza",
  /** Kept keyword-dense: three role titles a recruiter might search for. */
  headline: "Principal Software Engineer · AI & Agent Engineering · Full-Stack (React / Node / AWS)",
  location: "Lahore, Pakistan — open to fully remote (US, UK and GCC hours)",
  email: "shehryarraza320@gmail.com",
  phone: "+92 322 8409425",
  linkedin: "linkedin.com/in/shehryarraza",
  linkedinUrl: "https://www.linkedin.com/in/shehryarraza/",
  github: "github.com/RazaShehryar",
  githubUrl: "https://github.com/RazaShehryar",
  website: "shehryar-raza.dev",
  websiteUrl: "https://shehryar-raza.dev",
} as const;

export const cvSummary =
  "Principal Software Engineer with 7+ years building production systems, now focused on AI and agent engineering. " +
  "Evaluates coding agents and large language models for a frontier AI lab: writes adversarial and multi-turn evals, " +
  "reviews agent-generated pull requests against production repositories, and builds the rubrics and scoring harnesses " +
  "used to compare model versions across releases. Also ships the products — React, React Native, Node.js and TypeScript " +
  "on AWS and Google Cloud — across fintech, digital payments and enterprise SaaS for clients in the US, UK, Saudi Arabia " +
  "and Ghana. Strong in Infrastructure as Code (AWS CDK, Amplify Gen 2), retrieval-augmented generation and AI-assisted " +
  "SDLC workflows that cut requirement-to-delivery time by 35-40%.";

/**
 * Sits directly under the summary so the AI keyword cluster lands on page one
 * even though the freelance engagement that produced most of it is lower down.
 */
export const cvAiHighlights = [
  "Model evaluation and RLHF for a frontier AI lab: authored adversarial, multi-turn and long-horizon evals for coding agents, plus the rubrics and scoring harnesses used to rank model versions.",
  "Built and maintained an internal eval tooling platform end to end, in TypeScript and Python.",
  "Shipped retrieval-augmented generation in production: OpenAI embeddings over a Postgres vector store, powering buyer-to-supplier matchmaking on a live B2B marketplace.",
  "Drove AI-assisted SDLC adoption on an enterprise team through custom steering files, agent orchestration and automated hooks that generate design docs, requirements and backlog before implementation starts.",
];

export const cvAchievements = [
  "Cut requirement-to-delivery time by ~35-40% with AI-assisted, structured SDLC workflows.",
  "Improved API performance by ~30% via query optimisation, Redis caching and backend refactoring.",
  "Sole engineer on a four-application production monorepo now live on the App Store and Google Play.",
];

export type CvRole = {
  company: string;
  title: string;
  /** MM/YYYY on both sides — the format ATS date parsers handle most reliably. */
  start: string;
  end: string;
  location: string;
  /** One line of context: what the product is, so bullets have something to hang on. */
  context?: string;
  bullets: string[];
  stack: string;
};

export const cvExperience: CvRole[] = [
  {
    company: "NorthBay Solutions",
    title: "Principal Software Engineer",
    start: "03/2023",
    end: "Present",
    location: "Remote — US client base",
    context:
      "Fleet operations platform (cloud SaaS) and urpay, a production digital wallet used across Saudi Arabia.",
    bullets: [
      "Architected backend infrastructure on AWS Amplify Gen 2, defining dev, staging and production environments as AWS CDK stacks (Infrastructure as Code).",
      "Built the fleet operations frontend in Vue 3 with the Composition API, including role-based access control (RBAC) for operators and administrators.",
      "Introduced AI-assisted development workflows using custom steering files, agent orchestration and automated hooks that generate design, requirements, backlog and task artifacts before implementation begins.",
      "Cut the time between a requirement landing and it shipping by approximately 35-40% through that requirement-to-implementation automation.",
      "Led full-cycle development of a React Native digital wallet handling peer-to-peer and international transfers, bill payments, card issuance and secure transaction flows with full audit logging, integrating third-party payment and KYC APIs.",
    ],
    stack:
      "AWS CDK, AWS Amplify Gen 2, Vue 3, React Native, TypeScript, Node.js, RBAC, CI/CD, agent orchestration",
  },
  {
    company: "Seven Invites",
    title: "Senior Software Engineer",
    start: "08/2021",
    end: "12/2022",
    location: "Remote — US",
    context: "Consumer social platform with payments and messaging.",
    bullets: [
      "Developed reusable React component libraries in TypeScript that reduced the feature development cycle by approximately 40%.",
      "Integrated Stripe payment processing with comprehensive validation, idempotency and error handling.",
      "Built scalable notification infrastructure on Twilio and Google Cloud Tasks with high delivery reliability.",
      "Contributed system architecture improvements for long-term maintainability and scalability.",
    ],
    stack: "React, TypeScript, Node.js, Stripe, Twilio, Google Cloud Tasks",
  },
  {
    company: "Neural Soft Solutions",
    title: "Software Developer",
    start: "07/2019",
    end: "08/2021",
    location: "Lahore, Pakistan",
    context: "Point-of-sale product with integrated digital payments.",
    bullets: [
      "Built and shipped a React Native point-of-sale application with integrated digital payment processing.",
      "Improved application response time by approximately 30% through performance profiling and optimisation.",
      "Partnered with UI/UX designers to raise product usability and user engagement.",
    ],
    stack: "React Native, JavaScript, REST APIs, Firebase",
  },
  {
    company: "The Bank of Punjab",
    title: "Software Developer",
    start: "11/2018",
    end: "07/2019",
    location: "Lahore, Pakistan",
    context: "Core banking data and internal reporting tooling.",
    bullets: [
      "Optimised Oracle SQL queries for an approximate 25% performance improvement.",
      "Automated operational reporting processes, saving 10+ hours of manual effort each week.",
      "Developed internal data tools in Oracle SQL and PL/SQL, with reporting surfaced through Power BI.",
    ],
    stack: "Oracle SQL, PL/SQL, Power BI",
  },
];

/**
 * Kept in its own section rather than merged into the chronology, because these
 * ran concurrently with full-time employment and a merged list would read as
 * overlapping tenure.
 */
export const cvFreelance: CvRole[] = [
  {
    company: "Frontier AI Lab (via evaluation partner)",
    title: "AI Model Evaluation & RLHF Engineer",
    start: "01/2025",
    end: "Present",
    location: "Remote — contract",
    context:
      "Evaluating coding agents and large language models against real repositories.",
    bullets: [
      "Write adversarial, multi-turn and long-horizon evaluations for coding agents, targeting the cases where an agent produces plausible but incorrect work.",
      "Review agent-generated pull requests against production code, judging correctness, test quality and prompt compliance rather than surface plausibility.",
      "Develop scoring rubrics and evaluation harnesses used to compare model versions across releases.",
      "Built and maintained an internal eval tooling platform end to end, covering task authoring, run orchestration and result review.",
      "Produce RLHF and human preference data, and prompt-engineering guidance derived from recurring model failure patterns.",
    ],
    stack:
      "Agent evaluation, RLHF, LLM benchmarking, prompt engineering, TypeScript, Python, Git",
  },
  {
    company: "MakolaHub",
    title: "Lead Engineer, B2B Marketplace",
    start: "05/2023",
    end: "Present",
    location: "Remote — Ghana",
    context:
      "B2B marketplace for Ghanaian businesses: products, services, job listings, RFQs and escrow. Sole engineer across four applications.",
    bullets: [
      "Sole engineer on the production monorepo covering the iOS app, Android app, web platform and backend.",
      "Shipped the React Native (Expo) application to the App Store and Google Play and maintained it through version 4.0.4.",
      "Built the Node.js and GraphQL backend handling search, payments, notifications and onboarding, deployed on Google App Engine.",
      "Added AI-powered supplier matchmaking using OpenAI embeddings over a Postgres vector store (retrieval-augmented generation).",
      "Consolidated six separate repositories into a single Nx monorepo, with shared CI/CD and typed contracts across clients.",
    ],
    stack:
      "React Native, Expo, Next.js, React, Node.js, GraphQL, Hasura, PostgreSQL, Firebase, Google Cloud, OpenAI, Nx",
  },
];

/**
 * AI first. ATS keyword scoring reads the skills block heavily, and the group
 * order is the cheapest signal available about what the candidate is aiming at.
 */
export const cvSkills = [
  {
    label: "AI & Agent Engineering",
    items:
      "Large language models (LLMs), AI agents, coding agents, agent orchestration, model evaluation, eval design, RLHF, human preference data, adversarial and red-team testing, rubric design, prompt engineering, retrieval-augmented generation (RAG), embeddings, vector databases, OpenAI API, AI-assisted SDLC",
  },
  {
    label: "Languages",
    items: "TypeScript, JavaScript (ES2023), Python, SQL, PL/SQL, HTML5, CSS3",
  },
  {
    label: "Frontend & Mobile",
    items:
      "React, React Native, Expo, Next.js, Vue 3 (Composition API), Redux, Tailwind CSS, responsive design, accessibility (WCAG)",
  },
  {
    label: "Backend & APIs",
    items:
      "Node.js, Express.js, NestJS, GraphQL, Hasura, REST API design, Strapi, Firebase, authentication and RBAC, webhooks",
  },
  {
    label: "Cloud & Infrastructure",
    items:
      "AWS (Amplify Gen 2, CDK, Lambda, S3), Infrastructure as Code, Google Cloud Platform (App Engine, Cloud Tasks), Vercel, CI/CD, Git, GitHub Actions, Nx monorepos",
  },
  {
    label: "Data & Performance",
    items:
      "PostgreSQL, MongoDB, Oracle SQL, Redis caching, query optimisation, pgvector, Power BI, application performance profiling",
  },
  {
    label: "Practices",
    items:
      "Agile/Scrum, code review, technical design documents, Jest and unit testing, mentoring, stakeholder communication, remote-first collaboration",
  },
] as const;

export const cvEducation = {
  degree: "BSc Computer Science",
  school: "Information Technology University (ITU), Lahore, Pakistan",
  start: "11/2013",
  end: "06/2018",
  focus:
    "Research areas: Artificial Intelligence, Human-Computer Interaction, Computer Vision, Mobile Development, Agile methodologies.",
} as const;

export const cvProjects = [
  {
    name: "urpay",
    line: "Digital wallet in Saudi Arabia. 4.6 stars across 155,000+ App Store reviews; transfers to 140+ countries. Lead React Native engineer.",
    url: "https://urpay.com.sa",
  },
  {
    name: "MakolaHub",
    line: "B2B marketplace live in Ghana across iOS, Android and web. Sole engineer. React Native, Next.js, GraphQL, OpenAI embeddings.",
    url: "https://makolahub.com",
  },
  {
    name: "shehryar-raza.dev",
    line: "Portfolio and case studies, built on Next.js 16 and React 19 with a Firebase-backed analytics portal.",
    url: "https://shehryar-raza.dev",
  },
] as const;
