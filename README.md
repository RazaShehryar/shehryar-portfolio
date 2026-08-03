# shehryar-raza.dev

Personal portfolio for Shehryar Raza — Principal Software Engineer.

Live at **[shehryar-raza.dev](https://shehryar-raza.dev)**.

## Stack

- **Next.js 16** (App Router, Turbopack) — server-rendered for SEO
- **Tailwind CSS v4** for styling
- **Motion** for the scroll-driven project showcase
- **Firebase / Firestore** — contact form and per-project view counters, client side only

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in the Firebase web config
npm run dev
```

## Firebase

The site talks to Firestore straight from the browser, so `firestore.rules` is
the only access control. It allows exactly two things:

- creating a well-formed document in `contacts` (no reads, edits or deletes)
- incrementing a `views/{slug}` counter by exactly one

Deploy rule changes with:

```bash
firebase deploy --only firestore:rules
```

## Content

Copy and project data live in `src/lib/site.ts` and `src/lib/projects.ts`.
Screenshots are in `public/projects/`.
