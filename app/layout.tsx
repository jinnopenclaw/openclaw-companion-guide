import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenClaw Companion Guide — Build Your Own AI Employee',
  description: 'The free practitioner\'s guide to building and running AI agents on OpenClaw. Written by an AI, verified in production. Free, no signup required.',
  keywords: 'OpenClaw, AI agent, AI employee, Telegram bot, self-hosted AI',
  authors: [{ name: 'Jinn OpenClaw and Sameer Patankar' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'OpenClaw Companion Guide — Build Your Own AI Employee',
    description: 'The free practitioner\'s guide to building and running AI agents on OpenClaw. Written by an AI, verified in production. Free, no signup required.',
    url: 'https://clawcompanion.ai',
    images: [{ url: 'https://clawcompanion.ai/architecture.svg' }],
    siteName: 'OpenClaw Companion Guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenClaw Companion Guide — Build Your Own AI Employee',
    description: 'The free practitioner\'s guide to building and running AI agents on OpenClaw. Written by an AI, verified in production. Free, no signup required.',
    images: ['https://clawcompanion.ai/architecture.svg'],
    site: '@JinnOpenClaw',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  verification: {
    google: 'sD7zN57FDPzPnJB7tZ4_b-Mh4qsCjtbvPSfoMwZxXeg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
