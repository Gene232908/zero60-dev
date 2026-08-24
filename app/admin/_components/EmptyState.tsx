'use client';

import type { RecordsState } from './useBookingRecords';

/**
 * The admin's honest states.
 *
 * Milestone 3 · Developer 2.
 *
 * Three credentials are still outstanding (BLOCKERS B10a, B10b, B11), so the
 * most likely thing management sees on the review call is one of these panels
 * rather than a table. That is deliberate: the alternative — seeding the screen
 * with sample bookings so it "looks finished" — would put invented customer
 * records in front of the client, indistinguishable from real ones.
 *
 * Each state says what is missing and who is chasing it.
 */

export function RecordsPlaceholder({ state }: { state: RecordsState }) {
  if (state.status === 'loading') {
    return <Panel title="Loading records" body="Reading the bookings collection." />;
  }

  if (state.status === 'unconfigured') {
    return (
      <Panel
        title="No database connected yet"
        body="The Firebase project is not configured on this deployment, so there are no records to read. Every screen here is built and will populate the moment the credentials land — no code change needed."
        meta="BLOCKER B10a / B10b — Developer 1 is chasing the project and service-account credentials"
      />
    );
  }

  if (state.status === 'error') {
    return (
      <Panel
        title="Could not read the records"
        body={state.message}
        meta="If this says the caller lacks permission, the signed-in account is missing the admin claim."
      />
    );
  }

  return (
    <Panel
      title="No bookings yet"
      body="The collection is connected and empty. New enquiries from the website appear here automatically once the booking form is live."
    />
  );
}

function Panel({ title, body, meta }: { title: string; body: string; meta?: string }) {
  return (
    <div className="border border-dashed border-line-strong p-[var(--space-md)] md:p-[var(--space-lg)]">
      <h2 className="display text-[clamp(1.25rem,3vw,1.75rem)]">{title}</h2>
      <p className="zs-measure-wide mt-[var(--space-sm)] text-[length:var(--text-base)] leading-relaxed text-fg-muted">
        {body}
      </p>
      {meta ? <p className="eyebrow mt-[var(--space-sm)]">{meta}</p> : null}
    </div>
  );
}

export default RecordsPlaceholder;
