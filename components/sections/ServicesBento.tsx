import Image from 'next/image';
import { Reveal } from '@/components/motion';
import { SERVICES } from '@/content/site';
import { SCENES } from '@/content/media';
import { cn } from '@/lib/utils/cn';
import type { Media } from '@/content/media';

/**
 * ServicesBento — the eight service lines as a bento layout.
 *
 * A bento only works if the tiles genuinely differ; eight equal rectangles is
 * just a card grid with extra steps. So the sizes vary (7/5, 4/4/4, 6/6), two
 * tiles carry no image at all, and the lead tile is double height.
 *
 * The two image-less tiles are not a shortfall — they are the rhythm. They also
 * happen to be the two disciplines with no usable photograph in the supplied
 * material (sports announcing and hosting), so the layout absorbs a content gap
 * instead of advertising it.
 *
 * All eight descriptions are the client's own copy, verbatim from the live site.
 */

type Tile = {
  span: string;
  media: Media | null;
  /** Render the description at display size rather than body size. */
  feature?: boolean;
};

/** Keyed by service id so a reordering of SERVICES cannot silently misalign. */
const LAYOUT: Record<string, Tile> = {
  'audio-rental': { span: 'md:col-span-7 md:row-span-2', media: SCENES.audioDesk, feature: true },
  'singers-performers': { span: 'md:col-span-5', media: SCENES.drums },
  'dj-services': { span: 'md:col-span-5', media: SCENES.djDecks },
  'sound-engineering': { span: 'md:col-span-4', media: SCENES.soundEngineer },
  'sports-announcing': { span: 'md:col-span-4', media: null },
  'hosting-emcee': { span: 'md:col-span-4', media: null },
  videography: { span: 'md:col-span-6', media: SCENES.videoCamera },
  photography: { span: 'md:col-span-6', media: SCENES.photoLens },
};

export function ServicesBento() {
  return (
    <section className="shell py-[var(--section-y)]">
      <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-12">
        {SERVICES.map((service, i) => {
          const tile = LAYOUT[service.id] ?? { span: 'md:col-span-6', media: null };

          return (
            <Reveal
              key={service.id}
              variant="rise"
              weight="secondary"
              delay={(i % 3) * 0.06}
              className={cn('col-span-1', tile.span)}
            >
              <article className="group relative flex h-full flex-col justify-between overflow-hidden border border-line p-6 transition-colors duration-[var(--dur-base)] hover:border-accent md:p-8">
                {tile.media ? (
                  <div className="absolute inset-0 -z-10 opacity-25 transition-opacity duration-[var(--dur-slow)] group-hover:opacity-40">
                    <Image
                      src={tile.media.src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[var(--dur-cinematic)] ease-[var(--ease-out)] group-hover:scale-105"
                    />
                  </div>
                ) : null}

                <div className="flex items-start justify-between gap-4">
                  <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                  <span
                    aria-hidden="true"
                    className="text-accent opacity-0 transition-opacity duration-[var(--dur-fast)] group-hover:opacity-100"
                  >
                    &#9670;
                  </span>
                </div>

                <div className={cn('pt-16', tile.feature && 'pt-24 md:pt-40')}>
                  {/* The title is broken across lines for the composition, which
                      would otherwise leave assistive tech reading two fragments.
                      aria-label restores the whole name. */}
                  <h2
                    aria-label={service.label}
                    className={cn(
                      'display mb-4 text-fg',
                      tile.feature
                        ? 'text-[clamp(2rem,5vw,3.5rem)]'
                        : 'text-[clamp(1.35rem,2.6vw,2rem)]',
                    )}
                  >
                    {service.title.map((line) => (
                      <span key={line} aria-hidden="true" className="block">
                        {line}
                      </span>
                    ))}
                  </h2>

                  <p
                    className={cn(
                      'leading-relaxed text-fg-muted',
                      tile.feature ? 'max-w-[52ch] text-sm' : 'max-w-[46ch] text-[0.82rem]',
                    )}
                  >
                    {service.description}
                  </p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default ServicesBento;
