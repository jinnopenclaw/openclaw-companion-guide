import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTIFY_EMAIL = 'jinnopenclaw@gmail.com';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);

  // Honeypot check
  if ((params.get('bot-field') ?? '').trim() !== '') {
    return buildRedirect(req);
  }

  const email = (params.get('email') ?? '').trim();
  if (!email || !EMAIL_RE.test(email)) {
    return buildRedirect(req);
  }

  const name = params.get('name') ?? '';
  const message = params.get('message') ?? '';
  const type = params.get('type') ?? 'question';
  const page = params.get('page') ?? '';

  try {
    await resend.emails.send({
      from: 'OpenClaw Companion <onboarding@resend.dev>',
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: `📬 New ${type} from ${page || 'the guide'}`,
      text: [
        `Name: ${name || 'not provided'}`,
        `Email: ${email}`,
        `Page: ${page}`,
        `Type: ${type}`,
        ``,
        message,
      ].join('\n'),
    });
    console.log('[feedback] Email sent via Resend');
  } catch (err) {
    console.error('[feedback] Resend failed:', err);
  }

  return buildRedirect(req);
}

function buildRedirect(req: NextRequest) {
  const referer = req.headers.get('referer') ?? '';
  const thankYouUrl = new URL('/thank-you', req.url);
  if (referer) {
    try {
      const ref = new URL(referer);
      if (ref.origin === new URL(req.url).origin) {
        thankYouUrl.searchParams.set('from', ref.pathname);
      }
    } catch {}
  }
  return NextResponse.redirect(thankYouUrl, 303);
}
