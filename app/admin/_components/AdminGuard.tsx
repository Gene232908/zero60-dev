'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOutAdmin, watchAdminAuth, type AdminAuthState } from '@/lib/admin/auth';

/**
 * AdminGuard — nothing inside the admin renders until the admin claim is proven.
 *
 * Milestone 3 · Developer 2 · Task Division Rev 2, p.4.
 *
 * This is the UI half of the guard. The half that actually protects the data is
 * firestore.rules, which refuses every read without
 * `request.auth.token.admin == true` — so a determined visitor who bypassed this
 * component would reach an empty shell and a wall of permission errors, not
 * client records.
 *
 * The four non-admin states are shown explicitly rather than collapsed into one
 * "access denied", because they need different actions: an unconfigured project
 * is Developer 1's credential blocker, whereas a signed-in user without the
 * claim needs the claim minting.
 *
 * The sign-in route is the one exception: it lives under the same layout, so the
 * guard passes it straight through. Guarding it would redirect it to itself.
 */

/** The only admin route reachable without the claim. */
const LOGIN_ROUTE = '/admin/login';

export function AdminGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({ status: 'loading' });
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === LOGIN_ROUTE;

  useEffect(() => watchAdminAuth(setState), []);

  useEffect(() => {
    if (!isLogin && state.status === 'signed-out') router.replace(LOGIN_ROUTE);
    if (isLogin && state.status === 'admin') router.replace('/admin');
  }, [isLogin, state.status, router]);

  // The sign-in screen renders itself; everything else waits for the claim.
  if (isLogin) return <>{children}</>;

  if (state.status === 'loading') {
    return <AdminNotice title="Checking your session" body="One moment." />;
  }

  if (state.status === 'unconfigured') {
    return (
      <AdminNotice
        title="Admin is not connected yet"
        body="The Firebase project has not been configured on this deployment, so there is nothing to sign in to. The admin side is built and waiting on the credentials."
        meta="BLOCKER B10a / B10b — Firebase project and service-account credentials"
      />
    );
  }

  if (state.status === 'signed-out') {
    return <AdminNotice title="Signing you out" body="Redirecting to the sign-in screen." />;
  }

  if (state.status === 'not-admin') {
    return (
      <AdminNotice
        title="This account is not an administrator"
        body={
          'You are signed in, but this account does not carry the admin claim, so Firestore will refuse every read. An administrator must grant the claim before this account can be used here.'
        }
        meta={state.email ?? undefined}
        action={
          <button
            type="button"
            onClick={() => signOutAdmin()}
            className="zs-tap inline-flex items-center border border-line-strong px-6 py-3 text-[length:var(--text-sm)] uppercase tracking-[0.16em] transition-colors duration-[var(--dur-fast)] hover:border-accent hover:text-accent"
          >
            Sign out
          </button>
        }
      />
    );
  }

  return <>{children}</>;
}

/** Shared full-height panel for every non-authorised state. */
export function AdminNotice({
  title,
  body,
  meta,
  action,
}: {
  title: string;
  body: string;
  meta?: string;
  action?: ReactNode;
}) {
  return (
    <div className="shell flex min-h-[70svh] flex-col justify-center py-[var(--space-xl)]">
      <div className="max-w-[46rem] border border-line p-[var(--space-md)] md:p-[var(--space-lg)]">
        <p className="eyebrow">063 Admin</p>
        <h1 className="display mt-[var(--space-sm)] text-[clamp(1.5rem,4vw,2.5rem)]">{title}</h1>
        <p className="mt-[var(--space-sm)] text-[length:var(--text-base)] leading-relaxed text-fg-muted">
          {body}
        </p>
        {meta ? <p className="eyebrow mt-[var(--space-sm)]">{meta}</p> : null}
        <div className="mt-[var(--space-md)] flex flex-wrap items-center gap-[var(--space-sm)]">
          {action}
          <Link
            href="/"
            className="text-[length:var(--text-sm)] text-fg-faint underline-offset-4 transition-colors duration-[var(--dur-micro)] hover:text-accent"
          >
            Back to the website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminGuard;
