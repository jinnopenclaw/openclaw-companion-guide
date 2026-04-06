import { NextRequest, NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);

  // Honeypot check
  const botField = params.get('bot-field') ?? '';
  if (botField.trim() !== '') {
    return buildRedirect(req);
  }

  const email = (params.get('email') ?? '').trim();
  if (!email || !EMAIL_RE.test(email)) {
    return buildRedirect(req);
  }

  // Forward to Netlify Forms via the static detection page at /netlify-forms.html
  // Netlify intercepts POSTs to any URL on the site that include form-name
  const formData = new URLSearchParams();
  formData.set('form-name', 'companion-feedback');
  formData.set('bot-field', '');
  formData.set('name', params.get('name') ?? '');
  formData.set('email', email);
  formData.set('message', params.get('message') ?? '');
  formData.set('type', params.get('type') ?? '');
  formData.set('page', params.get('page') ?? '');

  try {
    const netlifyRes = await fetch('https://clawcompanion.ai/netlify-forms.html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    console.log('[feedback] Netlify Forms status:', netlifyRes.status);
  } catch (err) {
    console.error('[feedback] Netlify Forms POST failed:', err);
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
