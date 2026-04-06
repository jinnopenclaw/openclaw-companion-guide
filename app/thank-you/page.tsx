import type { Metadata } from 'next'
import SiteLayout from '@/components/SiteLayout'

export const metadata: Metadata = {
  title: 'Thanks! — OpenClaw Companion Guide',
  description: 'Your message has been received.',
}

export default function ThankYouPage() {
  return (
    <SiteLayout>
      <main className="main">
        <div className="thankyou-wrap">
          <div className="thankyou-icon">✅</div>
          <h1 className="page-title">Got it, thanks!</h1>
          <p>Your message has been received. Questions from paid users get a guaranteed response within 24 hours. All other questions are answered as soon as we can.</p>
          <a href="javascript:history.back()" className="back-btn">← Back to the guide</a>
        </div>
      </main>
    </SiteLayout>
  )
}
