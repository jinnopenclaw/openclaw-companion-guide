'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      return
    }

    fetch('/api/verify-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success')
          setTimeout(() => router.push('/handbook/day-1'), 3000)
        } else {
          setStatus('error')
        }
      })
      .catch(() => setStatus('error'))
  }, [sessionId, router])

  return (
    <SiteLayout hasPaid={status === 'success'}>
      <main className="main">
        <div className="success-wrap">
          {status === 'loading' && (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
              <h1 className="page-title">Confirming your purchase…</h1>
              <p>Just a moment while we verify your payment.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
              <h1 className="page-title">Handbook Unlocked!</h1>
              <p>Your purchase is confirmed. You now have full access to the handbook.</p>
              <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                Redirecting to Day 1 in a moment…
              </p>
              <Link href="/handbook/day-1" className="buy-button" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                Start Reading →
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
              <h1 className="page-title">Something went wrong</h1>
              <p>We couldn&apos;t confirm your purchase. If you were charged, please contact us and we&apos;ll sort it out immediately.</p>
              <Link href="/handbook" className="nav-button" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                Back to Handbook
              </Link>
            </>
          )}
        </div>
      </main>
    </SiteLayout>
  )
}

export default function HandbookSuccessPage() {
  return (
    <Suspense fallback={
      <SiteLayout hasPaid={false}>
        <main className="main">
          <div className="success-wrap">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
            <p>Verifying your purchase…</p>
          </div>
        </main>
      </SiteLayout>
    }>
      <SuccessContent />
    </Suspense>
  )
}
