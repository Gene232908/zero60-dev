#!/usr/bin/env node
/**
 * Derives the DARK brand mark used by 063 Society.
 *
 * Why this exists: the mark the client supplied first is white and lime, which
 * disappears against Society's off-white paper ground. docs/ASSET-REQUEST.md §62
 * and docs/HANDOFF-DEV2.md §5 both raised this as an open question — "we need a
 * dark variant before Society mode reaches the header and footer". Management
 * has now supplied it as public/zero63logo-black.png.
 *
 * That file is the raw 2000x2000 export at ~1.8MB. Shipping it as-is would send
 * a two-megapixel PNG to a 36px header slot, so it is trimmed and resized here
 * exactly the way Developer 1 derived the light mark in public/brand/.
 *
 * Committed outputs, regenerable at any time:
 *   public/brand/logo-mark-dark.webp   512px, what the header actually loads
 *   public/brand/logo-mark-dark.png    512px, fallback / non-webp consumers
 *
 *   node scripts/generate-society-mark.mjs
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(ROOT, 'public', 'zero63logo-black.png');
const SIZE = 512;

async function main() {
  // `trim` removes the flat surround the export carries, so the glyph fills its
  // box and the header can size it by height without a ring of dead padding.
  const base = sharp(SOURCE)
    .trim()
    .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });

  await base.clone().webp({ quality: 90 }).toFile(join(ROOT, 'public', 'brand', 'logo-mark-dark.webp'));
  await base.clone().png({ compressionLevel: 9 }).toFile(join(ROOT, 'public', 'brand', 'logo-mark-dark.png'));

  console.log(`logo-mark-dark.{webp,png} written at ${SIZE}px from ${SOURCE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
