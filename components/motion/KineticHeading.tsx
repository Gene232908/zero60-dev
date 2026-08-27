'use client';

import { useRef, useState, type ElementType, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotionSafe } from './use-reduced-motion';
import { DUR, EASE, STAGGER, type Bezier } from './motion-tokens';
import { cn } from '@/lib/utils/cn';

/**
 * KineticHeading — oversized display type as a compositional element
 * (design brief §2, §10).
 *
 * Words reveal from behind a mask on enter, then the whole line drifts as the
 * user scrolls, so the heading reads as part of the artwork rather than a label
 * sitting on top of it. Sizes are vw-based with a rem floor and ceiling, so the
 * type stays dramatic on desktop and usable on a phone.
 *
 * Accessibility: the split words are aria-hidden and the real string is exposed
 * once via aria-label, so a screen reader hears a sentence, not a word list.
 * Reduced motion: renders as static type at the same size.
 */

/**
 * One masked word of a heading.
 *
 * THE MASK HAS TO BE A STATIC EDGE, which is why it lives on this outer span
 * and not on the moving one: a clip-path that travels with the text wipes
 * rather than masks, and the whole effect is that the word rises from behind a
 * fixed line.
 *
 * WHAT THAT EDGE WAS CUTTING — measured, not guessed. Archivo is 1000upm with
 * ascent 878 / descent 210, so its content area is 1.088em. Headings run at
 * --display-leading 0.82em, giving half-leading of -0.134em and putting the
 * baseline 0.744em down. That leaves 0.076em of room below the baseline inside
 * the mask.
 *
 *   · The LETTERFORMS fit. Cap height is 686 and every uppercase glyph we set
 *     has yMin = 0 — the Y of SIXTY sits exactly on the baseline, with 0.076em
 *     to spare beneath it. It was never the thing being clipped.
 *   · The .text-halo SHADOW does not fit, and is. Its widest layer is
 *     0 8px 44px, so it reaches 52px below the baseline; at hero size there are
 *     about 10px of room. The remaining ~42px is sliced off flat, drawing a
 *     hard horizontal edge immediately under the type. Under a Y — narrow stem,
 *     open space either side — that edge is the most exposed, which is why the
 *     Y looked cut when its neighbours did not.
 *
 * So the fix is not to enlarge the mask (that would force the word to start
 * ~0.45em lower and, at 0.82 leading, emerge into the line below it). It is to
 * keep the halo OUT of the mask: the shadow is suppressed for exactly as long
 * as the clip is in place, then fades in over --dur-fast once the word lands
 * and the clip is released. During the reveal nothing overflows the mask, so
 * there is nothing to cut; afterwards nothing clips, so the halo is whole.
 *
 * `align-bottom` stays on both states — an inline-block takes its baseline from
 * the bottom margin edge when it clips and from its last line box when it does
 * not, so without it, releasing the clip would shift the word.
 */
