import 'server-only';

import type { InquiryInput } from '@/lib/validation/inquiry';

/**
 * New-inquiry notification email.
 *
 * Written to be read on a phone, because that is where it will be read. The
 * three things needed to act on a lead — who, when, and how to reach them — come
 * first; everything else is detail underneath.
 *
 * Plain text is generated alongside the HTML: some mail clients prefer it, and
 * it is what shows in a notification preview.
 */

const BRAND_LIME = '#ADFF2A';
const INK = '#0A0A0A';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label: string, value: string | undefined | null): string {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #e6e6e6;color:#666;font-size:12px;
                 text-transform:uppercase;letter-spacing:.12em;width:150px;vertical-align:top;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #e6e6e6;color:${INK};font-size:15px;">
        ${escapeHtml(value)}
      </td>
    </tr>`;
}

export function inquirySubject(inquiry: InquiryInput): string {
  const brand = inquiry.source === 'society' ? '063 Society' : '063 Productions';
  return `New enquiry — ${inquiry.name} · ${inquiry.eventType} · ${brand}`;
}

export function inquiryHtml(inquiry: InquiryInput, submittedAt: string): string {
  const brand = inquiry.source === 'society' ? '063 Society' : '063 Productions';

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f5f5f3;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
           style="max-width:640px;margin:0 auto;background:#fff;">
      <tr>
        <td style="background:${INK};padding:24px 28px;">
          <p style="margin:0;color:${BRAND_LIME};font-size:11px;letter-spacing:.24em;
                    text-transform:uppercase;">New enquiry</p>
          <p style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:bold;">
            ${escapeHtml(inquiry.name)}
          </p>
          <p style="margin:4px 0 0;color:#999;font-size:13px;">via ${escapeHtml(brand)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            ${row('Email', inquiry.email)}
            ${row('Mobile', inquiry.mobile)}
            ${row('Event type', inquiry.eventType)}
            ${row('Date', inquiry.date || 'Not specified')}
            ${row('Location', inquiry.location || 'Not specified')}
            ${row('Estimated guests', inquiry.guests ? String(inquiry.guests) : 'Not specified')}
            ${row('Services', inquiry.services.join(', '))}
            ${row('Notes', inquiry.notes || '—')}
            ${row('Submitted', submittedAt)}
          </table>

          <p style="margin:24px 0 0;">
            <a href="mailto:${escapeHtml(inquiry.email)}"
               style="display:inline-block;background:${BRAND_LIME};color:${INK};
                      padding:12px 22px;text-decoration:none;font-size:12px;font-weight:bold;
                      letter-spacing:.16em;text-transform:uppercase;">
              Reply to ${escapeHtml(inquiry.name)}
            </a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;background:#fafafa;color:#999;font-size:11px;">
          Sent automatically by the zerosixtythree.com enquiry form.
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function inquiryText(inquiry: InquiryInput, submittedAt: string): string {
  const brand = inquiry.source === 'society' ? '063 Society' : '063 Productions';
  return [
    `NEW ENQUIRY — ${brand}`,
    '',
    `Name:      ${inquiry.name}`,
    `Email:     ${inquiry.email}`,
    `Mobile:    ${inquiry.mobile}`,
    `Event:     ${inquiry.eventType}`,
    `Date:      ${inquiry.date || 'Not specified'}`,
    `Location:  ${inquiry.location || 'Not specified'}`,
    `Guests:    ${inquiry.guests ?? 'Not specified'}`,
    `Services:  ${inquiry.services.join(', ')}`,
    '',
    'Notes:',
    inquiry.notes || '—',
    '',
    `Submitted: ${submittedAt}`,
  ].join('\n');
}
