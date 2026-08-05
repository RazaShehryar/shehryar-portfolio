/**
 * Prints /cv to public/Shehryar_Raza_Resume.pdf using headless Chrome.
 *
 * Chrome is used rather than a PDF library because it is the only thing to
 * hand that emits what an ATS actually needs: selectable text with a proper
 * ToUnicode map, real bullet glyphs, and link annotations for the email,
 * phone and profile URLs. The previous CV was a Pages export and had none of
 * the last of those — zero /URI entries in the whole file.
 *
 * Usage (with the dev server or a production build already serving):
 *   node scripts/build-cv-pdf.mjs [url]
 */

import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error("No Chrome or Chromium found. Checked:\n  " + CHROME_CANDIDATES.join("\n  "));
  process.exit(1);
}

const url = process.argv[2] ?? "http://localhost:3000/cv";
const out = resolve(process.cwd(), "public/Shehryar_Raza_Resume.pdf");

console.log(`Printing ${url} -> ${out}`);

execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--no-pdf-header-footer",
    // Gives fonts and hydration time to settle before the snapshot.
    "--virtual-time-budget=10000",
    `--print-to-pdf=${out}`,
    url,
  ],
  { stdio: "inherit" },
);

if (!existsSync(out)) {
  console.error("Chrome exited without writing the PDF.");
  process.exit(1);
}

console.log(`Wrote ${out} (${Math.round(statSync(out).size / 1024)} KB)`);
