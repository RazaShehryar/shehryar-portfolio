/**
 * Builds the in-browser app-preview screens from official App Store artwork.
 *
 * Why this exists: the "Preview on simulator" feature needs phone screens, and
 * the cleanest source is each app's App Store listing (fetched via the public
 * iTunes lookup API). The three apps come in two shapes:
 *
 *   - MakolaHub ships raw, full-bleed app screenshots — used as-is.
 *   - urpay ships marketing compositions (angled phones, headlines) that can't
 *     be reframed, so they feed a flat App Store-style gallery instead.
 *   - Votly ships marketing frames too, but with the app screen sitting upright
 *     and centred, so each is cropped down to just the screen. The crop box is
 *     a fixed fraction of the 1242x2208 source; the device frame's bezel hides
 *     the last hair of gradient at the edges.
 *
 * Output: public/projects/sim/{slug}-N.webp. Re-run with `npm run app:previews`
 * to refresh after a store update. Idempotent — it overwrites in place.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const OUT = resolve(process.cwd(), "public/projects/sim");

/** country=us keeps the artwork set stable across runs. */
const lookup = (id) => `https://itunes.apple.com/lookup?id=${id}&country=us`;

/** Swap the iTunes thumbnail size segment for a full-resolution render. */
const hires = (url) => url.replace(/\/[0-9]+x[0-9]+[a-z]{2}\.(jpg|png)$/, "/1290x2796bb.png");

const apps = [
  {
    slug: "makolahub",
    id: "6745556298",
    // Raw app screens; keep the first four.
    take: [0, 1, 2, 3],
    crop: null,
    width: 620,
  },
  {
    slug: "urpay",
    id: "1585778338",
    // Marketing shots shown flat in the gallery; keep all six.
    take: [0, 1, 2, 3, 4, 5],
    crop: null,
    width: 560,
  },
  {
    slug: "votly",
    id: "1598662251",
    take: [0, 1, 2, 3, 4],
    // Fractions of the 1242x2208 source: drop the headline band and the
    // gradient margins around the upright phone.
    crop: { topPct: 0.15, sidePct: 0.088, botPct: 0.03 },
    width: 600,
  },
];

async function screenshotUrls(id) {
  const res = await fetch(lookup(id));
  if (!res.ok) throw new Error(`iTunes lookup ${id} failed: ${res.status}`);
  const { results } = await res.json();
  if (!results?.length) throw new Error(`No listing for ${id}`);
  return results[0].screenshotUrls ?? [];
}

async function run() {
  await mkdir(OUT, { recursive: true });

  for (const app of apps) {
    const urls = await screenshotUrls(app.id);
    let n = 0;

    for (const idx of app.take) {
      const url = urls[idx];
      if (!url) {
        console.warn(`  ${app.slug}: no screenshot at index ${idx}, skipping`);
        continue;
      }

      const buf = Buffer.from(await (await fetch(hires(url))).arrayBuffer());
      let img = sharp(buf);

      if (app.crop) {
        const { width: w, height: h } = await img.metadata();
        const top = Math.round(h * app.crop.topPct);
        const left = Math.round(w * app.crop.sidePct);
        img = sharp(buf).extract({
          left,
          top,
          width: w - left * 2,
          height: h - top - Math.round(h * app.crop.botPct),
        });
      }

      n += 1;
      const out = resolve(OUT, `${app.slug}-${n}.webp`);
      await img.resize({ width: app.width }).webp({ quality: 82 }).toFile(out);
    }

    console.log(`  ${app.slug}: wrote ${n} screens`);
  }
}

run().then(
  () => console.log(`Done -> ${OUT}`),
  (err) => {
    console.error(err.message);
    process.exit(1);
  },
);
