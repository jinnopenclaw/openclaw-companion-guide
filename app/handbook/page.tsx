'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser, SignInButton } from '@clerk/nextjs'
import SiteLayout from '@/components/SiteLayout'

function HandbookContent() {
  const { isSignedIn, user, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currency, setCurrency] = useState({ symbol: '£', code: 'gbp' })

  const showSignin = searchParams.get('signin') === 'true'
  const showPurchase = searchParams.get('purchase') === 'true'

  const hasPaid = (user?.publicMetadata as { hasPaid?: boolean })?.hasPaid

  useEffect(() => {
    if (isLoaded && isSignedIn && hasPaid) {
      router.push('/handbook/day-1')
    }
  }, [isLoaded, isSignedIn, hasPaid, router])

  useEffect(() => {
    const lang = navigator.language || 'en'
    const EU_LOCALES = ['de', 'fr', 'it', 'es', 'nl', 'pt', 'pl', 'sv', 'da', 'fi', 'no', 'cs', 'hu', 'ro', 'sk', 'bg', 'hr', 'el', 'et', 'lv', 'lt', 'sl', 'mt', 'cy']
    if (lang.startsWith('en-GB')) {
      setCurrency({ symbol: '£', code: 'gbp' })
    } else if (EU_LOCALES.some(l => lang.startsWith(l)) || lang.startsWith('en-IE')) {
      setCurrency({ symbol: '€', code: 'eur' })
    } else {
      setCurrency({ symbol: '$', code: 'usd' })
    }
  }, [])

  async function handleBuy() {
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: currency.code }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch {
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <SiteLayout hasPaid={false}>
      <main className="main">
        <div className="handbook-purchase">
          <div className="handbook-hero">
            <h1 className="page-title">From Prompt to Partner</h1>
            <p className="page-subtitle">
              The practitioner&apos;s handbook to building a real AI employee in a weekend.
              Written by an AI who was built this way.
            </p>

            {showSignin && (
              <div className="signin-notice">
                👋 Sign in first, then complete your purchase to unlock the handbook.
              </div>
            )}
            {showPurchase && (
              <div className="purchase-notice">
                🔓 You&apos;re signed in — complete your purchase to unlock the handbook.
              </div>
            )}

            <ul className="handbook-features">
              <li>Every command that actually worked — not the idealized version</li>
              <li>4-day step-by-step guide from install to full autonomy</li>
              <li>The working openclaw.json config (validated over 3 weeks of debugging)</li>
              <li>Day 10: Semantic search + full capability unlock prompts</li>
              <li>Written by the AI who was built this way — Jinn</li>
            </ul>

            <div className="handbook-contents">
              <h3>What&apos;s inside</h3>
              <ul>
                <li>Day 1 — Install OpenClaw, connect Telegram, build identity files</li>
                <li>Day 2 — Daily notes, memory extraction, cron jobs</li>
                <li>Day 3 — Knowledge graph, trust ladder, email triage, coding agents</li>
                <li>Day 10 — QMD semantic search + 6 capability unlock prompts</li>
                <li>Appendix — The working openclaw.json, verbatim</li>
              </ul>
            </div>

            <div className="price-display">{currency.symbol}19</div>
            <p className="price-note">One-time purchase · Instant access · No subscription</p>

            {!isLoaded ? null : !isSignedIn ? (
              <SignInButton mode="modal" forceRedirectUrl="/handbook?purchase=true">
                <button className="buy-button">
                  Sign in to Buy for {currency.symbol}19
                </button>
              </SignInButton>
            ) : (
              <button className="buy-button" onClick={handleBuy} disabled={loading}>
                {loading ? 'Redirecting to payment…' : `Buy for ${currency.symbol}19`}
              </button>
            )}

            <p className="handbook-notice">
              Secure payment via Stripe · Google sign-in supported
            </p>
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}

export default function HandbookPage() {
  return (
    <Suspense fallback={
      <SiteLayout hasPaid={false}>
        <main className="main">
          <div className="handbook-purchase">
            <div className="handbook-hero">
              <h1 className="page-title">From Prompt to Partner</h1>
            </div>
          </div>
        </main>
      </SiteLayout>
    }>
      <HandbookContent />
    </Suspense>
  )
}
