import { NextResponse } from 'next/server';

import { fieldErrorsFrom, inquirySchema } from '@/lib/validation/inquiry';
import { getAdminDb, isAdminConfigured } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { DEFAULT_STATUS } from '@/lib/booking/status';
import { sendInquiryNotification } from '@/lib/email';

/**
 * POST /api/inquiry — the booking/inquiry flow (docs/plan.md §4 M3).
 *
 * Order of operations matters:
 *   1. Honeypot check      — silently accept bots so they stop retrying.
 *   2. Server-side validation with the SHARED schema. Client validation is a
 *      convenience for humans; this is the one that counts.
 *   3. Write to Firestore. If this fails the customer sees an error, because
 *      the enquiry genuinely was not captured.
 *   4. Send the notification. If THIS fails the customer still sees success —
 *      the enquiry is saved, and a mail outage must not read as "your message
 *      did not go through". The failure is logged for us instead.
 *
 * Fields the client is not allowed to set (status, createdAt, fromWebsite) are
 * stamped here, so nobody can submit a booking that claims to be already paid.
 */

// Always run this dynamically — it writes and sends mail.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Malformed request.' }, { status: 400 });
  }

  // --- 1. Honeypot ---------------------------------------------------------
  // A real person never fills a field they cannot see. Return 200 so the bot
  // records a success and moves on rather than retrying.
  const body = payload as Record<string, unknown>;
  if (typeof body?.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }
  delete body?.company;

  // --- 2. Validate ---------------------------------------------------------
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Please check the highlighted fields.',
        fieldErrors: fieldErrorsFrom(parsed.error),
      },
      { status: 422 },
    );
  }
  const inquiry = parsed.data;
  const submittedAt = new Date().toISOString();

  // --- 3. Persist ----------------------------------------------------------
  if (!isAdminConfigured()) {
    // BLOCKER B10b — service-account credentials not yet supplied. Fail loudly
    // and specifically rather than pretending the enquiry was saved.
    console.error('[inquiry] Firebase Admin is not configured; enquiry was NOT saved.');
    return NextResponse.json(
      {
        ok: false,
        message:
          'The enquiry system is not fully configured yet. Please contact us directly in the meantime.',
      },
      { status: 503 },
    );
  }

  let inquiryId: string;
  try {
    const doc = await getAdminDb()
      .collection(COLLECTIONS.inquiries)
      .add({
        ...inquiry,
        // Server-stamped. The security rules reject any document where these
        // do not match, so a forged client write cannot get through either.
        status: DEFAULT_STATUS,
        createdAt: submittedAt,
        fromWebsite: true,
      });
    inquiryId = doc.id;
  } catch (error) {
    console.error('[inquiry] Firestore write failed:', error);
    return NextResponse.json(
      { ok: false, message: 'We could not save your enquiry. Please try again.' },
      { status: 500 },
    );
  }

  // --- 4. Notify (never fatal) --------------------------------------------
  const notification = await sendInquiryNotification(inquiry, submittedAt);
  if (!notification.sent) {
    // The enquiry IS saved. Log loudly so we notice, but do not alarm the customer.
    console.error(
      `[inquiry] ${inquiryId} saved, but notification email was not sent (${notification.reason})`,
      notification.reason === 'send-failed' ? notification.detail : '',
    );
  }

  return NextResponse.json({ ok: true, id: inquiryId, notified: notification.sent });
}
