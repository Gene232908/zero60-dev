#!/usr/bin/env node
/**
 * MEDIA PIPELINE — turns the supplied originals into what the site ships.
 *
 * Source:  assets/originals/*.jpg   originals from management, 5MP-30MP, ~66MB total
 *          Deliberately OUTSIDE public/: everything in public/ is copied into the
 *          deployment, so leaving 66MB of unused originals there would ship them
 *          to the CDN and make every deploy carry them. Only the derived
 *          public/media/*.webp is served.
 * Output:  public/media/*.webp
 *
 * Three problems this solves, in order of how much they matter:
 *
 * 1. CROPPING. Every slot in the layout has a fixed aspect ratio, and most of the
 *    originals do not match it — nine of them need 47–58% of the frame removed
 *    (a 3:2 landscape becoming a 2:3 portrait throws away 56% of the width).
 *    A centre crop would cut the subject in half on those, so every entry is
 *    cropped with sharp's `attention` strategy, which keeps the highest-detail
 *    region rather than the middle. Where that still picks badly, the entry gets
 *    an explicit `position` override below — those are recorded, not guessed.
 *
 *    Because the output is cropped to EXACTLY the ratio the layout asks for,
 *    `object-cover` in the browser has nothing left to trim. What is verified
 *    here is what ships.
 *
 * 2. WEIGHT. 30MP originals cannot go near a web page. Each is resized to the
 *    size the layout actually renders at (2x for retina) and encoded to WebP.
 *    next/image then derives smaller variants per device on top of this.
 *
 * 3. COLOUR. Photographs ship in FULL COLOUR and are desaturated in CSS instead,
 *    so the greyscale-to-colour hover reveal has something to reveal. The one
 *    exception is the hero plate, which is a background rather than an image and
 *    is flattened here so no filter has to run on a full-screen element.
 *
 *   node scripts/generate-media.mjs            process everything
 *   node scripts/generate-media.mjs hero-main  process one entry
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, statSync, mkdirSync } from 'node:fs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets', 'originals');
const OUT = join(ROOT, 'public', 'media');

/**
 * `w` is the rendered CSS width doubled for retina. `ratio` MUST match the
 * layout's aspect box — see docs/IMAGE-CHECKLIST.pdf, which was generated from
 * the components themselves.
 *
 * `position` overrides the attention crop. Set it only after LOOKING at the
 * output; the value records a decision, not a preference.
 */
const MANIFEST = [
  // ---- hero -------------------------------------------------------------
  { src: 'hero-bg',        ratio: [16, 9],  w: 2560, plate: true, q: 80,
    note: 'full-screen background plate — flattened to greyscale here' },
  // NOTE: the supplied plate is already a very dark, hazy shot of lit lanterns.
  // The original pipeline darkened it further (the previous source was a bright
  // daytime frame that needed pulling down) and the result was nearly solid
  // black — it threw away the lights, which are the only thing in the picture.
  // The plate is now LIFTED instead, and the scrims in globals.css were eased to
  // match. See PLATE_TUNING below.
  { src: 'hero-main',      ratio: [4, 5],   w: 1200, position: 'attention' },
  { src: 'hero-detail',    ratio: [5, 4],   w: 1000, position: 'attention' },

  // ---- the two houses ---------------------------------------------------
  { src: 'sound-engineer', ratio: [4, 3],   w: 1600, position: 'attention' },
  { src: 'society-main',   ratio: [4, 5],   w: 1200, position: 'attention' },

  // ---- about tiles (a set — same ratio, same treatment) ------------------
  { src: 'tile-guitar',    ratio: [2, 3],   w: 1000, position: 'attention' },
  { src: 'tile-mixer',     ratio: [2, 3],   w: 1000, position: 'attention' },
  { src: 'tile-stage',     ratio: [2, 3],   w: 1000, position: 'attention' },
  { src: 'tile-camera-op', ratio: [2, 3],   w: 1000, position: 'attention' },
  { src: 'tile-camera',    ratio: [2, 3],   w: 1000, position: 'attention' },
  { src: 'video-camera',   ratio: [3, 4],   w: 1200, position: 'attention' },

  // ---- event category previews (small on screen, must read instantly) ----
  { src: 'ev-corporate',   ratio: [4, 3],   w: 800,  position: 'attention' },
  { src: 'ev-concert',     ratio: [4, 3],   w: 800,  position: 'attention' },
  { src: 'ev-wedding',     ratio: [4, 3],   w: 800,  position: 'attention' },
  { src: 'ev-sports',      ratio: [4, 3],   w: 800,  position: 'attention' },
  { src: 'ev-community',   ratio: [4, 3],   w: 800,  position: 'attention' },
  { src: 'ev-themed',      ratio: [4, 3],   w: 800,  position: 'attention' },

  // ---- services bento ---------------------------------------------------
  { src: 'audio-desk-top', ratio: [4, 3],   w: 1600, position: 'attention' },
  { src: 'dj-decks',       ratio: [4, 3],   w: 1200, position: 'attention' },
  { src: 'photo-lens',     ratio: [4, 3],   w: 1200, position: 'attention' },
  { src: 'bento-sports',   ratio: [4, 3],   w: 1200, position: 'attention' },
  { src: 'bento-emcee',    ratio: [4, 3],   w: 1200, position: 'attention' },

  // ---- 063 society ------------------------------------------------------
  { src: 'society-wide',   ratio: [3, 2],   w: 1800, position: 'attention' },
  { src: 'society-tall',   ratio: [4, 5],   w: 1200, position: 'attention' },

  // ---- wide bands + portfolio -------------------------------------------
  { src: 'stage-truss',    ratio: [21, 9],  w: 2560, position: 'attention' },
  { src: 'portfolio-02',   ratio: [4, 3],   w: 1600, position: 'attention' },
  { src: 'portfolio-03',   ratio: [4, 3],   w: 1600, position: 'attention' },
];

