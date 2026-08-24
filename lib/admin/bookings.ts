'use client';

import { collection, getDocs, orderBy, query, updateDoc, doc } from 'firebase/firestore';
import { getDb, isFirebaseClientConfigured } from '@/lib/firebase/client';
import { COLLECTIONS, type BookingRecord } from '@/lib/firebase/collections';

/**
 * Admin data access.
 *
 * Milestone 3 · Developer 2 · Task Division Rev 2, p.4.
 *
 * Collection names always come from COLLECTIONS (lib/firebase/collections.ts,
 * Developer 1's). Hardcoding "bookings" here would mean a rename on their side
 * silently breaks the admin, so the gate forbids the string literal.
 *
 * READS ARE GATED BY THE SECURITY RULES, NOT BY THIS FILE. firestore.rules only
 * lets `request.auth.token.admin == true` read these collections, so an
 * unauthorised caller gets a permission error from Firestore itself rather than
 * relying on the UI to hide anything.
 *
 * HONEST DEGRADATION: three credentials are still outstanding (BLOCKERS B10a,
 * B10b, B11). Until they arrive this returns an explicit `unconfigured` result.
 * It never returns sample rows — invented bookings in an admin screen would be
 * indistinguishable from real client data during the review call.
 */

export type BookingWithId = BookingRecord & { id: string };

export type BookingsResult =
  /** Firebase project not set up yet — BLOCKER B10a. */
  | { status: 'unconfigured' }
  | { status: 'error'; message: string }
  | { status: 'ok'; bookings: BookingWithId[] };

export async function fetchBookings(): Promise<BookingsResult> {
  if (!isFirebaseClientConfigured()) return { status: 'unconfigured' };

  try {
    const snapshot = await getDocs(
      query(collection(getDb(), COLLECTIONS.bookings), orderBy('createdAt', 'desc')),
    );
    const bookings = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as BookingRecord) }));
    return { status: 'ok', bookings };
  } catch (error) {
    const message =
      typeof error === 'object' && error && 'message' in error
        ? String(error.message)
        : 'Could not read the bookings collection.';
    return { status: 'error', message };
  }
}

/** Persist an admin edit — status change, or the amount actually collected. */
export async function updateBooking(
  id: string,
  patch: Partial<Pick<BookingRecord, 'status' | 'amountCollected' | 'returningCustomer' | 'fromWebsite'>>,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!isFirebaseClientConfigured()) {
    return { ok: false, message: 'Firebase is not configured yet — see BLOCKERS.md B10a.' };
  }
  try {
    await updateDoc(doc(getDb(), COLLECTIONS.bookings, id), {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    return { ok: true };
  } catch (error) {
    const message =
      typeof error === 'object' && error && 'message' in error
        ? String(error.message)
        : 'Could not save the change.';
    return { ok: false, message };
  }
}
