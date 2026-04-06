'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import SiteLayout from '@/components/SiteLayout'
import { Suspense } from 'react'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const [backUrl, setBackUrl] = useState('/')

  useEffect(() => {
    const from = searchParams.get('from')
    if (from) {
      try {
        const url = new URL(from)
        // Only use if same origin
        if (url.origin === window.location.origin) {
          setBackUrl(from)
        }
      } catch {
        // invalid URL, use default
      }
    }
  }, [searchParams])

  return (
    <SiteLayout>
      <main className="main">
        <div className="thankyou-wrap">
          <div className="thankyou-icon">✅</div>
          <h1 className="page-title">Got it, thanks!</h1>
          <p>Your message has been received. Questions from paid users get a guaranteed response within 24 hours. All other questions are answered as soon as we can.</p>
          <a href={backUrl} className="back-btn">← Back to the guide</a>
        </div>
      </main>
    </SiteLayout>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  )
}
