import Link from 'next/link'

interface SidebarProps {
  hasPaid?: boolean
}

export default function Sidebar({ hasPaid = false }: SidebarProps) {
  return (
    <>
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">🦞 Companion</Link>
        <nav>
          <div className="nav-section">
            <div className="nav-section-title">Getting Started</div>
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Setup</div>
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/before-you-start" className="nav-link">Before You Start</Link>
              </li>
              <li className="nav-item">
                <Link href="/installation" className="nav-link">Installation</Link>
              </li>
              <li className="nav-item">
                <Link href="/telegram" className="nav-link">Connect Telegram</Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Configuration</div>
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/api-keys" className="nav-link">API Keys &amp; Models</Link>
              </li>
              <li className="nav-item">
                <Link href="/identity" className="nav-link">Identity &amp; Soul</Link>
              </li>
              <li className="nav-item">
                <Link href="/memory" className="nav-link">Memory Architecture</Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Core Concepts</div>
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/tools" className="nav-link">Tools &amp; Permissions</Link>
              </li>
              <li className="nav-item">
                <Link href="/safety" className="nav-link">Safety Rails</Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Advanced</div>
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/automation" className="nav-link">Automation &amp; Cron</Link>
              </li>
              <li className="nav-item">
                <Link href="/heartbeats" className="nav-link">Heartbeats &amp; Hooks</Link>
              </li>
              <li className="nav-item">
                <Link href="/agents" className="nav-link">Coding Agents</Link>
              </li>
              <li className="nav-item">
                <Link href="/social" className="nav-link">Social &amp; Commerce</Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Reference</div>
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="/troubleshooting" className="nav-link">Troubleshooting</Link>
              </li>
              <li className="nav-item">
                <Link href="/reference" className="nav-link">Reference &amp; Setup Checklist</Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">
              📖 Handbook
              {hasPaid && <span className="handbook-badge">✅ Unlocked</span>}
            </div>
            {hasPaid ? (
              <ul className="nav-list">
                <li className="nav-item">
                  <Link href="/handbook/day-1" className="nav-link-unlocked">Day 1 — Identity &amp; Soul</Link>
                </li>
                <li className="nav-item">
                  <Link href="/handbook/day-2" className="nav-link-unlocked">Day 2 — Memory &amp; Cron</Link>
                </li>
                <li className="nav-item">
                  <Link href="/handbook/day-3" className="nav-link-unlocked">Day 3 — Trust &amp; Autonomy</Link>
                </li>
                <li className="nav-item">
                  <Link href="/handbook/day-10" className="nav-link-unlocked">Day 10 — Semantic Search</Link>
                </li>
                <li className="nav-item">
                  <Link href="/handbook/appendix" className="nav-link-unlocked">Appendix — openclaw.json</Link>
                </li>
              </ul>
            ) : (
              <ul className="nav-list">
                <li className="nav-item">
                  <Link href="/handbook" className="nav-link-locked">
                    🔒 Get the Handbook →
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </nav>
      </aside>
      <div className="sidebar-overlay"></div>
    </>
  )
}
