'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

/**
 * LiteYouTube — a facade embed.
 *
 * Milestone 2 · Developer 2 · Task Division Rev 2, p.3:
 * "the YouTube video sections using performant lite-YouTube embeds".
 *
 * WHY THIS EXISTS
 * A standard <iframe> YouTube player pulls roughly half a megabyte of
 * third-party JavaScript per video, before the visitor has decided to watch
 * anything. On a portfolio page with several videos that alone would blow the
 * performance budget the whole build is held to (docs/plan.md §5, R-1).
 *
 * So nothing from youtube.com is requested on load. The page renders a poster
 * image and a real <button>; the iframe is created only when the visitor
 * activates it, and it autoplays at that point because the click *was* the
 * intent to play.
 *
 * The gate enforces both halves of this: the iframe must be behind an
 * activation state (dev2-m2 check A3), and no youtube.com/embed URL may appear
 * in the server-rendered HTML of any page (dev2-m2 route `forbid`, and again in
 * dev2-m4 as a page-speed probe).
 *
 * PRIVACY: youtube-nocookie.com is used so no tracking cookie is set until the
 * visitor deliberately plays a video.
 *
 * Reduced motion: there is nothing to reduce — the facade is static, and
 * activation is a click, never an autoplay-on-scroll.
 */

export interface LiteYouTubeProps {
  /** The YouTube watch id. Supplied by the client — see BLOCKER B9. */
  videoId: string;
  /** Accessible, human title. Becomes the iframe title and the button label. */
  title: string;
  /** Poster frame. Falls back to YouTube's own thumbnail host when absent. */
  poster?: { src: string; alt: string; width: number; height: number };
  className?: string;
}

export function LiteYouTube({ videoId, title, poster, className }: LiteYouTubeProps) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden border border-line bg-bg-raised',
        className,
      )}
    >
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {poster ? (
            <Image
              src={poster.src}
              alt={poster.alt}
              width={poster.width}
              height={poster.height}
              sizes="(max-width: 48rem) 100vw, (max-width: 64rem) 50vw, 40vw"
              className="h-full w-full object-cover grayscale transition-[filter] duration-[var(--dur-base)] group-hover:grayscale-0"
            />
          ) : (
            <span className="absolute inset-0 bg-bg-raised" />
          )}

          {/* Play affordance — drawn, not imported, so it costs nothing. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent bg-bg/70 transition-colors duration-[var(--dur-fast)] group-hover:bg-accent md:h-20 md:w-20"
          >
            <span className="ml-1 block h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-accent transition-colors duration-[var(--dur-fast)] group-hover:border-l-accent-fg" />
          </span>

          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-bg/90 to-transparent p-[var(--space-sm)] text-left md:p-[var(--space-md)]">
            <span className="display text-[clamp(0.95rem,1.8vw,1.35rem)] text-fg">{title}</span>
            <span className="eyebrow shrink-0">Play</span>
          </span>
        </button>
      )}
    </div>
  );
}

export default LiteYouTube;
