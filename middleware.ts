import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isHandbookContent = createRouteMatcher([
  '/handbook/day-1',
  '/handbook/day-2',
  '/handbook/day-3',
  '/handbook/day-10',
  '/handbook/appendix',
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/before-you-start',
  '/installation',
  '/telegram',
  '/api-keys',
  '/identity',
  '/memory',
  '/tools',
  '/safety',
  '/automation',
  '/heartbeats',
  '/agents',
  '/social',
  '/troubleshooting',
  '/reference',
  '/privacy',
  '/coming-soon',
  '/thank-you',
  '/handbook',
  '/handbook/success',
  '/api/create-checkout-session',
  '/api/stripe-webhook',
  '/api/verify-purchase',
])

export default clerkMiddleware(async (auth, req) => {
  if (isHandbookContent(req)) {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      // Not logged in → redirect to handbook purchase page
      const url = new URL('/handbook', req.url)
      url.searchParams.set('signin', 'true')
      return NextResponse.redirect(url)
    }

    // Check if user has paid
    const hasPaid = (sessionClaims?.metadata as { hasPaid?: boolean })?.hasPaid
    if (!hasPaid) {
      const url = new URL('/handbook', req.url)
      url.searchParams.set('purchase', 'true')
      return NextResponse.redirect(url)
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
