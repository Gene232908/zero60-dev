import Image from 'next/image';
import { Reveal } from '@/components/motion';
import { SERVICES } from '@/content/site';
import { SCENES, TILES, BENTO } from '@/content/media';
import { cn } from '@/lib/utils/cn';
import type { Media } from '@/content/media';

/**
 * ServicesBento — the eight service lines as a bento layout.
 *
 * A bento only works if the tiles genuinely differ; eight equal rectangles is
 * just a card grid with extra steps. So the sizes vary (7/5, 4/4/4, 6/6) and the
 * lead tile is double height.
 *
 * Sports announcing and hosting used to render without a photograph, because no
 * usable image existed for either — the layout absorbed the content gap rather
 * than advertising it. Management has since supplied both, so all eight tiles
 * now carry imagery and the rhythm comes from the sizes alone.
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
  // No drums frame was supplied in the delivery, and the old one is a 512x408
  // screenshot crop. TILES.guitar is a guitarist mid-performance, which is
  // exactly what this tile is about — a real photograph beats a sharp label.
  'singers-performers': { span: 'md:col-span-5', media: TILES.guitar },
  'dj-services': { span: 'md:col-span-5', media: SCENES.djDecks },
  'sound-engineering': { span: 'md:col-span-4', media: SCENES.soundEngineer },
  // These two were deliberately text-only while no imagery existed for them.
  // Management supplied both, so they are filled.
  'sports-announcing': { span: 'md:col-span-4', media: BENTO.sportsAnnouncing },
  'hosting-emcee': { span: 'md:col-span-4', media: BENTO.hostingEmcee },
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
              // The feature tile leads and the rest settle in behind it, so the
              // grid has a first beat instead of arriving as one flat block.
              variant={tile.feature ? 'lead' : 'settle'}
              weight={tile.feature ? 'primary' : 'secondary'}
              delay={tile.feature ? 0 : 0.08 + i * 0.05}
              className={cn('col-span-1', tile.span)}
            >
              <article className="group relative flex h-full flex-col justify-between overflow-hidden border border-line p-6 transition-colors duration-[var(--dur-base)] ease-[var(--ease-brand)] focus-within:border-accent hover:border-accent md:p-8">
                {/* The tile's own hairline, drawn on approach. The design system
                    calls for "thin lime hairline accents" — this is that accent
                    doing the work a generic border-colour change was doing. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-slow)] ease-[var(--ease-signature)] group-focus-within:scale-x-100 group-hover:scale-x-100"
                />
                {tile.media ? (
                  <div className="absolute inset-0 -z-10 opacity-25 transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-brand)] group-hover:opacity-40">
                    <Image
                      src={tile.media.src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      // Held slightly overscanned so the drift below never
                      // exposes an edge. The photograph eases UP as you approach
                      // rather than zooming at you: the stock bento zoom is the
                      // first thing that reads as a template.
                      className="photo-mono scale-[1.06] object-cover group-hover:translate-y-[-2%]"
                    />
                  </div>
                ) : null}

                <div className="flex items-start justify-between gap-4">
                  <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                  <span
                    aria-hidden="true"
                    className="translate-x-[-4px] rotate-45 text-accent opacity-0 transition-[opacity,transform] duration-[var(--dur-fast)] ease-[var(--ease-overshoot)] group-focus-within:translate-x-0 group-focus-within:rotate-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:rotate-0 group-hover:opacity-100"
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
