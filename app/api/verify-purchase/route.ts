import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'No session ID' }, { status: 400 })
    }

    // Verify the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ success: false, error: 'Payment not completed' })
    }

    // Update Clerk metadata if not already done (backup in case webhook was delayed)
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const alreadyPaid = (user.publicMetadata as { hasPaid?: boolean })?.hasPaid

    if (!alreadyPaid) {
      await client.users.updateUser(userId, {
        publicMetadata: { hasPaid: true },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify purchase error:', error)
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ hasPaid: false })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const hasPaid = (user.publicMetadata as { hasPaid?: boolean })?.hasPaid ?? false

    return NextResponse.json({ hasPaid })
  } catch (error) {
    console.error('Verify purchase GET error:', error)
    return NextResponse.json({ hasPaid: false })
  }
}
