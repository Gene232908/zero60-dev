'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from '@/components/motion';
import { useReducedMotionSafe } from '@/components/motion/use-reduced-motion';
import { Button } from '@/components/ui';
import { SOCIETYSIXTY_INTRO } from './data';

/**
 * SocietySixtyIntro — white ground, a large "063 Society" wordmark that
 * fills in with the flyer's dusty-rose (#B18A83) as the section scrolls into
 * view, then the real client description organized as three distinct
 * beats — what it is, what it does, and the promise to the client — rather
 * than two run-on paragraphs.
 *
 * The wordmark fill is a scroll-linked clip-path wipe (left to right), driven
 * by this section's own scroll progress so it reads as "painted on" by the
 * act of scrolling rather than a generic fade-in. Reduced motion renders the
 * wordmark fully filled at rest.
 */
export function SocietySixtyIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.35'],
  });
  const clipPath = useTransform(scrollYProgress, (v) => `inset(0 ${100 - v * 100}% 0 0)`);

  return (
    <section ref={ref} className="relative bg-white py-[var(--section-y)]">
      {/* Blend seam: the hero ends on #DCD0BA (its gradient's deepest beige),
          so this section opens by fading that exact tone into white rather
          than cutting hard from one flat ground to another. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 md:h-48"
        style={{ background: 'linear-gradient(to bottom, #DCD0BA 0%, rgba(220,208,186,0) 100%)' }}
      />

      <div className="shell">
        {/* ---------- animated wordmark block ---------- */}
        <div className="relative mx-auto max-w-[64rem] text-center">
          <p className="eyebrow text-[#B18A83]">063 Society</p>

          <div className="relative mt-4 select-none md:mt-6">
            {/* base layer: black outline/fill, always visible */}
            <p
              aria-hidden="true"
              className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,9vw,7rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] text-[#1A1714]"
            >
              063 Society
            </p>

            {/* rose overlay: clipped to a percentage driven by scroll, so it
                paints left-to-right over the black base as the section enters. */}
            <motion.p
              aria-hidden="true"
              className="absolute inset-0 font-[family-name:var(--font-display)] text-[clamp(2.75rem,9vw,7rem)] font-black uppercase leading-[0.92] tracking-[-0.02em] text-[#B18A83]"
              style={reduced ? undefined : { clipPath }}
            >
              063 Society
            </motion.p>

            {/* screen-reader text: the two visual layers above are decorative duplicates */}
            <span className="sr-only">063 Society</span>
          </div>
        </div>

        {/* ---------- the three-beat description ---------- */}
        <div className="mx-auto mt-14 grid max-w-[64rem] gap-10 md:mt-20 md:grid-cols-[1fr_1.4fr] md:gap-14">
          {/* left: the lead statement, set large — what it is */}
          <Reveal variant="rise" weight="primary" delay={0.05}>
            <p className="font-[family-name:var(--font-serif)] text-[clamp(1.5rem,2.6vw,2.1rem)] italic leading-snug text-[#1A1714]">
              {SOCIETYSIXTY_INTRO.lead}
            </p>
          </Reveal>

          {/* right: what it does, then the promise — a hairline separates the two beats */}
          <div>
            <Reveal variant="rise" weight="secondary" delay={0.15}>
              <p className="text-[length:var(--text-base)] leading-relaxed text-[#1A1714]/75">
                {SOCIETYSIXTY_INTRO.paragraph}
              </p>
            </Reveal>

            <Reveal variant="draw" delay={0.24} className="my-6 md:my-8">
              <span aria-hidden="true" className="block h-px w-16 bg-[#B18A83]/50" />
            </Reveal>

            <Reveal variant="rise" weight="secondary" delay={0.26}>
              <p className="text-[length:var(--text-base)] leading-relaxed text-[#1A1714]/75">
                {SOCIETYSIXTY_INTRO.closing}
              </p>
            </Reveal>

            <Reveal variant="settle" weight="tertiary" delay={0.36} className="mt-8">
              <Button href={SOCIETYSIXTY_INTRO.ctaHref} variant="outline" size="md">
                {SOCIETYSIXTY_INTRO.cta}
              </Button>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Blend seam into the shared Footer, which runs the site's dark
          `--bg` — a soft fade rather than a hard white-to-black cut. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-48"
        style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.06) 0%, rgba(10,10,10,0) 100%)' }}
      />
    </section>
  );
}

export default SocietySixtyIntro;