const POS = {
  attention: sharp.strategy.attention,
  entropy: sharp.strategy.entropy,
};

function resolvePosition(p) {
  if (!p || p === 'attention') return POS.attention;
  if (p === 'entropy') return POS.entropy;
  return p; // 'top' | 'north' | 'centre' | 'left top' | ...
}

const only = process.argv[2];
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

let totalIn = 0;
let totalOut = 0;
const results = [];

for (const item of MANIFEST) {
  if (only && item.src !== only) continue;

  const inPath = join(SRC, `${item.src}.jpg`);
  const outPath = join(OUT, `${item.src}.webp`);

  if (!existsSync(inPath)) {
    results.push({ src: item.src, status: 'MISSING SOURCE' });
    continue;
  }

  const [rw, rh] = item.ratio;
  const width = item.w;
  const height = Math.round((width * rh) / rw);

  let pipe = sharp(inPath).resize({
    width,
    height,
    fit: 'cover',
    position: resolvePosition(item.position),
    withoutEnlargement: false,
  });

  if (item.plate) {
    // The hero plate is a background, not a photograph on the page. Flattening
    // it here means no filter has to run across a full-screen element, and the
    // scrims in globals.css are tuned against these exact values.
    // Lift, do not crush. Grayscale keeps it on-brand (plan.md §2.1 — the
    // photographic base is black and white) and lets the lime beams and the
    // accent read as the only colour in the composition.
    pipe = pipe.grayscale().modulate({ brightness: 1.32 }).linear(1.12, -4);
  }

  await pipe.webp({ quality: item.q ?? 82, effort: 6 }).toFile(outPath);

  const inSize = statSync(inPath).size;
  const outSize = statSync(outPath).size;
  totalIn += inSize;
  totalOut += outSize;

  results.push({
    src: item.src,
    status: 'ok',
    dims: `${width}x${height}`,
    ratio: `${rw}:${rh}`,
    from: `${(inSize / 1024 / 1024).toFixed(1)}MB`,
    to: `${(outSize / 1024).toFixed(0)}KB`,
  });
}

for (const r of results) {
  if (r.status !== 'ok') {
    console.log(`  ${r.src.padEnd(18)} ${r.status}`);
    continue;
  }
  console.log(
    `  ${r.src.padEnd(18)} ${r.dims.padEnd(11)} ${r.ratio.padEnd(6)} ${r.from.padStart(7)} -> ${r.to.padStart(7)}`,
  );
}

if (totalIn) {
  console.log(
    `\n  TOTAL  ${(totalIn / 1024 / 1024).toFixed(1)}MB -> ${(totalOut / 1024 / 1024).toFixed(2)}MB ` +
      `(-${(100 - (totalOut / totalIn) * 100).toFixed(1)}%)`,
  );
}
