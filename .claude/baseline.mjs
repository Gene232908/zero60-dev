#!/usr/bin/env node
/**
 * Design baseline snapshot — the "ENHANCE, DON'T REPLACE" contract.
 *
 * Captured ONCE at the pre-enhancement commit. Milestone 5's gate diffs the
 * live tree against this file, so the craft pass can freely rewrite motion,
 * states and detail INSIDE a section but cannot silently redesign the site:
 * no reordering pages, no dropping or swapping sections, no repainting the
 * client-confirmed palette.
 *
 * Regenerating this file is itself the tell that a redesign happened, so it is
 * written once and then treated as read-only by the loop.
 *
 * Usage: node .claude/baseline.mjs            (write, refuses to overwrite)
 *        node .claude/baseline.mjs --print    (dump what it would capture)
 */
import { readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const OUT = join(ROOT, '.claude', 'design-baseline.json');
const read = (p) => { try { return readFileSync(join(ROOT, p), 'utf8'); } catch { return ''; } };

/** Developer 1's pages. Portfolio + Collaborations are Developer 2's — excluded by design. */
export const DEV1_PAGES = {
  home:     'app/(site)/page.tsx',
  about:    'app/(site)/about/page.tsx',
  services: 'app/(site)/services/page.tsx',
  contact:  'app/(site)/contact/page.tsx',
  society:  'app/(site)/society/page.tsx',
};

/**
 * A section named inside a comment is documentation, not a render. Counting it
 * would lock a phantom section into the contract.
 */
export function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/.*$/gm, '');
}

/** Ordered list of section components a page actually renders in its JSX. */
export function sectionOrder(rawSrc) {
  const src = stripComments(rawSrc);
  // Imports from components/sections define the candidate set...
  const imported = new Set();
  for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*'@\/components\/sections\/[^']+'/g)) {
    m[1].split(',').map((s) => s.trim()).filter(Boolean).forEach((n) => imported.add(n));
  }
  // ...and the JSX order is the render order we lock.
  const order = [];
  for (const m of src.matchAll(/<([A-Z][A-Za-z0-9]*)\s*\/?>/g)) {
    if (imported.has(m[1])) order.push(m[1]);
  }
  return order;
}

/** Brand hexes are client-confirmed. Locking them makes "identity preserved" mechanical. */
export function palette(css) {
  const out = {};
  for (const m of css.matchAll(/--(brand-[a-z]+|ink-\d{3}|paper|accent):\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

export function snapshot() {
  const pages = {};
  for (const [name, file] of Object.entries(DEV1_PAGES)) {
    pages[name] = { file, sections: sectionOrder(read(file)) };
  }
  const sectionFiles = existsSync(join(ROOT, 'components/sections'))
    ? readdirSync(join(ROOT, 'components/sections')).filter((f) => f.endsWith('.tsx')).sort()
    : [];
  return {
    capturedAt: new Date().toISOString(),
    note: 'Structural contract for the Milestone 5 craft pass. Do not regenerate.',
    pages,
    sectionFiles,
    palette: palette(read('styles/tokens.css')),
  };
}

// The gate imports sectionOrder/palette from this file to re-read the live tree.
// Without this guard that import would run the CLI below and exit the gate.
const runDirectly =
  process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (runDirectly) {
  const snap = snapshot();
  if (process.argv.includes('--print')) {
    console.log(JSON.stringify(snap, null, 2));
  } else if (existsSync(OUT)) {
    console.error('baseline: design-baseline.json already exists — refusing to overwrite.');
    process.exit(1);
  } else {
    writeFileSync(OUT, JSON.stringify(snap, null, 2) + '\n');
    console.log(`baseline: wrote ${OUT}`);
  }
}
