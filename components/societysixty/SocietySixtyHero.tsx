'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Reveal } from '@/components/motion';
import { useReducedMotionSafe } from '@/components/motion/use-reduced-motion';
import { cn } from '@/lib/utils/cn';
import { SOCIETYSIXTY_HERO } from './data';

const LINE_COUNT = SOCIETYSIXTY_HERO.lines.length;

/**
 * SocietySixtyHero — split-screen opening with a SCROLL-DRIVEN narrative,
 * matching the live PlanFest reference: as the visitor scrolls through the
 * (taller-than-viewport) hero, the active headline line highlights in turn
 * and the background photograph crossfades to match — rather than a static
 * entrance that finishes once and sits still.
 *
 * Mechanics: the section is pinned via `sticky` for its own extra-tall scroll
 * range (100vh * LINE_COUNT), so scrolling through it advances a progress
 * value that is bucketed into `LINE_COUNT` steps — one step lights one line
 * and swaps one background. Once the range is exhausted, normal scrolling
 * continues into the next section.
 *
 * Right panel runs the real 063 Society flyer palette — cream/beige gradient,
 * dusty-rose accent, dark ink text — not PlanFest's dark panel. Images render
 * at full color throughout (no grayscale-on-rest hover treatment) — only
 * opacity crossfades between them, kept on the compositor. Reduced motion: no
 * pin, no crossfade — every line and the first background render at rest,
 * most-emphasised line only.
 */
