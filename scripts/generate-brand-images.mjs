#!/usr/bin/env node
/**
 * Generates the committed brand image assets — Developer 1, Milestone 4 EASY
 * ("Add the favicon, browser tab titles and the social share image").
 *
 * Everything here is derived from assets the client has ALREADY supplied:
 *   - public/brand/logo-mark.png   the real logo mark (received, Milestone 1)
 *   - the confirmed palette         #ADFF2A lime / #FFFFFF / #000000
 *   - content/site.ts BRAND         the real wordmark, transcribed verbatim
 *
 * Nothing is invented. BLOCKER B17 (social-share art *direction*) is still open,
 * so the OG image is deliberately a straight brand lock-up rather than a
 * campaign image — it can be replaced without touching any code once management
 * gives direction.
 *
 * The outputs are committed to the repo; this script exists so they can be
 * regenerated deterministically instead of being untraceable binaries.
 *
 *   node scripts/generate-brand-images.mjs
 *
 * Outputs:
 *   app/favicon.ico          16 + 32 + 48 px, PNG-encoded entries
 *   app/icon.png             512 px  (browser / PWA)
 *   app/apple-icon.png       180 px  (iOS home screen — no alpha, per Apple)
 *   app/opengraph-image.png  1200x630 social share card
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOGO = join(ROOT, 'public', 'brand', 'logo-mark.png');

/** Confirmed palette — styles/tokens.css is the source of truth for these. */
const LIME = '#ADFF2A';
const INK = '#0A0A0A';

/**
 * App icon — the "063" short mark, lime on brand black.
 *
 * NOT the circular logo badge. That badge is a detailed mic-and-headphones
 * illustration wrapped in a ring of type; rendered at 16-32px it collapses into
 * an unreadable smudge (verified before choosing this). "063" is the client's
 * own short mark (content/site.ts → BRAND.short) and stays sharp at every size,
 * so the tab is identifiable at a glance. The full badge is used on the OG card,
 * where there is room for it to read.
 *
 * The mark is always drawn on opaque black: the brand art is light-on-transparent
 * and would vanish against a light browser tab.
 */
async function icon(size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="${INK}"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
        font-family="Arial Black, Archivo, Helvetica, sans-serif"
        font-size="${size * 0.46}" font-weight="900"
        letter-spacing="${size * -0.012}" fill="${LIME}">063</text>
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

/**
 * ICO container with PNG-encoded entries.
 *
 * Layout: 6-byte ICONDIR, then one 16-byte ICONDIRENTRY per image, then the
 * PNG payloads. A width/height byte of 0 means 256 — not reachable at our sizes,
 * but encoded correctly anyway.
 */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  const entries = [];
  let offset = 6 + pngs.length * 16;

  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette colour count (0 = truecolour)
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

/**
 * Social share card. Built as an SVG so the composition stays editable, then
 * rasterised once and committed — the shipped artefact is the PNG.
 *
 * Type is set in a heavy grotesque stack standing in for Archivo (the site's
 * display face); web fonts are not available to the SVG rasteriser, and the
 * card only has to read as the brand, not match the site pixel for pixel.
 */
async function openGraph() {
  const W = 1200;
  const H = 630;
  const markSize = 300;

  const markPng = await sharp(LOGO)
    .resize(markSize, markSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${INK}"/>

  <!-- hairline frame: the restrained half of the brand's motion language -->
  <rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none"
        stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1"/>

  <!-- lime signal bar: "lime is a spice, not a sauce" (plan.md §2.1) -->
  <rect x="48" y="48" width="180" height="6" fill="${LIME}"/>

  <text x="96" y="300" font-family="Arial Black, Archivo, Helvetica, sans-serif"
        font-size="96" font-weight="900" letter-spacing="2" fill="#FFFFFF">ZERO</text>
  <text x="96" y="392" font-family="Arial Black, Archivo, Helvetica, sans-serif"
        font-size="96" font-weight="900" letter-spacing="2" fill="#FFFFFF">SIXTY</text>
  <text x="96" y="484" font-family="Arial Black, Archivo, Helvetica, sans-serif"
        font-size="96" font-weight="900" letter-spacing="2" fill="${LIME}">THREE</text>

  <text x="100" y="540" font-family="Arial, Helvetica, sans-serif"
        font-size="22" letter-spacing="9" fill="#FFFFFF" fill-opacity="0.55">PRODUCTIONS</text>
</svg>`;

  return sharp(Buffer.from(svg))
    .composite([{ input: markPng, top: 120, left: W - markSize - 110 }])
    .png()
    .toBuffer();
}

// ---------------------------------------------------------------- run --------

const ico = buildIco(
  await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await icon(size) }))),
);
writeFileSync(join(ROOT, 'app', 'favicon.ico'), ico);

writeFileSync(join(ROOT, 'app', 'icon.png'), await icon(512));

// Apple flattens alpha to black anyway; write it opaque so it is predictable.
writeFileSync(
  join(ROOT, 'app', 'apple-icon.png'),
  await sharp(await icon(180)).flatten({ background: INK }).png().toBuffer(),
);

writeFileSync(join(ROOT, 'app', 'opengraph-image.png'), await openGraph());

const sizeOf = (p) => `${(readFileSync(join(ROOT, p)).length / 1024).toFixed(1)} kB`;
for (const p of ['app/favicon.ico', 'app/icon.png', 'app/apple-icon.png', 'app/opengraph-image.png']) {
  console.log(`  wrote ${p.padEnd(28)} ${sizeOf(p)}`);
}
