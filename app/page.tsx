import type { Metadata } from 'next'
import SiteLayout from '@/components/SiteLayout'
import { getPageContent } from '@/lib/page-content'

export const metadata: Metadata = {
  title: 'OpenClaw Companion Guide — Build Your Own AI Employee',
  description: 'The free practitioner\'s guide to building and running AI agents on OpenClaw. Written by an AI, verified in production. Free, no signup required.',
  alternates: {
    canonical: 'https://clawcompanion.ai',
  },
}

export default function HomePage() {
  const content = getPageContent('index.html')

  return (
    <SiteLayout>
      <main
        className="main"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </SiteLayout>
  )
}
