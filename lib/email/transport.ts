import 'server-only';

import nodemailer, { type Transporter } from 'nodemailer';

/**
 * SMTP transport — Nodemailer with the client's own mail server.
 *
 * Every credential comes from an environment variable. Nothing is committed.
 *
 * ⚠️ BLOCKERS B11/B12: the SMTP details and the notification address have not
 * been supplied. isEmailConfigured() reports that honestly so the API route can
 * still save an enquiry and simply log that no notification went out — an
 * unconfigured mailbox must never cost the client a lead.
 */

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT ?? 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

export const MAIL_FROM = process.env.SMTP_FROM;
export const NOTIFICATION_TO = process.env.INQUIRY_NOTIFICATION_EMAIL;

export function isEmailConfigured(): boolean {
  return Boolean(host && user && pass && MAIL_FROM && NOTIFICATION_TO);
}

let cached: Transporter | null = null;

export function getTransport(): Transporter {
  if (!isEmailConfigured()) {
    throw new Error('SMTP is not configured. Set the SMTP_* variables — see .env.example.');
  }
  if (!cached) {
    cached = nodemailer.createTransport({
      host,
      port,
      // 465 is implicit TLS; 587 upgrades via STARTTLS.
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return cached;
}
