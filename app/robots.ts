import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/metadata';

/**
 * robots.txt — Milestone 4, Developer 2 (Task Division Rev 2, p.5).
 *
 * The admin area is disallowed here as well as being unlinked and set `noindex`
 * in its layout. Those are three different mechanisms guarding three different
 * failure modes:
 *
 *   unlinked   nothing points a crawler at it in the first place
 *   noindex    if a crawler reaches it anyway, it must not be listed
 *   Disallow   well-behaved crawlers do not request it at all
 *
 * Note the order of defence: robots.txt is a *request* to crawlers, not access
 * control. What actually protects the booking records is firestore.rules and the
 * admin claim — this only keeps the URL out of search results.
 *
 * /api is disallowed too: the inquiry endpoint is a POST target, not a page, and
 * has no reason to be crawled.
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
