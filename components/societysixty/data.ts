/**
 * SOCIETYSIXTY — content module.
 *
 * Every string here traces back to something the client actually supplied:
 * the 063 Society flyer (hero) and the client's own caption description
 * (intro, "063 Society meaning"). Nothing else is fabricated. This route is
 * independent of /society and content/society.ts.
 */

export const SOCIETYSIXTY_BRAND = {
  name: 'SocietySixty',
  eyebrow: 'SocietySixty',
} as const;

/**
 * Hero content — the real 063 Society service list from the client's flyer,
 * used as the scroll-driven headline; tagline is the flyer's own
 * "Modern. Elegant. Creative." Nothing here is invented copy.
 */
export const SOCIETYSIXTY_HERO = {
  eyebrow: 'Curating Timeless Celebrations',
  /** One line per scroll "beat" — each line highlights in turn as the hero scrolls. */
  lines: [
    'WEDDING SERVICES',
    'CORPORATE EVENT SERVICES',
    'EVENT PROGRAM SUPPORT',
    'MUSIC & ENTERTAINMENT',
    'AUDIO VISUAL & PRODUCTION',
  ] as const,
  subtitle: 'Modern. Elegant. Creative.',
  chips: ['Weddings', 'Corporate', 'Live Music', 'Private Events'] as const,
  /** Background photographs swapped in sync with the active line, on scroll. */
  backgrounds: [
    '/media/society-main.webp',
    '/media/society-wide.webp',
    '/media/stage-truss.webp',
    '/media/dj-decks.webp',
    '/media/sound-engineer.webp',
  ] as const,
} as const;

/**
 * Real 063 Society description, from the client's own caption copy — not
 * invented. Organized into three beats: what it is, what it does, and the
 * promise to the client — rather than two run-on paragraphs.
 */
export const SOCIETYSIXTY_INTRO = {
  wordmarkNumeral: '063',
  wordmark: 'Society',
  lead: 'Our dedicated events arm, specialising in weddings and corporate events.',
  paragraph:
    'We go beyond coordination by offering end-to-end event support — from planning and program flow, supplier coordination, and on-the-day management, to hosting, sound, and entertainment solutions.',
  closing:
    'Whether it’s an intimate wedding or a large-scale corporate gathering, 063 Society ensures every detail is well-executed, stress-free, and memorable, allowing our clients to fully enjoy their special moments.',
  cta: 'Make an enquiry',
  ctaHref: '/contact',
} as const;
