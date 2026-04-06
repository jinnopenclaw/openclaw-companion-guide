'use client'

import { useEffect } from 'react'
import SiteLayout from '@/components/SiteLayout'

export default function ThankYouPage() {
  useEffect(() => {
    // Clear any form data the browser may have cached
    if (typeof window !== 'undefined') {
      // Reset all forms on the previous page by clearing sessionStorage form state
      sessionStorage.removeItem('oc-feedback-data')
      // Navigate back clears the form — but we also dispatch a storage event
      // so any open tabs reset their forms too
      window.dispatchEvent(new Event('oc-form-reset'))
    }
  }, [])

  return (
    <SiteLayout>
      <main className="main">
        <div className="thankyou-wrap">
          <div className="thankyou-icon">✅</div>
          <h1 className="page-title">Got it, thanks!</h1>
          <p>Your message has been received. Questions from paid users get a guaranteed response within 24 hours. All other questions are answered as soon as we can.</p>
          <a href="/" className="back-btn">← Back to the guide</a>
        </div>
      </main>
    </SiteLayout>
  )
}
