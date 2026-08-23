'use client';

import { useId, useState } from 'react';
import { Reveal } from '@/components/motion';
import {
  EVENT_TYPE_OPTIONS,
  INQUIRY_SOURCES,
  SERVICE_OPTIONS,
  fieldErrorsFrom,
  inquirySchema,
  type InquirySource,
} from '@/lib/validation/inquiry';
import { cn } from '@/lib/utils/cn';

/**
 * BookingForm — the inquiry flow (docs/plan.md §4 M3, Developer 1).
 *
 * Fields are the approved list from plan.md §1: name, email, mobile, event
 * type, date, location, requested services, estimated guests, notes, plus the
 * source-of-inquiry selector. `guests` is required reading for Marco — it is how
 * the sound system gets sized.
 *
 * Validation runs twice against the SAME schema: here for instant feedback, and
 * again on the server where it actually counts. The server's field errors
 * override the local ones, so the customer always sees the authoritative answer.
 *
 * Styled from the brand tokens, so dropping this form onto the 063 Society page
 * would render it in the elegant register with no changes.
 *
 * ⚠️ BLOCKER B13: the final field list is unconfirmed. Change it in
 * lib/validation/inquiry.ts and the form, the API route and the security rules
 * all follow from that one edit.
 */

type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputBase =
  'w-full border-b border-line bg-transparent py-3 text-sm text-fg outline-none ' +
  'transition-colors duration-[var(--dur-micro)] placeholder:text-fg-faint ' +
  'focus:border-accent';

