import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SiteLayout from '@/components/SiteLayout'
import { getPageContent, PAGE_MAP, PAGE_META } from '@/lib/page-content'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return Object.keys(PAGE_MAP).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = PAGE_META[params.slug]
  if (!meta) return {}
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://clawcompanion.ai/${params.slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://clawcompanion.ai/${params.slug}`,
      images: [{ url: 'https://clawcompanion.ai/architecture.svg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['https://clawcompanion.ai/architecture.svg'],
    },
  }
}

export default function SlugPage({ params }: Props) {
  const filename = PAGE_MAP[params.slug]
  if (!filename) notFound()

  const content = getPageContent(filename)

  return (
    <SiteLayout>
      <main
        className="main"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </SiteLayout>
  )
}
