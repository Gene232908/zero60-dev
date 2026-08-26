/**
 * Single source of truth for site navigation.
 * Navbar, MobileMenu and the footer sitemap all read from here, so the six
 * destinations can never drift apart. (Task Division Rev 2 — M1, Developer 1.)
 */

export type NavItem = {
  label: string;
  href: string;
  /** Index shown in the editorial nav list. */
  index: string;
  /** Brand mood the destination runs in. */
  brand: 'productions' | 'society';
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', index: '01', brand: 'productions' },
  { label: 'About', href: '/about', index: '02', brand: 'productions' },
  { label: 'Services', href: '/services', index: '03', brand: 'productions' },
  { label: 'Portfolio', href: '/portfolio', index: '04', brand: 'productions' },
  { label: 'Collaborations', href: '/collaborations', index: '05', brand: 'productions' },
  { label: '063 Society', href: '/societysixty', index: '06', brand: 'society' },
  { label: 'Contact', href: '/contact', index: '07', brand: 'productions' },
];

/** The six primary destinations named in the client call, plus Collaborations. */
export const PRIMARY_NAV = NAV_ITEMS;
