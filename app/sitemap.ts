import type { MetadataRoute } from 'next';
import { NAV_ITEMS } from '@/content/nav';
import { SITE_URL } from '@/lib/seo/metadata';

/**
 * sitemap.xml — Milestone 4, Developer 2 (Task Division Rev 2, p.5).
 *
 * Generated from content/nav.ts, which is already the single source of truth for
 * the site's destinations. That means a page added to the navigation is in the
 * sitemap automatically — a hand-maintained list would silently fall behind, and
 * the whole point of a sitemap is that it is complete.
 *
 * /admin is absent because it is not in NAV_ITEMS, which is exactly why the
 * admin was kept out of the navigation in Milestone 3. robots.ts disallows it
 * explicitly as well; the gate asserts both.
 *
 * Priorities are relative, not absolute: home first, then the two pages that
 * convert (contact, portfolio), then the rest.
 */

const PRIORITY: Record<string, number> = {
  '/': 1,
  '/contact': 0.9,
  '/portfolio': 0.8,
  '/services': 0.8,
  '/society': 0.7,
  '/about': 0.6,
  '/collaborations': 0.6,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return NAV_ITEMS.map((item) => ({
    url: item.href === '/' ? SITE_URL : `${SITE_URL}${item.href}`,
    lastModified,
    changeFrequency: item.href === '/' ? 'weekly' : 'monthly',
    priority: PRIORITY[item.href] ?? 0.5,
  }));
}
