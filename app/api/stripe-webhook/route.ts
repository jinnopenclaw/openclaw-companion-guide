import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { clerkClient } from '@clerk/nextjs/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const clerkUserId = session.metadata?.clerkUserId
    if (!clerkUserId) {
      console.error('No clerkUserId in session metadata')
      return NextResponse.json({ error: 'No user ID' }, { status: 400 })
    }

    try {
      const client = await clerkClient()
      await client.users.updateUser(clerkUserId, {
        publicMetadata: { hasPaid: true },
      })
      console.log(`Marked user ${clerkUserId} as hasPaid: true`)
    } catch (err) {
      console.error('Failed to update Clerk user metadata:', err)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