export function SocietySixtyHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const next = Math.min(LINE_COUNT - 1, Math.floor(progress * LINE_COUNT));
    setActiveIndex(next);
  });

  if (reduced) {
    return (
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden lg:flex-row">
        <StaticHero activeIndex={LINE_COUNT - 1} />
      </section>
    );
  }

  return (
    <div ref={trackRef} className="relative" style={{ height: `${LINE_COUNT * 100}svh` }}>
      <section className="sticky top-0 isolate flex h-[100svh] flex-col overflow-hidden lg:flex-row">
        {/* ---------- left (lg+): crossfading single photograph ---------- */}
        <div className="relative hidden overflow-hidden lg:block lg:h-auto lg:w-1/2">
          {SOCIETYSIXTY_HERO.backgrounds.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-brand)]"
              style={{ opacity: i === activeIndex ? 1 : 0 }}
              aria-hidden={i !== activeIndex}
            >
              <Image
                src={src}
                alt={i === 0 ? 'Placeholder — SocietySixty venue photograph' : ''}
                fill
                priority={i === 0}
                sizes="50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* ---------- top (below lg): static 2x2 image grid ---------- */}
        <div className="grid h-[42vh] w-full shrink-0 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden lg:hidden">
          {SOCIETYSIXTY_HERO.backgrounds.slice(0, 4).map((src, i) => (
            <div key={src} className="relative overflow-hidden">
              <Image
                src={src}
                alt={i === 0 ? 'Placeholder — SocietySixty venue photograph' : ''}
                fill
                priority={i < 2}
                sizes="50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* ---------- right: eyebrow, scroll-highlighted headline, subtitle, chips ---------- */}
        {/* Cream/beige gradient — the real 063 Society flyer palette — rather
            than PlanFest's dark panel. Text runs dark-on-cream instead of
            white-on-dark to match. */}
        <div
          className="flex w-full flex-1 flex-col justify-between border-t border-[#1A1714]/10 px-[var(--gutter)] py-10 lg:w-1/2 lg:border-l lg:border-t-0 lg:py-14"
          style={{ background: 'linear-gradient(160deg, #F3ECE0 0%, #E7DDCB 55%, #DCD0BA 100%)' }}
        >
          <Reveal variant="fade" weight="tertiary" delay={0.1} immediate>
            <div className="flex items-baseline justify-between gap-4 border-b border-[#1A1714]/10 pb-4">
              <p className="eyebrow text-[#B18A83]">{SOCIETYSIXTY_HERO.eyebrow}</p>
              <p className="eyebrow hidden text-[#B18A83] sm:block">Est. SocietySixty</p>
            </div>
          </Reveal>

          {/* The service index — each line is a numbered showcase row that
              lights up in turn, with a rose rule sliding in beside it. */}
          <div className="my-8 lg:my-10">
            {SOCIETYSIXTY_HERO.lines.map((line, i) => {
              const active = i === activeIndex;
              return (
                <div key={line} className="group relative flex items-baseline gap-4 py-1 md:gap-6">
                  {/* index numeral */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'w-7 shrink-0 pt-1 font-[family-name:var(--font-body)] text-[0.6rem]',
                      'tabular-nums tracking-[0.2em] transition-all duration-[var(--dur-slow)]',
                      'ease-[var(--ease-brand)] md:text-[0.68rem]',
                      active ? 'text-[#B18A83] opacity-100' : 'text-[#1A1714] opacity-25',
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <h1
                    className={cn(
                      'font-[family-name:var(--font-display)] text-[clamp(1.9rem,4.4vw,3.3rem)]',
                      'font-black uppercase leading-[0.94] tracking-[-0.015em] transition-all',
                      'duration-[var(--dur-slow)] ease-[var(--ease-brand)]',
                      active
                        ? 'translate-x-0 text-[#B18A83]'
                        : '-translate-x-1 text-[#1A1714]/40',
                    )}
                  >
                    {line}
                  </h1>
                </div>
              );
            })}
          </div>

          <div>
            {/* The brand statement — treated as a showcase line, not a caption:
                serif, large, sitting on its own rule. */}
            <Reveal variant="settle" weight="secondary" delay={0.2} immediate>
              <div className="border-t border-[#1A1714]/15 pt-5 md:pt-6">
                <p className="font-[family-name:var(--font-serif)] text-[clamp(1.35rem,2.4vw,2rem)] italic leading-tight text-[#1A1714]">
                  {SOCIETYSIXTY_HERO.subtitle}
                </p>
              </div>
            </Reveal>

            <Reveal
              stagger="tight"
              variant="settle"
              weight="tertiary"
              delay={0.3}
              immediate
              className="mt-5 flex flex-wrap items-center gap-2 md:mt-6 md:gap-2.5"
            >
              {SOCIETYSIXTY_HERO.chips.map((chip) => (
                <span
                  key={chip}
                  className={cn(
                    'rounded-full border border-[#B18A83]/35 bg-white/50 px-3.5 py-1.5',
                    'font-[family-name:var(--font-body)] text-[0.6rem] font-semibold uppercase',
                    'tracking-[0.16em] text-[#8A6560] backdrop-blur-sm md:text-[0.65rem]',
                    'transition-all duration-[var(--dur-fast)] ease-[var(--ease-brand)]',
                    'hover:-translate-y-0.5 hover:border-[#B18A83] hover:bg-[#B18A83] hover:text-white',
                    'hover:shadow-[0_4px_12px_rgba(177,138,131,0.3)]',
                  )}
                >
                  {chip}
                </span>
              ))}
            </Reveal>

            {/* Progress counter — reads as a showcase index, not a hint. */}
            <div className="mt-7 flex items-center gap-4 md:mt-9">
              <span className="font-[family-name:var(--font-body)] text-[0.65rem] tabular-nums tracking-[0.2em] text-[#1A1714]/50">
                <span className="font-bold text-[#B18A83]">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span className="mx-1.5">/</span>
                {String(LINE_COUNT).padStart(2, '0')}
              </span>

              {/* Segmented progress rail */}
              <span aria-hidden="true" className="flex flex-1 items-center gap-1">
                {SOCIETYSIXTY_HERO.lines.map((line, i) => (
                  <span
                    key={line}
                    className={cn(
                      'h-px flex-1 transition-all duration-[var(--dur-slow)]',
                      'ease-[var(--ease-brand)]',
                      i <= activeIndex ? 'bg-[#B18A83]' : 'bg-[#1A1714]/15',
                    )}
                  />
                ))}
              </span>

              <motion.span
                className="font-[family-name:var(--font-body)] text-[0.6rem] uppercase tracking-[0.2em] text-[#1A1714]/40"
                style={{ opacity: activeIndex < LINE_COUNT - 1 ? 1 : 0 }}
              >
                Scroll
              </motion.span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Reduced-motion / no-JS-scroll fallback: everything at rest, final state. */
function StaticHero({ activeIndex }: { activeIndex: number }) {
  return (
    <>
      <div className="relative hidden overflow-hidden lg:block lg:h-auto lg:w-1/2">
        <Image
          src={SOCIETYSIXTY_HERO.backgrounds[activeIndex]}
          alt="Placeholder — SocietySixty venue photograph"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
      </div>
      <div className="grid h-[42vh] w-full shrink-0 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden lg:hidden">
        {SOCIETYSIXTY_HERO.backgrounds.slice(0, 4).map((src, i) => (
          <div key={src} className="relative overflow-hidden">
            <Image
              src={src}
              alt={i === 0 ? 'Placeholder — SocietySixty venue photograph' : ''}
              fill
              priority={i < 2}
              sizes="50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div
        className="flex w-full flex-1 flex-col justify-between border-t border-[#1A1714]/10 px-[var(--gutter)] py-10 lg:w-1/2 lg:border-l lg:border-t-0 lg:py-14"
        style={{ background: 'linear-gradient(160deg, #F3ECE0 0%, #E7DDCB 55%, #DCD0BA 100%)' }}
      >
        <div className="flex items-baseline justify-between gap-4 border-b border-[#1A1714]/10 pb-4">
          <p className="eyebrow text-[#B18A83]">{SOCIETYSIXTY_HERO.eyebrow}</p>
          <p className="eyebrow hidden text-[#B18A83] sm:block">Est. SocietySixty</p>
        </div>

        <div className="my-8 lg:my-10">
          {SOCIETYSIXTY_HERO.lines.map((line, i) => (
            <div key={line} className="flex items-baseline gap-4 py-1 md:gap-6">
              <span
                aria-hidden="true"
                className={cn(
                  'w-7 shrink-0 pt-1 font-[family-name:var(--font-body)] text-[0.6rem]',
                  'tabular-nums tracking-[0.2em] md:text-[0.68rem]',
                  i === activeIndex ? 'text-[#B18A83]' : 'text-[#1A1714] opacity-25',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h1
                className={cn(
                  'font-[family-name:var(--font-display)] text-[clamp(1.9rem,4.4vw,3.3rem)]',
                  'font-black uppercase leading-[0.94] tracking-[-0.015em]',
                  i === activeIndex ? 'text-[#B18A83]' : 'text-[#1A1714]/40',
                )}
              >
                {line}
              </h1>
            </div>
          ))}
        </div>

        <div>
          <div className="border-t border-[#1A1714]/15 pt-5 md:pt-6">
            <p className="font-[family-name:var(--font-serif)] text-[clamp(1.35rem,2.4vw,2rem)] italic leading-tight text-[#1A1714]">
              {SOCIETYSIXTY_HERO.subtitle}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 md:mt-6 md:gap-2.5">
            {SOCIETYSIXTY_HERO.chips.map((chip) => (
              <span
                key={chip}
                className={cn(
                  'rounded-full border border-[#B18A83]/35 bg-white/50 px-3.5 py-1.5',
                  'font-[family-name:var(--font-body)] text-[0.6rem] font-semibold uppercase',
                  'tracking-[0.16em] text-[#8A6560] md:text-[0.65rem]',
                )}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SocietySixtyHero;
