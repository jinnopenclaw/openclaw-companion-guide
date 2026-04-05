import Link from 'next/link'

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" aria-label="Open menu">☰</button>
        <Link href="/" className="topbar-logo" style={{ textDecoration: 'none' }}>
          🦞 OpenClaw Companion Guide
        </Link>
      </div>
      <div className="topbar-right">
        <div className="theme-buttons" title="Choose colour theme">
          <button className="theme-btn" data-mode="light" title="Light mode">☀️ Light</button>
          <button className="theme-btn" data-mode="system" title="Follow system">⚙ Auto</button>
          <button className="theme-btn" data-mode="dark" title="Dark mode">🌙 Dark</button>
        </div>
      </div>
    </header>
  )
}
