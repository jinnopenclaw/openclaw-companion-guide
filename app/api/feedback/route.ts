import { NextRequest, NextResponse } from 'next/server';

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyeAyDi-5EIlxxFyK3o2lkNu53b9q17ArpFOfA0AHcY2UBRaYoFcKn9sygP7sxF5lzJEQ/exec';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);

  const botField = params.get('bot-field') ?? '';
  if (botField.trim() !== '') {
    return NextResponse.redirect(new URL('/thank-you', req.url), 303);
  }

  const email = (params.get('email') ?? '').trim();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.redirect(new URL('/thank-you', req.url), 303);
  }

  const payload = {
    name: params.get('name') ?? '',
    email,
    message: params.get('message') ?? '',
    type: params.get('type') ?? '',
    page: params.get('page') ?? '',
    source: 'feedback',
  };

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[feedback] Apps Script POST failed:', err);
  }

  return NextResponse.redirect(new URL('/thank-you', req.url), 303);
}