function Word({
  children,
  delay,
  interactive = false,
}: {
  children: ReactNode;
  delay: number;
  /**
   * Opt-in per-word hover. Off everywhere except the hero, because on a normal
   * section heading a word that lifts under the pointer reads as a broken link
   * rather than as a flourish.
   *
   * The lift is a TRANSFORM on the inner span, which is already the animated
   * element — so it composites on the same layer the entrance used and costs
   * nothing extra. It is deliberately gated on `landed`: while the word is still
   * clipped, a hover translate would push it out through the mask edge.
   *
   * Pointer-only (`@media (hover: hover)`, applied via the `hover-lift` utility)
   * so a touch device never gets a stuck hover state after a tap.
   */
  interactive?: boolean;
}) {
  const [landed, setLanded] = useState(false);

  return (
    // The observer MUST sit on this outer box, not on the inner span. The inner
    // span starts translated 110% down, which puts it entirely outside this
    // overflow-hidden parent — and IntersectionObserver clips a target against
    // its ancestors' overflow before measuring. Observing the inner span
    // therefore reported zero intersection forever: it could not come into view
    // because it was hidden, and could not unhide because it had not come into
    // view. Every heading on the site stayed invisible.
    //
    // This wrapper is never transformed, so it is always measurable.
    <motion.span
      className={cn('inline-block align-bottom', landed ? 'overflow-visible' : 'overflow-hidden')}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      <motion.span
        className={cn(
          'inline-block transition-[text-shadow] duration-[var(--dur-fast)] ease-out',
          // No clip-path here. The outer box is the mask; a second clip riding
          // along with the text only added another edge to be cut by.
          !landed && 'will-change-transform [text-shadow:none]',
          // Only once the entrance has finished and the clip is released — see
          // the prop doc above.
          interactive && landed && 'kinetic-word',
        )}
        variants={{ hidden: { y: '110%' }, shown: { y: '0%' } }}
        transition={{ duration: DUR.slow, ease: EASE.entrance, delay }}
        onAnimationComplete={() => setLanded(true)}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/**
 * The cinematic entrances. All are compositor-only (transform + opacity, never
 * `filter`) — see the note inside CinematicWord for why that matters.
 *
 *   push     the hero wordmark. Rises and settles back from a larger scale: the
 *            camera-moving-toward-you read. Vertical, frontal, monumental.
 *
 *   lateral  wide editorial statements. Each line is masked by its own box and
 *            slides in HORIZONTALLY from the left, like a title card racking
 *            across frame — sideways rather than forward, wiped rather than
 *            scaled. Suits type already stepped in from the left, since the
 *            movement runs along the same axis as the indent.
 *
 *   slam     the closing CTA. The heaviest of the three and the only one that
 *            arrives rather than glides: the line drops from above at a wider
 *            scale and is stopped hard by `overshoot`, which carries it a frame
 *            past the mark before it settles. A page that ends on a request
 *            should land on it, not fade up to it.
 *
 * TIMING IS PER MODE. Every mode used to run at DUR.cinematic (1.2s), which is
 * why they all felt similarly soft regardless of what they were doing — a wipe
 * and a slam want completely different clocks. Duration and stagger together are
 * most of the character; the transform is only the shape of it.
 */
export type CinematicMode = 'push' | 'lateral' | 'slam';

const CINEMATIC_MODES: Record<
  CinematicMode,
  {
    from: Record<string, string | number>;
    to: Record<string, string | number>;
    ease: Bezier;
    stagger: number;
    duration: number;
    /** How much of the travel the opacity ramp occupies (0-1). Lower = snappier. */
    fadeRatio: number;
  }
> = {
  push: {
    // A rack-focus blur is deliberately included here and NOWHERE else.
    //
    // `filter` is not compositor-only: it repaints whatever it is applied to on
    // every frame. Earlier in this build a per-LETTER blur — fourteen glyphs
    // each tweening their own filter, over a full-bleed photo, two animated
    // beams and a text-clipped gradient — dropped frames badly. That was a cost
    // problem, not a technique problem: this applies the same effect to THREE
    // elements, once, on entrance only, and drops will-change the moment each
    // line lands. Measured on the real page before shipping.
    //
    // 6px, not 12. A/B measured on the real page: at 12px the median frame time
    // went 50ms -> 66.6ms and long frames roughly doubled, because the blurred
    // area scales with the radius and these are ~140px-tall lines spanning most
    // of the viewport. 6px halves the blurred region, still reads clearly as a
    // lens pulling focus, and holds frame pacing at the no-blur baseline.
    //
    // It resolves early (see fadeRatio) so the line is sharp while it is still
    // travelling — you watch it MOVE, not watch it sharpen.
    from: { opacity: 0, y: '40%', scale: 1.16, filter: 'blur(6px)' },
    to: { opacity: 1, y: '0%', scale: 1, filter: 'blur(0px)' },
    ease: EASE.signature,
    // 0.34, up from 0.16. At the tighter value all three lines were essentially
    // in flight together and the wordmark arrived as one block; the last line in
    // particular landed at 1.80s, before its own neon ignition at 1.90s, so the
    // two effects overlapped and neither got read.
    //
    // At 0.34 each line clearly follows the one above it, and THREE lands at
    // 2.16s with room to be the last thing that happens before it lights.
    stagger: 0.34,
    duration: DUR.cinematic,
    fadeRatio: 0.42,
  },
  lateral: {
    // -26%, up from -18%. The mask hides the word either way, so this is purely
    // how far it travels while visible — and a longer run reads as more
    // deliberate. Still well short of a full-width slide, which would overshoot
    // the container and force a horizontal scrollbar on narrow screens.
    from: { opacity: 0, x: '-26%' },
    to: { opacity: 1, x: '0%' },
    // `anticipate` pulls fractionally left before running right — the half-frame
    // of load that makes the word look thrown rather than dragged.
    ease: EASE.anticipate,
    // 0.46. Measuring the real page at 0.3 showed all three words already opaque
    // by ~1.1s despite a 1.45s duration — they were overlapping so heavily that
    // the "one at a time" reveal collapsed into a single sweep. The gap between
    // arrivals IS the effect here, so it has to be wide enough to actually hear.
    stagger: 0.46,
    // 1.15, down from 1.45. With a wider stagger the per-word travel can be
    // shorter without the section dragging — each word now moves decisively and
    // then WAITS, instead of three slow words sliding over each other.
    duration: 1.15,
    // Very early fade. The word should be fully opaque while it is still
    // travelling, so you watch it MOVE rather than watch it appear.
    fadeRatio: 0.26,
  },
  slam: {
    from: { opacity: 0, y: '-52%', scale: 1.26 },
    to: { opacity: 1, y: '0%', scale: 1 },
    // The only mode using overshoot: it crosses the target and comes back, which
    // is what makes this read as an impact instead of an arrival.
    ease: EASE.overshoot,
    stagger: 0.19,
    // Fast. A slam is short by definition — stretch it and it becomes a drift.
    duration: 0.86,
    fadeRatio: 0.34,
  },
};

/**
 * CinematicWord — the hero-only entrance. One animated span per LINE.
 *
 * `Word` above masks a whole word and slides it up. That is the right entrance
 * for a section heading and it is the same entrance every other heading on this
 * site uses, which is exactly why the hero cannot use it: the wordmark is
 * supposed to be the one moment on the page you remember.
 *
 * An earlier version of this animated every LETTER separately, each tweening its
 * own `filter: blur()`. It looked good and it lagged, because `filter` is not a
 * compositor-only property: each frame re-rasterised fourteen pieces of
 * ~140px-tall type, over a full-bleed photo, two animated beams and a
 * text-clipped gradient. The fix was not to tune it but to stop repainting.
 *
 * What moves now, all compositor-only:
 *
 *   y      the line rises from below, so the arrival has direction and weight.
 *   scale  1.12 → 1. This carries the cinematic read that the blur used to:
 *          type settling INTO the frame reads as a camera pushing in, and unlike
 *          a blur it costs nothing and never looks merely out of focus.
 *   opacity resolves early, over --dur-base, so the line is visible while it is
 *          still travelling instead of popping in already half-settled.
 *
 * EASE.signature is the house curve — fast attack, a hair past the mark, settles.
 * It is what makes the line land rather than glide to a stop.
 *
 * Reduced motion is handled by the parent's early return, which renders plain
 * static type at the same size.
 */
function CinematicWord({
  text,
  index,
  baseDelay,
  immediate,
  interactive,
  mode,
  wordClassNames,
}: {
  text: string;
  /** Which line this is — drives the stagger. */
  index: number;
  /** Offset before the first line, so the wordmark can wait for the rail above it. */
  baseDelay: number;
  /**
   * Run on mount instead of waiting for the element to scroll into view.
   *
   * The hero wordmark is ABOVE THE FOLD, so `whileInView` is the wrong trigger
   * for it — same reasoning as Reveal's own `immediate` prop, which every other
   * element in the hero already passes.
   */
  immediate: boolean;
  interactive: boolean;
  /** Which cinematic entrance to run — see CINEMATIC_MODES. */
  mode: CinematicMode;
  /**
   * Per-word class within this line, same lookup as KineticHeading's own prop
   * of the same name. The cinematic branch animates a whole LINE as one block
   * (`text={line}` is a single string, not split into words the way the
   * default masked-word path splits them) — so without this, a line rendered
   * through `cinematic` had no per-word span to hang a class on at all, and
   * `wordClassNames` silently matched nothing. This splits the line's text
   * into words only when the prop is supplied, wraps matched words in a
   * styled span, and leaves everything else as plain text — the animated
   * element is still the single outer `motion.span`, so the entrance timing
   * is unaffected.
   */
  wordClassNames?: Readonly<Record<string, string>>;
}) {
  const [landed, setLanded] = useState(false);
  const spec = CINEMATIC_MODES[mode];

  // WHOLE LINE, not per letter.
  //
  // The first version animated all 14 glyphs individually, each tweening its own
  // `filter: blur()` from 14px to 0. That was the lag. `filter` is not a
  // compositor-only property, so every frame forced a fresh rasterisation of
  // every letter — 14 simultaneous repaints of ~140px-tall type, on top of a
  // full-bleed background image, two animated beams and a text-clipped gradient
  // sweep. It dropped frames on exactly the machines it was meant to impress.
  //
  // Three animated elements instead of fourteen, and nothing that repaints: `y`,
  // `scale` and `opacity` are all compositor-only, so the entrance runs on the
  // GPU. The cinematic weight now comes from the scale push and the ease rather
  // than from a blur — cheaper, and it reads better, because a blur at this type
  // size mostly just looked out of focus.
  const word = (
    <motion.span
      className={cn(
        'block',
        // `filter` is included because `push` blurs on entrance. It is dropped
        // the instant the line lands — leaving it on would pin a compositor
        // layer for the whole session for no benefit.
        !landed && 'will-change-[transform,opacity,filter]',
        interactive && landed && 'kinetic-word',
      )}
      initial={spec.from}
      {...(immediate
        ? { animate: spec.to }
        : {
            whileInView: spec.to,
            viewport: { once: true, margin: '0px 0px -10% 0px' },
          })}
      transition={{
        duration: spec.duration,
        ease: spec.ease,
        delay: baseDelay + index * spec.stagger,
        // The opacity ramp is a FRACTION of the travel, not a fixed 0.52s. Tied
        // to the mode's own duration it stays in proportion: a slam fades in over
        // ~0.29s and a wipe over ~0.44s, so neither one is still fading in when
        // it should already be moving under its own weight.
        opacity: {
          duration: spec.duration * spec.fadeRatio,
          ease: EASE.out,
          delay: baseDelay + index * spec.stagger,
        },
      }}
      onAnimationComplete={() => setLanded(true)}
    >
      {wordClassNames
        ? text.split(' ').map((word, wi, arr) => (
            <span key={`${word}-${wi}`} className={wordClassNames[word]}>
              {word}
              {wi < arr.length - 1 ? ' ' : ''}
            </span>
          ))
        : text}
    </motion.span>
  );

  // ONLY `lateral` clips.
  //
  // It emerges from behind a static edge, so it needs a box to emerge from — and
  // that box has to sit INSIDE any indent padding the line carries, or the mask
  // starts at the section edge and the word crosses its own indent on the way in.
  //
  // `push` and `slam` must NOT clip. Both overshoot their scale (1.16 and 1.26),
  // and a clipping box would slice that overshoot off against the very edge that
  // is supposed to be revealing them — the impact would land against a hard
  // horizontal line instead of in open space.
  //
  // `block` on the wrapper rather than inline-block: an inline-block shrink-wraps
  // to the text, and a mask exactly the width of the word it is masking reveals
  // nothing.
  return mode === 'lateral' ? <span className="block overflow-hidden">{word}</span> : word;
}

export type KineticSize = 'sm' | 'md' | 'lg' | 'xl' | 'mega';

const SIZE: Record<KineticSize, string> = {
  sm: 'text-[clamp(1.75rem,4vw,3rem)]',
  md: 'text-[clamp(2.5rem,6.5vw,5.5rem)]',
  lg: 'text-[clamp(2.75rem,7vw,6rem)]',
  xl: 'text-[clamp(3rem,8.5vw,8.5rem)]',
  mega: 'text-[clamp(3.25rem,10.5vw,11rem)]',
};

export interface KineticHeadingProps {
  /** One string per visual line. Readonly so `as const` content arrays fit. */
  lines: readonly string[];
  as?: ElementType;
  size?: KineticSize;
  /**
   * Override the preset step with an explicit font-size utility (e.g. a
   * `text-[clamp(...)]`). Applied to the heading ELEMENT, not the wrapper —
   * putting a size on the wrapper does nothing, because SIZE[size] sets
   * font-size on the heading inside it and the per-line `em` ramp resolves
   * against that. Use when a specific composition needs to break the scale.
   */
  sizeClassName?: string;
  /** Scroll-linked horizontal drift in px (0 disables). */
  drift?: number;
  /** Delay before the first word enters, in seconds. */
  delay?: number;
  /**
   * Per-word hover response (lift + accent bloom). Off by default — see the
   * `Word` prop doc. Intended for the hero wordmark, where the heading IS the
   * interactive centrepiece rather than a label for the content below it.
   */
  interactive?: boolean;
  /**
   * Run one of the per-line cinematic entrances instead of the default per-word
   * mask slide — see `CINEMATIC_MODES` for what each one does and when to reach
   * for it. `true` is accepted as a shorthand for `'push'`.
   *
   * Deliberately opt-in: the masked word reveal is the house style and every
   * ordinary section heading should keep it. These are for the two or three
   * moments on the site that are supposed to stop you.
   */
  cinematic?: boolean | CinematicMode;
  /**
   * Run the entrance on mount rather than on scroll-into-view. Required for
   * above-the-fold headings — mirrors Reveal`s prop of the same name.
   */
  immediate?: boolean;
  className?: string;
  lineClassName?: string;
  /**
   * Per-line classes, indexed to `lines`. Applied IN ADDITION to
   * `lineClassName`.
   *
   * This exists because Tailwind arbitrary variants like
   * `[&:nth-child(3)]:my-class` do not work for plain CSS class names — that
   * syntax composes Tailwind UTILITIES, so pointing it at a hand-written class
   * silently produces no rule at all. Verified: the target line ended up with
   * an empty getAnimations() and no glow. Index the class in instead.
   */
  lineClassNames?: readonly (string | undefined)[];
  /**
   * Per-WORD class, keyed by the word's own text rather than by position —
   * `{ Zero: 'neon-hover-flicker' }` lights up every "Zero" in the heading
   * regardless of which line or index it falls on. Position-keying would break
   * the moment copy changes; text-keying survives it.
   *
   * Matching is EXACT and case-sensitive against the string as it appears in
   * `lines` — NOT against what `.display`'s `text-transform: uppercase` paints
   * on screen. A source string of 'ZERO SIXTY THREE' (as BRAND.wordmark
   * already is) needs a `ZERO` key; a title-case `Zero` key against that same
   * source silently matches zero words. This is exactly how the first real
   * usage of this prop broke — the class rendered on nothing and the intended
   * hover effect simply did not exist. Punctuation splitting is also not
   * performed — "Three." (with a trailing period) will not match a
   * `wordClassNames.Three` key.
   *
   * Works with `cinematic` too, but on a SEPARATE code path (see
   * CinematicWord): the default masked-word reveal already splits every line
   * into per-word spans for its own entrance, so this prop reuses those. The
   * cinematic entrance instead animates a whole line as one block and only
   * splits it into words here, on demand, when this prop is supplied — passing
   * `cinematic` without realising that split did not already exist is how the
   * second real usage of this prop also broke.
   */
  wordClassNames?: Readonly<Record<string, string>>;
}

export function KineticHeading({
  lines,
  as: Tag = 'h2',
  size = 'lg',
  sizeClassName,
  drift = 0,
  delay = 0,
  interactive = false,
  cinematic = false,
  immediate = false,
  className,
  lineClassName,
  lineClassNames,
  wordClassNames,
}: KineticHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const label = lines.join(' ');

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  const Heading = Tag as ElementType;

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        <Heading className={cn('display', sizeClassName || SIZE[size])}>
          {lines.map((line, li) => (
            <span key={line} className={cn('block', lineClassName, lineClassNames?.[li])}>
              {line}
            </span>
          ))}
        </Heading>
      </div>
    );
  }

  // The word stagger runs continuously across lines, so line 2 keeps counting
  // from where line 1 stopped. Computed purely — nothing is mutated mid-render.
  const wordsPerLine = lines.map((line) => line.split(' '));
  const lineStartIndex = wordsPerLine.map((_, i) =>
    wordsPerLine.slice(0, i).reduce((total, words) => total + words.length, 0),
  );

  if (cinematic) {
    const mode: CinematicMode = cinematic === true ? 'push' : cinematic;

    // GRADUATED SIZING — `push` only.
    //
    // Three equal lines of the same word length read as a block of text. Ramping
    // the size turns them into a composition with a direction: the eye enters
    // small and is pulled down and outward to the last line, which lands as the
    // payoff. It also gives the stack a trapezoid silhouette rather than a
    // rectangle, which is what makes it look designed rather than merely typeset.
    //
    // Measured at 1600px, 0.52/0.76/1 resolves to roughly 86 / 126 / 166px. The
    // gap between steps has to be big enough to read as intentional — 0.58/0.8/1
    // was only ~30px between lines and looked like type that had failed to align
    // rather than type that was deliberately graded.
    //
    // `slam` gets its own two-step ramp. The closing CTA is two lines, not three,
    // and it is CENTRED rather than stepped — so the size difference is the only
    // thing giving the pair a hierarchy. A wider jump than push's suits it: the
    // first line is the instruction and the second is the answer, and the answer
    // should be the thing you see from across the room.
    //
    // `lateral` stays uniform on purpose. Those headings already step in from the
    // left via lineClassName padding, and a size ramp on top of a horizontal
    // stagger is two competing systems fighting for the same emphasis.
    const RAMP =
      mode === 'push' ? [0.52, 0.76, 1] : mode === 'slam' ? [0.66, 1] : null;

    return (
      <div ref={ref} className={className}>
        <Heading className={cn('display', sizeClassName || SIZE[size])} aria-label={label}>
          {lines.map((line, li) => (
            <motion.span
              key={`${line}-${li}`}
              className={cn(
                'block',
                // NOTE: the lateral mask is NOT here. lineClassName carries this
                // heading's stepped indent (pl-[8vw] etc), and overflow on the
                // same box makes the mask start at the SECTION edge rather than
                // at the word — so the word wiped in from the far left, crossing
                // its own indent on the way. The mask lives on the inner span
                // inside CinematicWord instead, where it hugs the text.
                lineClassName,
                lineClassNames?.[li],
              )}
              style={{
                ...(drift ? { x } : {}),
                // em on the line, so it multiplies the clamp() the heading has
                // already resolved rather than replacing it.
                ...(RAMP
                  ? {
                      fontSize: `${RAMP[Math.min(li, RAMP.length - 1)] ?? 1}em`,
                      // Optical alignment: the ramp makes each line a different
                      // size, and the default tracking looks slack on the small
                      // line and tight on the large one.
                      letterSpacing: `${-0.01 - li * 0.005}em`,
                    }
                  : {}),
              }}
              aria-hidden="true"
            >
              <CinematicWord
                text={line}
                index={li}
                baseDelay={delay}
                immediate={immediate}
                interactive={interactive}
                mode={mode}
                wordClassNames={wordClassNames}
              />
            </motion.span>
          ))}
        </Heading>
      </div>
    );
  }


  return (
    <div ref={ref} className={className}>
      <Heading className={cn('display', sizeClassName || SIZE[size])} aria-label={label}>
        {wordsPerLine.map((words, li) => (
          <motion.span
            key={`${lines[li]}-${li}`}
            className={cn('block', lineClassName, lineClassNames?.[li])}
            style={drift ? { x } : undefined}
            aria-hidden="true"
          >
            {words.map((word, wi) => (
              <span key={`${word}-${wi}`} className={wordClassNames?.[word]}>
                <Word
                  delay={delay + (lineStartIndex[li] + wi) * STAGGER.tight}
                  interactive={interactive}
                >
                  {word}
                </Word>
                {/* The gap between words has to be OUTSIDE Word's own
                    inline-block box, not a trailing text node inside it —
                    inline-block collapses/traps trailing whitespace at its own
                    end, so a space rendered as the last child of one word's box
                    never became a real gap before the next word's box. It ran
                    words together (BUG: "end to end." rendered as "endtoend.").
                    A literal, non-breaking space here sits between the two
                    boxes instead, where inline layout actually respects it. */}
                {wi < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </motion.span>
        ))}
      </Heading>
    </div>
  );
}

export default KineticHeading;
