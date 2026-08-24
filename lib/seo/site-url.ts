/**
 * The site's canonical origin, used as `metadataBase` so every relative
 * metadata URL (share card, canonical links, and Developer 2's sitemap) resolves
 * to an absolute one.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL      — set this per Vercel environment
 *   2. VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL — Vercel supplies these, so
 *      preview deployments describe themselves instead of claiming to be prod
 *   3. the confirmed production domain
 *
 * The domain is confirmed: Task Division Rev 2 supersedes v1's "Vercel URL only"
 * note and connects the client's existing zerosixtythree.com in Milestone 4
 * (BLOCKERS.md OI-1). It is not a guess.
 */

const FALLBACK = 'https://zerosixtythree.com';

function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return FALLBACK;
}

/** Normalised: always absolute, never a trailing slash. */
export const SITE_URL: string = (() => {
  const raw = resolve();
  const withScheme = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  return withScheme.replace(/\/+$/, '');
})();
