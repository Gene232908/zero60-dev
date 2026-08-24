'use client';

import { useState, type FormEvent } from 'react';
import { describeAuthError, isAdminAuthAvailable, signInAdmin } from '@/lib/admin/auth';

/**
 * Admin sign-in — Milestone 3, Developer 2 (Task Division Rev 2, p.4).
 *
 * Email + password against Firebase Auth. Authorisation is NOT decided here:
 * signing in succeeds for any valid account, and AdminGuard then checks the
 * admin custom claim. Keeping the two apart is what makes "signed in but not an
 * administrator" a state we can explain rather than a confusing failure.
 *
 * There is no sign-up path and no password reset by design — admin accounts are
 * created deliberately, and the claim is minted server-side (docs/ADMIN-GUIDE.md).
 */

export default function AdminLoginPage() {
  const available = isAdminAuthAvailable();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signInAdmin(email, password);
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shell flex min-h-[70svh] flex-col justify-center py-[var(--space-xl)]">
      <div className="w-full max-w-[30rem] border border-line p-[var(--space-md)] md:p-[var(--space-lg)]">
        <p className="eyebrow">063 Admin</p>
        <h1 className="display mt-[var(--space-2xs)] text-[clamp(1.5rem,4vw,2.25rem)]">Sign in</h1>

        {!available ? (
          <p className="mt-[var(--space-md)] text-[length:var(--text-sm)] leading-relaxed text-fg-muted">
            Firebase is not configured on this deployment, so there is nothing to sign in to yet.
            The admin side is built and waiting on the project credentials.
            <span className="eyebrow mt-[var(--space-sm)] block">BLOCKER B10a / B10b</span>
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-[var(--space-md)] space-y-[var(--space-sm)]">
            <div>
              <label htmlFor="admin-email" className="eyebrow mb-2 block">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'admin-signin-error' : undefined}
                className="zs-tap w-full border border-line bg-transparent px-4 py-3 text-[length:var(--text-base)] text-fg outline-none transition-colors duration-[var(--dur-fast)] focus:border-accent"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="eyebrow mb-2 block">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'admin-signin-error' : undefined}
                className="zs-tap w-full border border-line bg-transparent px-4 py-3 text-[length:var(--text-base)] text-fg outline-none transition-colors duration-[var(--dur-fast)] focus:border-accent"
              />
            </div>

            {error ? (
              <p
                id="admin-signin-error"
                role="alert"
                className="border-l-2 border-accent pl-3 text-[length:var(--text-sm)] text-fg"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="zs-tap inline-flex w-full items-center justify-center border border-accent bg-accent px-6 py-3 text-[length:var(--text-sm)] uppercase tracking-[0.16em] text-accent-fg transition-colors duration-[var(--dur-fast)] hover:bg-transparent hover:text-accent disabled:opacity-40"
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        <p className="mt-[var(--space-md)] text-[length:var(--text-xs)] leading-relaxed text-fg-faint">
          Administrator access requires the admin claim on the account. Signing in with an ordinary
          account will not grant it.
        </p>
      </div>
    </div>
  );
}
