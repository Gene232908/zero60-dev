/**
 * REAL CLIENT CONTENT — transcribed verbatim from the live zerosixtythree.com
 * section exports supplied by the client (see `current website/`).
 *
 * Everything in this file is the client's own wording. Nothing here is invented.
 * Where the source only gave a heading with no body copy, the field is omitted
 * rather than filled in — see content/placeholders.ts and BLOCKERS.md for what
 * is still genuinely missing.
 *
 * This file is also the Developer 2 handoff for content (Task Division Rev 2,
 * M2 Developer 1 EASY task: collect final content and send it to Developer 2).
 */

/* -------------------------------------------------------------------------- */
/* Brand                                                                       */
/* -------------------------------------------------------------------------- */

export const BRAND = {
  /** Full legal-ish brand name as set on the live site. */
  full: 'ZERO-SIXTY-THREE PRODUCTIONS',
  /** Display wordmark, one entry per line. */
  wordmark: ['ZERO', 'SIXTY', 'THREE'],
  suffix: 'PRODUCTIONS',
  short: '063',
  /** Verbatim positioning line from the About section. */
  tagline:
    'Complete event mastery: transforming your vision with expert audio, video, and performance solutions.',
  /** Verbatim welcome copy from the "What We Do" section. */
  intro:
    "Welcome to Zero-Sixty-Three, where we bring your events to life with exceptional audio and visual experiences. Our team of professionals is dedicated to providing top-notch services to ensure your occasion is unforgettable.",
} as const;

/* -------------------------------------------------------------------------- */
/* Contact — verbatim from the "Get in touch with us" section                   */
/* -------------------------------------------------------------------------- */

