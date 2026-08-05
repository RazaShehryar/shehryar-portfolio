import Link from "next/link";
import {
  cvAchievements,
  cvAiHighlights,
  cvContact,
  cvEducation,
  cvExperience,
  cvFreelance,
  cvProjects,
  cvSkills,
  cvSummary,
  type CvRole,
} from "@/lib/cv";

/**
 * The CV as a real HTML page.
 *
 * Everything here is shaped around two readers that are not human: applicant
 * tracking systems, which parse the PDF this prints to, and search engines,
 * which can index HTML but barely index a PDF. That constrains the design more
 * than the rest of the site — single column, no CSS grid columns, no images,
 * no icons standing in for words, standard section headings ("Professional
 * Experience", not "Where I've been"), and every link written out as text as
 * well as marked up as an anchor, because a parser that drops the href still
 * needs to read the URL.
 *
 * It renders outside the `(site)` route group on purpose: no intro curtain, no
 * aurora, no scroll hijacking, nothing that interferes with print.
 */
export function CvDocument({
  /**
   * The phone number belongs in the PDF a recruiter downloads, not in HTML
   * that address harvesters crawl. Only `/cv/print` — the page the PDF build
   * prints from, which is noindexed and disallowed in robots.txt — sets this.
   */
  showPhone = false,
}: {
  showPhone?: boolean;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateModified: "2026-08-05",
    mainEntity: {
      "@type": "Person",
      name: cvContact.name,
      jobTitle: "Principal Software Engineer",
      description: cvSummary,
      url: cvContact.websiteUrl,
      email: `mailto:${cvContact.email}`,
      ...(showPhone ? { telephone: cvContact.phone } : {}),
      sameAs: [cvContact.linkedinUrl, cvContact.githubUrl],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Information Technology University (ITU), Lahore",
      },
      worksFor: cvExperience.slice(0, 1).map((r) => ({
        "@type": "Organization",
        name: r.company,
      })),
      knowsAbout: [
        "Large language models",
        "AI agent evaluation",
        "RLHF",
        "Prompt engineering",
        "Retrieval-augmented generation",
        "React",
        "React Native",
        "Next.js",
        "Vue 3",
        "Node.js",
        "TypeScript",
        "Python",
        "GraphQL",
        "AWS CDK",
        "Infrastructure as Code",
        "PostgreSQL",
        "Fintech",
        "Digital payments",
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Static, author-controlled object; no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{css}</style>

      <div className="cv-shell">
        <div className="cv-actions">
          <Link href="/">← Back to site</Link>
          {/* A real file, not a route — plain anchor with download intent. */}
          <a href="/Shehryar_Raza_Resume.pdf" download>
            Download PDF
          </a>
        </div>

        <article className="cv">
          <header>
            <h1>{cvContact.name}</h1>
            <p className="headline">{cvContact.headline}</p>
            {/* Contact details as text, in the body. Never a header, never an
                icon: an ATS reads none of those. */}
            <p className="contact">
              {cvContact.location}
              {" · "}
              <a href={`mailto:${cvContact.email}`}>{cvContact.email}</a>
              {showPhone && (
                <>
                  {" · "}
                  <a href={`tel:${cvContact.phone.replace(/\s/g, "")}`}>{cvContact.phone}</a>
                </>
              )}
            </p>
            <p className="contact">
              <a href={cvContact.linkedinUrl}>{cvContact.linkedin}</a>
              {" · "}
              <a href={cvContact.githubUrl}>{cvContact.github}</a>
              {" · "}
              <a href={cvContact.websiteUrl}>{cvContact.website}</a>
            </p>
          </header>

          <Section title="Professional Summary">
            <p>{cvSummary}</p>
          </Section>

          <Section title="AI & Agent Engineering Highlights">
            <ul>
              {cvAiHighlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </Section>

          <Section title="Key Achievements">
            <ul>
              {cvAchievements.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Section>

          <Section title="Professional Experience">
            {cvExperience.map((role) => (
              <Role key={`${role.company}-${role.start}`} role={role} />
            ))}
          </Section>

          <Section title="Freelance & Contract Engagements">
            {cvFreelance.map((role) => (
              <Role key={`${role.company}-${role.start}`} role={role} />
            ))}
          </Section>

          <Section title="Technical Skills">
            <dl className="skills">
              {cvSkills.map((g) => (
                <div key={g.label}>
                  <dt>{g.label}:</dt>
                  <dd>{g.items}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="Selected Projects">
            <ul>
              {cvProjects.map((p) => (
                <li key={p.name}>
                  <strong>{p.name}</strong> (<a href={p.url}>{p.url.replace(/^https?:\/\//, "")}</a>
                  ) — {p.line}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Education">
            <div className="role-head">
              <h3>
                {cvEducation.degree} — {cvEducation.school}
              </h3>
              <span className="dates">
                {cvEducation.start} – {cvEducation.end}
              </span>
            </div>
            <p className="context">{cvEducation.focus}</p>
          </Section>
        </article>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Role({ role }: { role: CvRole }) {
  return (
    <div className="role">
      <div className="role-head">
        <h3>
          {role.title} — {role.company}
        </h3>
        <span className="dates">
          {role.start} – {role.end}
        </span>
      </div>
      <p className="meta">{role.location}</p>
      {role.context && <p className="context">{role.context}</p>}
      <ul>
        {role.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <p className="stack">
        <strong>Technologies:</strong> {role.stack}
      </p>
    </div>
  );
}

/**
 * Written as plain CSS rather than utility classes so the print rules stay
 * legible and so nothing depends on the dark theme tokens the rest of the site
 * uses. Arial keeps the embedded font boring, which is what PDF text
 * extractors want.
 */
const css = `
:root { color-scheme: light; }
body { background: #f4f4f6 !important; color: #111 !important; }
body::after { display: none !important; }

.cv-shell {
  --ink: #14141a;
  --sub: #444450;
  --rule: #c9c9d2;
  font-family: Arial, Helvetica, sans-serif;
  padding: 2rem 1rem 4rem;
}

.cv-actions {
  max-width: 8.5in;
  margin: 0 auto 1rem;
  display: flex;
  gap: 1rem;
  font-size: 13px;
}
.cv-actions a { color: #0b57d0; text-decoration: none; }
.cv-actions a:hover { text-decoration: underline; }

.cv {
  max-width: 8.5in;
  margin: 0 auto;
  background: #fff;
  color: var(--ink);
  padding: 0.7in 0.75in;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  font-size: 10.5pt;
  line-height: 1.42;
}

.cv h1 {
  font-size: 21pt;
  font-weight: 700;
  letter-spacing: 0.01em;
  margin: 0 0 2px;
}
.cv .headline { font-size: 11pt; font-weight: 700; color: var(--sub); margin: 0 0 6px; }
.cv .contact { font-size: 9.5pt; color: var(--sub); margin: 0 0 2px; }
.cv header { margin-bottom: 14px; }

.cv h2 {
  font-size: 11pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 3px;
  margin: 16px 0 8px;
}

.cv h3 { font-size: 10.5pt; font-weight: 700; margin: 0; }

.cv p { margin: 0 0 6px; }

.cv .role { margin-bottom: 12px; }
.cv .role-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}
.cv .dates { font-size: 9.5pt; color: var(--sub); white-space: nowrap; }
.cv .meta { font-size: 9.5pt; color: var(--sub); margin: 0 0 3px; }
.cv .context { font-size: 9.5pt; color: var(--sub); font-style: italic; margin: 0 0 5px; }
.cv .stack { font-size: 9.5pt; color: var(--sub); margin: 4px 0 0; }

.cv ul { margin: 0 0 4px; padding-left: 17px; }
.cv li { margin-bottom: 3px; }

.cv .skills div { margin-bottom: 4px; }
.cv .skills dt { display: inline; font-weight: 700; }
.cv .skills dd { display: inline; margin: 0; }

.cv a { color: inherit; text-decoration: none; }
.cv header a { text-decoration: underline; }

/* The PDF is what an ATS parses and what a recruiter skims, so it is tuned
   for density: a principal-level history has to read as two pages, not four.
   Everything below shrinks type, leading and spacing for print only; the
   on-screen version stays comfortable. */
@page { size: Letter; margin: 0.4in 0.5in; }

@media print {
  body { background: #fff !important; }
  .cv-shell { padding: 0; }
  .cv-actions { display: none; }
  .cv {
    box-shadow: none;
    max-width: none;
    padding: 0;
    font-size: 9pt;
    line-height: 1.26;
  }
  .cv h1 { font-size: 17pt; }
  .cv .headline { font-size: 9.5pt; margin-bottom: 3px; }
  .cv .contact { font-size: 8pt; }
  .cv header { margin-bottom: 8px; }
  .cv h2 { font-size: 9.5pt; margin: 7px 0 4px; break-after: avoid; }
  .cv h3 { font-size: 9.5pt; }
  .cv p { margin-bottom: 2px; }
  .cv .role { margin-bottom: 6px; }
  .cv .skills div { margin-bottom: 2px; }
  .cv .dates, .cv .meta, .cv .context, .cv .stack { font-size: 8.5pt; }
  .cv ul { padding-left: 15px; }
  .cv li { margin-bottom: 2px; break-inside: avoid; }
  .cv .role, .cv section { break-inside: auto; }
  .cv .role-head { break-inside: avoid; break-after: avoid; }
}
`;
