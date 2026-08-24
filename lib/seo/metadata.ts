import type { Metadata } from 'next';

/**
 * SEO metadata helpers.
 *
 * Milestone 4 · Developer 2 · Task Division Rev 2, p.5 (HARD):
 * "Full SEO setup: page titles and descriptions for every page, sitemap, robots
 *  file, and page-speed fixes."
 *
 * docs/plan.md §3 reserves lib/seo for exactly this. Every public page builds
 * its metadata through `pageMetadata()`, so titles, canonicals and OpenGraph
 * tags cannot drift apart page by page — the one thing that reliably goes wrong
 * when each route hand-rolls its own `metadata` object.
 *
 * SITE URL. The production host is the client's existing domain, which
 * Developer 1 repoints in Milestone 4 (docs/plan.md OI-1 — resolved: connect
 * zerosixtythree.com). `metadataBase` must be absolute or Next cannot build
 * OpenGraph and canonical URLs, so it reads NEXT_PUBLIC_SITE_URL and falls back
 * to the confirmed production domain rather than to localhost.
 */

/** The client's confirmed domain — content/site.ts CONTACT.website. */
const PRODUCTION_URL = 'https://zerosixtythree.com';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || PRODUCTION_URL;

export const SITE_NAME = 'ZeroSixtyThree';

/** Appended to every page title except the home page, which sets its own. */
export const TITLE_SUFFIX = `${SITE_NAME} — Event Audio, Video & Performance`;

export type PageSeo = {
  /** Route path, e.g. "/about". Used for the canonical URL. */
  path: string;
  /** The page's own title, without the brand suffix. */
  title: string;
  /**
   * Meta description. Aim for 120–160 characters: long enough for Google to use
   * it verbatim, short enough not to be truncated. Must be unique per page.
   */
  description: string;
  /** Set false for pages that should stay out of search results. */
  index?: boolean;
};

/**
 * Build a page's metadata.
 *
 * `alternates.canonical` is set on every page: the site is reachable with and
 * without a trailing slash, and once the domain is repointed it will also be
 * reachable on the Vercel URL, so a canonical is what stops those counting as
 * duplicate pages.
 */
export function pageMetadata({ path, title, description, index = true }: PageSeo): Metadata {
  const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  const fullTitle = path === '/' ? TITLE_SUFFIX : `${title} — ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: index ? undefined : { index: false, follow: false },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
      locale: 'en_AE',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}
