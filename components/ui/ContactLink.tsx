import { cn } from '@/lib/utils/cn';

/**
 * ContactLink — the phone/email treatment used wherever the site offers a way
 * to reach someone (FinalCTA, BookingSection, SocietyCTA).
 *
 * These are the two things on any page a visitor actually reaches for, and they
 * used to be plain text that changed colour on hover — the most default
 * interaction there is. Here the accent hairline draws in under the label from
 * the left and retracts to the right on leave, so the gesture has a direction
 * rather than simply toggling.
 *
 * States: idle / hover / focus-visible / active. Keyboard focus gets the same
 * treatment as hover rather than the blanket outline, so tabbing through the
 * contact block reads the same way pointing at it does.
 *
 * Motion resolves through --ease-brand and --press-scale, which differ per
 * data-brand — the same link presses harder under Productions than it does
 * under Society, with no per-mood markup.
 */
export function ContactLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        'group relative inline-block text-fg',
        'transition-[color,transform] duration-[var(--dur-micro)] ease-[var(--ease-brand)]',
        'hover:text-accent focus-visible:text-accent',
        'active:scale-[var(--press-scale)] active:ease-[var(--ease-press)]',
        'focus-visible:outline-none',
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          'absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-accent',
          'transition-transform duration-[var(--dur-fast)] ease-[var(--ease-signature)]',
          'group-hover:origin-left group-hover:scale-x-100',
          'group-focus-visible:origin-left group-focus-visible:scale-x-100',
        )}
      />
    </a>
  );
}

export default ContactLink;
