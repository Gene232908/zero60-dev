import type { PageSeo } from './metadata';

/**
 * Per-page titles and descriptions — Milestone 4, Developer 2.
 *
 * Every public route's copy lives here rather than being scattered across seven
 * page files, so it is possible to see at a glance that no two pages share a
 * title or a description. Duplicate titles and boilerplate descriptions are the
 * two most common SEO faults on a multi-page site, and the gate asserts against
 * both against the rendered HTML.
 *
 * Descriptions are written from the client's own positioning in content/site.ts
 * — the services they actually list, the events they actually cover. Nothing
 * here claims a location, a client name or a credential that the source material
 * does not support (BLOCKER B6: the city is unknown, so these say the region).
 *
 * Length target: 120–160 characters. Long enough that Google uses it verbatim,
 * short enough that it is not cut off.
 */

export const PAGE_SEO: Record<string, PageSeo> = {
  home: {
    path: '/',
    title: 'Home',
    description:
      'Complete event mastery in the UAE: audio rental, sound engineering, live performers, DJs, hosting, photography and videography from ZeroSixtyThree.',
  },
  about: {
    path: '/about',
    title: 'About',
    description:
      'Who ZeroSixtyThree are: one team covering sound, stage and story, so nothing falls between suppliers on the day of your event.',
  },
  services: {
    path: '/services',
    title: 'Services',
    description:
      'Audio rental, singers and performers, DJ services, sound engineering, sports announcing, hosting, videography and photography for events across the UAE.',
  },
  portfolio: {
    path: '/portfolio',
    title: 'Portfolio & Testimonials',
    description:
      'Selected ZeroSixtyThree event work, plus what clients said about their corporate conferences, weddings and parties in their own words.',
  },
  collaborations: {
    path: '/collaborations',
    title: 'Collaborations',
    description:
      'The disciplines ZeroSixtyThree brings to a shared production, and the partners we build events alongside across the UAE.',
  },
  society: {
    path: '/society',
    title: '063 Society',
    description:
      '063 Society is the elegant side of ZeroSixtyThree: weddings, corporate programmes and refined event production with the same technical backbone.',
  },
  contact: {
    path: '/contact',
    title: 'Contact',
    description:
      'Get in touch with ZeroSixtyThree to plan your event. Call +971 58 512 4365, email info@zerosixtythree.com, or send an enquiry with your date and venue.',
  },
};
