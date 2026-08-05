"use client";

import { useEffect, useRef, useState } from "react";
import { addDoc, collection, doc, increment, serverTimestamp, setDoc } from "firebase/firestore";
import { dayKey } from "@/lib/analytics";
import { trackEvent } from "@/lib/track-event";
import { Check, Loader2, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { getDb } from "@/lib/firebase";
import { site } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";

type State = "idle" | "sending" | "sent" | "error";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Two minutes between submissions from one browser. */
const COOLDOWN_MS = 2 * 60 * 1000;
const LAST_SENT_KEY = "contact-last-sent";

/**
 * How long a real person needs to read the form and type a message. Anything
 * faster is a script that filled every field the moment the page loaded.
 */
const MIN_FILL_MS = 3000;

export function Contact() {
  const [state, setState] = useState<State>("idle");
  const startedRef = useRef(false);
  // Stamped on mount rather than during render: `Date.now()` in a render body
  // is impure, and a re-render would quietly restart the clock.
  const mountedAt = useRef(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    // The honeypot is hidden from people and from screen readers, so only a
    // bot filling every field it finds will have touched it. Report success:
    // telling a spammer why it failed only helps it try again.
    if (String(data.get("company") ?? "")) {
      form.reset();
      return setState("sent");
    }

    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      return fail("That was quick — give it another moment and try again.");
    }

    // Firestore is written to straight from the browser, so this and the
    // honeypot are the only throttle in front of it. Neither survives a
    // determined script, but both stop the drive-by ones.
    const last = Number(readStorage(LAST_SENT_KEY) ?? 0);
    if (last && Date.now() - last < COOLDOWN_MS) {
      return fail("You've just sent one. Give it a couple of minutes.");
    }

    // Mirror the Firestore rules so a bad submission fails here, not there.
    if (!name || name.length > 100) return fail("Please enter your name.");
    if (!EMAIL.test(email) || email.length > 200) return fail("That email doesn't look right.");
    if (!message || message.length > 4000) return fail("Please write a short message.");

    const db = getDb();
    if (!db) return fail("The form isn't available right now — email me instead.");

    setState("sending");
    setError(null);

    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      });

      // Bump the day's enquiry counter for the nightly report. A failure here
      // must not make a delivered message look like it failed.
      try {
        await setDoc(
          doc(db, "contactStats", dayKey(new Date())),
          { count: increment(1) },
          { merge: true },
        );
      } catch {
        /* counter only — the message itself is already saved */
      }

      writeStorage(LAST_SENT_KEY, String(Date.now()));
      trackEvent("contact_sent");
      setState("sent");
      form.reset();
    } catch {
      fail("Something went wrong sending that. Email me directly and it'll reach me.");
    }

    function fail(msg: string) {
      setError(msg);
      setState("error");
    }
  }

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[45vh] w-[70vw] -translate-x-1/2 rounded-full bg-accent/8 blur-[150px]"
      />

      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Say hello"
            lead="Happy to talk about product work, or anything involving coding agents. I read everything, and I reply to most of it."
          />

          <Reveal delay={0.1}>
            <div className="space-y-2">
              <Row icon={<Mail className="h-4 w-4" />} href={`mailto:${site.email}`} label={site.email} />
              <Row icon={<GithubIcon className="h-4 w-4" />} href={site.github} label="github.com/RazaShehryar" />
              <Row icon={<LinkedinIcon className="h-4 w-4" />} href={site.linkedin} label="linkedin.com/in/shehryarraza" />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <form
            onSubmit={onSubmit}
            onFocusCapture={() => {
              // Fires once: the funnel needs starts, not keystrokes.
              if (!startedRef.current) {
                startedRef.current = true;
                trackEvent("contact_start");
              }
            }}
            className="rounded-2xl border border-line bg-white/[0.02] p-6 sm:p-8"
          >
            <div className="space-y-5">
              <Field label="Name" name="name" type="text" placeholder="Your name" />
              <Field label="Email" name="email" type="email" placeholder="you@company.com" />

              {/* Honeypot. Hidden rather than `display: none` so bots that skip
                  undisplayed fields still fill it, and `aria-hidden` with a
                  negative tab index so nobody using the form ever reaches it. */}
              <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-[0.14em] text-faint">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  maxLength={4000}
                  placeholder="What are you working on?"
                  className="w-full resize-none rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-faint focus:border-accent/60"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={state === "sending" || state === "sent"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-ink transition-all hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-70"
              >
                {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
                {state === "sent" && <Check className="h-4 w-4" />}
                {state === "sent" ? "Message sent" : state === "sending" ? "Sending" : "Send message"}
              </button>

              {state === "sent" && (
                <p className="text-center text-sm text-emerald-400">
                  Thanks — I&apos;ll get back to you shortly.
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/** localStorage throws outright in some private modes, so both are wrapped. */
function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* the cooldown is a courtesy, not a guarantee */
  }
}

function Field({
  label,
  name,
  type,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs uppercase tracking-[0.14em] text-faint">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        maxLength={type === "email" ? 200 : 100}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-faint focus:border-accent/60"
      />
    </div>
  );
}

function Row({
  icon,
  href,
  label,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-muted transition-colors hover:border-line hover:bg-white/[0.02] hover:text-fg"
    >
      <span className="text-accent">{icon}</span>
      {label}
    </a>
  );
}
