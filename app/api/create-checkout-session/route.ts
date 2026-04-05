import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    // Determine currency from request headers or body
    const body = await req.json().catch(() => ({}))
    let currency = body.currency as string | undefined

    if (!currency) {
      // Fallback: detect from Accept-Language header
      const acceptLang = req.headers.get('accept-language') || ''
      const cfCountry = req.headers.get('cf-ipcountry') || ''

      const EU_COUNTRIES = new Set([
        'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI',
        'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
        'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
      ])

      if (acceptLang.toLowerCase().includes('en-gb') || cfCountry === 'GB') {
        currency = 'gbp'
      } else if (EU_COUNTRIES.has(cfCountry.toUpperCase())) {
        currency = 'eur'
      } else {
        currency = 'usd'
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://clawcompanion.ai'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: 1900, // £19 / €19 / $19 in pence/cents
            product_data: {
              name: 'OpenClaw Handbook — From Prompt to Partner',
              description: 'The practitioner\'s guide to building a real AI employee in a weekend. Day 1–10 + Appendix.',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/handbook/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/handbook`,
      // Pass Clerk userId in metadata so webhook can update the user
      metadata: {
        clerkUserId: userId || '',
      },
      // Allow Google Pay, Apple Pay
      payment_method_options: {
        card: {
          setup_future_usage: undefined,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
