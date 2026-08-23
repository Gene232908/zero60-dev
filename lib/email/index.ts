import 'server-only';

import { getTransport, isEmailConfigured, MAIL_FROM, NOTIFICATION_TO } from './transport';
import { inquiryHtml, inquirySubject, inquiryText } from './templates';
import type { InquiryInput } from '@/lib/validation/inquiry';

export { isEmailConfigured } from './transport';

export type NotifyResult =
  | { sent: true }
  | { sent: false; reason: 'not-configured' | 'send-failed'; detail?: string };

/**
 * Send the new-inquiry notification.
 *
 * Never throws. The caller has already saved the enquiry by this point, and a
 * mail-server problem must not turn a captured lead into an error page for the
 * customer. Failures are reported back so the route can log them.
 */
export async function sendInquiryNotification(
  inquiry: InquiryInput,
  submittedAt: string,
): Promise<NotifyResult> {
  if (!isEmailConfigured()) {
    return { sent: false, reason: 'not-configured' };
  }

  try {
    await getTransport().sendMail({
      from: MAIL_FROM,
      to: NOTIFICATION_TO,
      replyTo: inquiry.email,
      subject: inquirySubject(inquiry),
      text: inquiryText(inquiry, submittedAt),
      html: inquiryHtml(inquiry, submittedAt),
    });
    return { sent: true };
  } catch (error) {
    return {
      sent: false,
      reason: 'send-failed',
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}
