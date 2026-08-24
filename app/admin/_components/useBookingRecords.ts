'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchBookings, updateBooking, type BookingWithId, type BookingsResult } from '@/lib/admin/bookings';
import type { BookingRecord } from '@/lib/firebase/collections';

/**
 * Shared booking state for the admin screens.
 *
 * Milestone 3 · Developer 2.
 *
 * Both the Overview (monthly summary + invoice) and the Records screen read the
 * same list, so it lives here rather than being fetched twice with two chances
 * to disagree.
 *
 * Edits are applied optimistically and rolled back if Firestore rejects them.
 * The security rules are the authority: a write the rules refuse must not leave
 * the screen showing a change that did not happen.
 */

export type RecordsState =
  | { status: 'loading' }
  | { status: 'unconfigured' }
  | { status: 'error'; message: string }
  | { status: 'ok'; bookings: BookingWithId[] };

/** Stable empty reference, so `bookings` does not change identity every render. */
const NO_BOOKINGS: BookingWithId[] = [];

function toState(result: BookingsResult): RecordsState {
  if (result.status === 'ok') return { status: 'ok', bookings: result.bookings };
  if (result.status === 'unconfigured') return { status: 'unconfigured' };
  return { status: 'error', message: result.message };
}

export function useBookingRecords() {
  const [state, setState] = useState<RecordsState>({ status: 'loading' });
  const [saveError, setSaveError] = useState<string | null>(null);

  /**
   * Latest state, readable from an event handler without making it a dependency
   * of `patch`. Synced in an effect, never assigned during render.
   */
  const latest = useRef<RecordsState>(state);
  useEffect(() => {
    latest.current = state;
  }, [state]);

  // The initial read. State is only set once the fetch resolves — never
  // synchronously inside the effect body.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await fetchBookings();
      if (!cancelled) setState(toState(result));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Manual refresh. Safe to show a loading state here — this is an event, not an effect. */
  const reload = useCallback(async () => {
    setState({ status: 'loading' });
    setState(toState(await fetchBookings()));
  }, []);

  const patch = useCallback(async (id: string, changes: Partial<BookingRecord>) => {
    const before = latest.current;
    if (before.status !== 'ok') return;

    setSaveError(null);
    setState({
      status: 'ok',
      bookings: before.bookings.map((b) => (b.id === id ? { ...b, ...changes } : b)),
    });

    const result = await updateBooking(id, changes);
    if (!result.ok) {
      setSaveError(result.message);
      setState(before);
    }
  }, []);

  /** Convenience for the screens: the list, or a stable empty array. */
  const bookings = useMemo(
    () => (state.status === 'ok' ? state.bookings : NO_BOOKINGS),
    [state],
  );

  return { state, bookings, patch, reload, saveError };
}
