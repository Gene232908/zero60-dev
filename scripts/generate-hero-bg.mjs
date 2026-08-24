#!/usr/bin/env node
/**
 * Prepares the hero background plate.
 *
 * Source: public/src/herobg.jpg — a 1366x768 JPEG at ~1.34MB, supplied by
 * management. It is the right photograph for the opening of an event-production
 * site (truss, movers, flight cases, an empty stage before doors) but it cannot
 * ship as-is:
 *
 *   1. WEIGHT. 1.34MB for a 1366px frame is barely compressed, and this image is
 *      `priority` — it blocks LCP on every first visit to the landing page.
 *   2. COLOUR. The original carries a warm pink/green cast from the sky and the
 *      LED wall. Against the confirmed palette (#ADFF2A on black) that cast
 *      fights the brand, so the plate is desaturated here and re-tinted in CSS.
 *      This is the same treatment content/media.ts documents for every other
 *      photograph on the site, and the duotone device plan.md §2.5 calls for.
 *   3. CONTRAST. The upper half is bright sky and white LED wall. White display
 *      type over that is unreadable, so the plate is pulled down and the
 *      mid-tones compressed before any CSS scrim is applied on top.
 *
 * The tint itself is deliberately NOT baked in. Keeping the plate neutral means
 * the lime comes from var(--accent) at render time, so the one confirmed brand
 * colour has exactly one source of truth.
 *
 * Committed output, regenerable at any time:
 *   public/media/hero-bg.webp    1600px wide, grayscale, ~10x smaller
 *
 *   node scripts/generate-hero-bg.mjs
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, statSync } from 'node:fs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'public', 'src', 'herobg.jpg');
const OUT = join(ROOT, 'public', 'media', 'hero-bg.webp');

if (!existsSync(SRC)) {
  console.error(`generate-hero-bg: source missing at ${SRC}`);
  process.exit(1);
}

const before = statSync(SRC).size;

await sharp(SRC)
  // Upscale slightly past the source width so the plate still holds up on a
  // wide desktop hero. The source is only 1366px, so this is the ceiling before
  // it goes visibly soft — flagged with the other B2 resolution limits.
  .resize({ width: 1600, withoutEnlargement: false })
  .grayscale()
  .modulate({ brightness: 0.82 })
  // Lift the blacks slightly while crushing the bright sky, so the plate reads
  // as one dark field rather than a bright top and a dark bottom.
  .linear(0.88, -6)
  .webp({ quality: 74, effort: 6 })
  .toFile(OUT);

const after = statSync(OUT).size;
const pct = (100 - (after / before) * 100).toFixed(1);
console.log(
  `generate-hero-bg: ${OUT}\n  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (-${pct}%)`,
);