export const CONTACT = {
  /** Source shows 971585124365; formatted for display, tel: uses the raw digits. */
  phoneDisplay: '+971 58 512 4365',
  phoneHref: 'tel:+971585124365',
  email: 'info@zerosixtythree.com',
  emailHref: 'mailto:info@zerosixtythree.com',
  website: 'www.zerosixtythree.com',
  /**
   * Region is derived from the +971 dialing code (United Arab Emirates) and the
   * AED partnership terms — NOT invented. City is not stated anywhere in the
   * source material, so it is deliberately left out (BLOCKER).
   */
  region: 'United Arab Emirates',
  /**
   * The live site shows Facebook and Instagram icons but exposes no URLs.
   * Left null so nothing is fabricated — see BLOCKERS.md.
   */
  socials: [
    { label: 'Facebook', href: null as string | null },
    { label: 'Instagram', href: null as string | null },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Services — 7 lines, descriptions verbatim from the live site                 */
/* -------------------------------------------------------------------------- */

export type Service = {
  id: string;
  /** Short label used in tickers and the booking form. */
  label: string;
  /** Display title, one entry per line. */
  title: string[];
  description: string;
};

export const SERVICES: Service[] = [
  {
    id: 'audio-rental',
    label: 'Audio Rental',
    title: ['Audio', 'Rental'],
    description:
      'Need high-quality sound for your event? We offer a wide range of audio rental solutions, from PA systems to microphones and speakers. Our state-of-the-art equipment ensures crystal-clear sound for any venue or occasion.',
  },
  {
    id: 'singers-performers',
    label: 'Singers & Performers',
    title: ['Singers &', 'Performers'],
    description:
      "Add a touch of magic to your event with live entertainment. Whether you're looking for a solo singer or a full band, our talented performers bring charisma and energy to every performance. We work closely with you to tailor the entertainment to suit your event perfectly.",
  },
  {
    id: 'dj-services',
    label: 'DJ Services',
    title: ['DJ', 'Services'],
    description:
      'Keep the energy high and the dance floor packed with our expert DJ services. Our DJs are skilled at reading the crowd and spinning the perfect tracks to keep the party going all night long. From weddings to corporate events, we know how to create the right atmosphere for any occasion.',
  },
  {
    id: 'sound-engineering',
    label: 'Sound Engineering',
    title: ['Sound', 'Engineering'],
    description:
      'Ensure your audio setup is flawless with our professional sound engineering services. Our experienced sound engineers handle everything from setting up and mixing to troubleshooting, so you can focus on enjoying your event without worrying about technical issues.',
  },
  {
    id: 'sports-announcing',
    label: 'Sports Announcing',
    title: ['Sports', 'Announcing'],
    description:
      'Elevate the excitement of your sports event with our skilled sports announcers. Our team brings enthusiasm and clarity to every call, providing play-by-play coverage and keeping your audience engaged throughout the game.',
  },
  {
    id: 'hosting-emcee',
    label: 'Hosting & Emcee',
    title: ['Hosting', '& Emcee'],
    description:
      'Command the stage with confidence and professionalism with our emceeing services. Our skilled emcees are adept at hosting corporate events, guiding the agenda, and engaging the audience with ease. We ensure that your event runs smoothly and that every segment is handled with expertise and flair.',
  },
  {
    id: 'videography',
    label: 'Videography',
    title: ['Video', 'graphy'],
    description:
      "Capture every moment with our high-quality videography services. From cinematic event coverage to promotional videos, our skilled videographers use the latest technology to produce stunning visual content that you'll cherish for years to come.",
  },
  {
    id: 'photography',
    label: 'Photography',
    title: ['Photo', 'graphy'],
    description:
      'Preserve the memories of your special event with our professional photography services. Our photographers are adept at capturing both posed and candid moments, ensuring you receive a beautiful collection of images that tell the story of your event.',
  },
];

/** The service rail shown across the top of the live hero, in its original order. */
export const SERVICE_RAIL = [
  'Audio Rental',
  'Singer / Performer',
  'DJ',
  'Sound Engineer',
  'Sports Announcer',
  'Videography',
  'Photography',
];

/* -------------------------------------------------------------------------- */
/* Event types — "We cater to these events", verbatim                          */
/* -------------------------------------------------------------------------- */

export type EventType = {
  index: string;
  title: string;
  /** What 063 provides for this event type, verbatim from the live site. */
  provisions: string[];
};

export const EVENT_TYPES: EventType[] = [
  {
    index: '01',
    title: 'Corporate Events & Seminars',
    provisions: [
      'Audio rental: high-quality microphones and speakers.',
      'Sound engineering: professional audio management.',
      'Videography: clear and engaging event recordings.',
      'Photography: professional photos of key moments.',
    ],
  },
  {
    index: '02',
    title: 'Concerts and Festivals',
    provisions: [
      'Audio rental: high-quality sound systems.',
      'Sound engineering: expert audio management.',
      'Singers/performers: talented acts for your stage.',
      'DJ services: energizing music between performances.',
      'Videography & photography: capture the energy and atmosphere.',
    ],
  },
  {
    index: '03',
    title: 'Weddings',
    provisions: [
      'Singers/performers: live music for your ceremony and reception.',
      'DJ services: custom playlists to keep the party going.',
      'Audio rental & sound engineering: perfect sound for every part of your day.',
      'Videography & photography: beautifully captured moments and memories.',
    ],
  },
  {
    index: '04',
    title: 'Sports Events',
    provisions: [
      'Sports announcers: dynamic commentary and coverage.',
      'Audio rental & sound engineering: clear sound for announcements and play.',
      'Videography & photography: record and photograph key plays and excitement.',
    ],
  },
  {
    index: '05',
    title: 'Community and Charity Events',
    provisions: [
      'Audio rental and sound engineering: effective sound solutions.',
      'Videography and photography: document the impact and spirit of your event.',
    ],
  },
  {
    index: '06',
    title: 'Themed Events and Productions',
    provisions: [
      'DJ services & singers/performers: custom entertainment for your theme.',
      'Audio rental & sound engineering: tailored audio solutions.',
      'Videography & photography: capture the unique elements of your event.',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Testimonials — verbatim. Handed to Developer 2 for the Testimonials page.    */
/* -------------------------------------------------------------------------- */

export type Testimonial = {
  quote: string;
  author: string;
  organisation?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'The team at Zero-Sixty-Three made our corporate conference seamless. Top-quality audio, professional sound engineering, and great videography and photography. Highly recommend!',
    author: 'Sarah M.',
    organisation: 'Brewsters Inc.',
  },
  {
    quote:
      'Our wedding was perfect thanks to Zero-Sixty-Three. Amazing live music, flawless sound, and beautiful photos and videos. They truly made our day special!',
    author: 'Emily & Jake R.',
  },
  {
    quote:
      'Fantastic job by Zero-Sixty-Three for my birthday party! Great DJ, impressive live performance, and stunning photos and videos. The party was a hit!',
    author: 'Mark L.',
  },
];

/* -------------------------------------------------------------------------- */
/* Closing CTA — verbatim heading from the live contact section                 */
/* -------------------------------------------------------------------------- */

export const CLOSING = {
  lines: ['Get in touch', 'with us'],
  supporting: BRAND.tagline,
  contactLabel: 'Start a conversation',
  contactHref: '/contact',
} as const;

/* -------------------------------------------------------------------------- */
/* Booking form option list (Milestone 3)                                       */
/*                                                                              */
/* The live contact section lists the bookable services explicitly. This is the  */
/* client's own grouping, so it seeds the "requested services" field in M3.      */
/* Still to be confirmed against the final field list (BLOCKER B13).             */
/* -------------------------------------------------------------------------- */

export const BOOKABLE_SERVICES = [
  'Sound System Rental',
  'Singer',
  'Performer',
  'DJ',
  'Sound Engineer',
  'Sports Announcer',
  'Host',
  'Photography',
  'Videography',
];