export function BookingForm() {
  const formId = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [source, setSource] = useState<InquirySource>('productions');

  const fid = (name: string) => `${formId}-${name}`;
  const eid = (name: string) => `${formId}-${name}-error`;

  function toggleService(service: string) {
    setServices((current) =>
      current.includes(service) ? current.filter((s) => s !== service) : [...current, service],
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setFormError(null);
    setFieldErrors({});

    const data = new FormData(event.currentTarget);
    const guestsRaw = String(data.get('guests') ?? '').trim();

    const candidate = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      mobile: String(data.get('mobile') ?? ''),
      eventType: String(data.get('eventType') ?? ''),
      date: String(data.get('date') ?? ''),
      location: String(data.get('location') ?? ''),
      services,
      guests: guestsRaw === '' ? undefined : Number(guestsRaw),
      notes: String(data.get('notes') ?? ''),
      source,
      // Honeypot — hidden from people, irresistible to bots.
      company: String(data.get('company') ?? ''),
    };

    // Local pass first, so obvious mistakes never cost a round trip.
    const local = inquirySchema.safeParse(candidate);
    if (!local.success) {
      setFieldErrors(fieldErrorsFrom(local.error));
      setFormError('Please check the highlighted fields.');
      setStatus('error');
      return;
    }

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(result.message ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setFormError('We could not reach the server. Please check your connection and try again.');
      setStatus('error');
    }
  }

  // ---- Thank-you state ----------------------------------------------------
  if (status === 'success') {
    return (
      <Reveal variant="mask" weight="primary">
        <div className="border border-accent p-10 md:p-16" role="status" aria-live="polite">
          <p className="eyebrow mb-5 text-accent">Enquiry received</p>
          <p className="display mb-5 text-[clamp(1.75rem,4vw,3rem)] text-fg">Thank you.</p>
          <p className="max-w-[52ch] text-sm leading-relaxed text-fg-muted">
            Your enquiry is with us and we will be in touch shortly. If it is urgent, call or message
            us directly and we will pick it up faster.
          </p>
        </div>
      </Reveal>
    );
  }

  const busy = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-12 gap-x-6 gap-y-8">
      {/* Honeypot: off-screen, not display:none, so bots still fill it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={fid('company')}>Company (leave this blank)</label>
        <input id={fid('company')} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* ---- Source of inquiry ---- */}
      <fieldset className="col-span-12">
        <legend className="eyebrow mb-4">Which are you contacting?</legend>
        <div className="flex flex-wrap gap-3">
          {INQUIRY_SOURCES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSource(option.value)}
              aria-pressed={source === option.value}
              className={cn(
                'border px-5 py-3 text-[0.68rem] font-medium uppercase tracking-[0.18em]',
                'transition-colors duration-[var(--dur-micro)]',
                source === option.value
                  ? 'border-accent bg-accent text-accent-fg'
                  : 'border-line text-fg-muted hover:border-line-strong hover:text-fg',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Field
        id={fid('name')}
        errorId={eid('name')}
        name="name"
        label="Your name"
        required
        error={fieldErrors.name}
        className="col-span-12 md:col-span-6"
        autoComplete="name"
      />
      <Field
        id={fid('email')}
        errorId={eid('email')}
        name="email"
        type="email"
        label="Email"
        required
        error={fieldErrors.email}
        className="col-span-12 md:col-span-6"
        autoComplete="email"
      />
      <Field
        id={fid('mobile')}
        errorId={eid('mobile')}
        name="mobile"
        type="tel"
        label="Mobile"
        required
        error={fieldErrors.mobile}
        className="col-span-12 md:col-span-6"
        autoComplete="tel"
      />

      {/* ---- Event type ---- */}
      <div className="col-span-12 md:col-span-6">
        <label htmlFor={fid('eventType')} className="eyebrow mb-2 block">
          Event type <span className="text-accent">*</span>
        </label>
        <select
          id={fid('eventType')}
          name="eventType"
          required
          defaultValue=""
          aria-invalid={Boolean(fieldErrors.eventType)}
          aria-describedby={fieldErrors.eventType ? eid('eventType') : undefined}
          className={cn(inputBase, fieldErrors.eventType && 'border-red-500')}
        >
          <option value="" disabled>
            Select an event type
          </option>
          {EVENT_TYPE_OPTIONS.map((option) => (
            <option key={option} value={option} className="bg-bg text-fg">
              {option}
            </option>
          ))}
        </select>
        <FieldError id={eid('eventType')} message={fieldErrors.eventType} />
      </div>

      <Field
        id={fid('date')}
        errorId={eid('date')}
        name="date"
        type="date"
        label="Event date"
        hint="Leave blank if not settled"
        error={fieldErrors.date}
        className="col-span-12 md:col-span-4"
      />
      <Field
        id={fid('location')}
        errorId={eid('location')}
        name="location"
        label="Location"
        hint="Venue or area"
        error={fieldErrors.location}
        className="col-span-12 md:col-span-4"
      />
      <Field
        id={fid('guests')}
        errorId={eid('guests')}
        name="guests"
        type="number"
        label="Estimated guests"
        hint="Helps us size the sound system"
        error={fieldErrors.guests}
        className="col-span-12 md:col-span-4"
        min={1}
      />

      {/* ---- Services ---- */}
      <fieldset className="col-span-12">
        <legend className="eyebrow mb-4">
          Services required <span className="text-accent">*</span>
        </legend>
        <div
          className="flex flex-wrap gap-2.5"
          aria-invalid={Boolean(fieldErrors.services)}
          aria-describedby={fieldErrors.services ? eid('services') : undefined}
        >
          {SERVICE_OPTIONS.map((service) => {
            const selected = services.includes(service);
            return (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                aria-pressed={selected}
                className={cn(
                  'border px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.14em]',
                  'transition-colors duration-[var(--dur-micro)]',
                  selected
                    ? 'border-accent text-accent'
                    : 'border-line text-fg-muted hover:border-line-strong hover:text-fg',
                )}
              >
                {service}
              </button>
            );
          })}
        </div>
        <FieldError id={eid('services')} message={fieldErrors.services} />
      </fieldset>

      {/* ---- Notes ---- */}
      <div className="col-span-12">
        <label htmlFor={fid('notes')} className="eyebrow mb-2 block">
          Anything else we should know?
        </label>
        <textarea
          id={fid('notes')}
          name="notes"
          rows={4}
          aria-invalid={Boolean(fieldErrors.notes)}
          aria-describedby={fieldErrors.notes ? eid('notes') : undefined}
          className={cn(inputBase, 'resize-y', fieldErrors.notes && 'border-red-500')}
          placeholder="Running order, stage size, timings, anything that helps us quote accurately."
        />
        <FieldError id={eid('notes')} message={fieldErrors.notes} />
      </div>

      {/* ---- Error state ---- */}
      {formError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="col-span-12 border border-red-500/60 bg-red-500/5 px-5 py-4"
        >
          <p className="text-sm text-red-400">{formError}</p>
        </div>
      ) : null}

      {/* ---- Submit ---- */}
      <div className="col-span-12 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={busy}
          className={cn(
            'border border-accent bg-accent px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-accent-fg',
            'transition-opacity duration-[var(--dur-micro)]',
            busy && 'cursor-wait opacity-60',
          )}
        >
          {busy ? 'Sending…' : 'Send enquiry'}
        </button>
        <p className="text-xs text-fg-faint">
          <span className="text-accent">*</span> Required. We reply by email or phone.
        </p>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-xs text-red-400">
      {message}
    </p>
  );
}

type FieldProps = {
  id: string;
  errorId: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  autoComplete?: string;
  min?: number;
};

function Field({
  id,
  errorId,
  name,
  label,
  type = 'text',
  required = false,
  hint,
  error,
  className,
  autoComplete,
  min,
}: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow mb-2 block">
        {label} {required ? <span className="text-accent">*</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        min={min}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(inputBase, error && 'border-red-500')}
      />
      {hint && !error ? <p className="mt-2 text-xs text-fg-faint">{hint}</p> : null}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export default BookingForm;
