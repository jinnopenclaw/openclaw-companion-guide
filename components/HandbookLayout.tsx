import Link from 'next/link'
import SiteLayout from './SiteLayout'

interface HandbookLayoutProps {
  children: React.ReactNode
  currentPage: 'day-1' | 'day-2' | 'day-3' | 'day-10' | 'appendix'
}

const HANDBOOK_PAGES = [
  { id: 'day-1', label: 'Day 1', href: '/handbook/day-1' },
  { id: 'day-2', label: 'Day 2', href: '/handbook/day-2' },
  { id: 'day-3', label: 'Day 3', href: '/handbook/day-3' },
  { id: 'day-10', label: 'Day 10', href: '/handbook/day-10' },
  { id: 'appendix', label: 'Appendix', href: '/handbook/appendix' },
]

export default function HandbookLayout({ children, currentPage }: HandbookLayoutProps) {
  return (
    <SiteLayout hasPaid={true}>
      <main className="main">
        <div className="handbook-nav">
          {HANDBOOK_PAGES.map(page => (
            <Link
              key={page.id}
              href={page.href}
              className={`handbook-nav-link${currentPage === page.id ? ' active' : ''}`}
            >
              {page.label}
            </Link>
          ))}
          <span className="handbook-unlock-badge">✅ Handbook unlocked</span>
        </div>
        {children}
      </main>
    </SiteLayout>
  )
}
