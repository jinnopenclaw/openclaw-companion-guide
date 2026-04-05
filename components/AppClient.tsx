'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const THEME_KEY = 'oc-guide-theme'
const SCROLL_KEY = 'oc-sidebar-scroll'

export default function AppClient() {
  const pathname = usePathname()

  // Theme init — runs on mount and whenever pathname changes (new page load)
  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) || 'system'
    applyTheme(saved)

    document.querySelectorAll<HTMLButtonElement>('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.mode || 'system'))
    })

    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => {
      if ((localStorage.getItem(THEME_KEY) || 'system') === 'system') {
        applyTheme('system')
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Active nav link — runs whenever pathname changes
  useEffect(() => {
    document.querySelectorAll<HTMLAnchorElement>('.nav-link, .nav-link-unlocked').forEach(link => {
      const href = link.getAttribute('href') || ''
      const isActive = href === pathname || (href !== '/' && pathname.startsWith(href))
      link.classList.toggle('active', isActive)
    })
  }, [pathname])

  // Mobile nav
  useEffect(() => {
    const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle')
    const sidebar = document.querySelector<HTMLElement>('.sidebar')
    const overlay = document.querySelector<HTMLElement>('.sidebar-overlay')
    if (!toggle || !sidebar) return

    const open = () => {
      sidebar.classList.add('active')
      overlay?.classList.add('active')
    }
    const close = () => {
      sidebar.classList.remove('active')
      overlay?.classList.remove('active')
    }

    const onToggle = () => sidebar.classList.contains('active') ? close() : open()
    toggle.addEventListener('click', onToggle)
    overlay?.addEventListener('click', close)
    document.querySelectorAll<HTMLAnchorElement>('.nav-link, .nav-link-unlocked').forEach(l =>
      l.addEventListener('click', close)
    )

    return () => {
      toggle.removeEventListener('click', onToggle)
    }
  }, [])

  // Sidebar scroll memory
  useEffect(() => {
    const sidebar = document.querySelector<HTMLElement>('.sidebar')
    if (!sidebar) return

    const saved = sessionStorage.getItem(SCROLL_KEY)
    if (saved !== null) {
      requestAnimationFrame(() => { sidebar.scrollTop = parseInt(saved, 10) })
    }

    document.querySelectorAll<HTMLAnchorElement>('.nav-link, .nav-link-unlocked').forEach(link => {
      link.addEventListener('click', () => {
        sessionStorage.setItem(SCROLL_KEY, String(sidebar.scrollTop))
      })
    })

    let scrollTimer: ReturnType<typeof setTimeout>
    const onScroll = () => {
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        sessionStorage.setItem(SCROLL_KEY, String(sidebar.scrollTop))
      }, 100)
    }
    sidebar.addEventListener('scroll', onScroll)
    return () => sidebar.removeEventListener('scroll', onScroll)
  }, [])

  // Copy buttons — re-runs when pathname changes (new page content)
  useEffect(() => {
    document.querySelectorAll<HTMLElement>('.code-block').forEach(block => {
      const btn = block.querySelector<HTMLButtonElement>('.code-copy-btn')
      if (!btn) return
      // Remove old listeners by cloning
      const newBtn = btn.cloneNode(true) as HTMLButtonElement
      btn.parentNode?.replaceChild(newBtn, btn)

      newBtn.addEventListener('click', async () => {
        const code = block.querySelector('code')?.textContent || ''
        try {
          await navigator.clipboard.writeText(code)
          newBtn.textContent = '✓ Copied!'
          newBtn.classList.add('copied')
          setTimeout(() => {
            newBtn.textContent = 'Copy'
            newBtn.classList.remove('copied')
          }, 2000)
        } catch {
          newBtn.textContent = 'Failed'
          setTimeout(() => { newBtn.textContent = 'Copy' }, 2000)
        }
      })
    })
  }, [pathname])

  // Feedback form tab switching
  useEffect(() => {
    document.querySelectorAll<HTMLButtonElement>('.feedback-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.tab
        document.querySelectorAll<HTMLButtonElement>('.feedback-tab').forEach(t =>
          t.classList.remove('active')
        )
        tab.classList.add('active')

        const typeField = document.querySelector<HTMLElement>('.form-group.type-field')
        if (typeField) typeField.style.display = mode === 'suggestion' ? 'flex' : 'none'

        const submit = document.querySelector<HTMLButtonElement>('.feedback-submit')
        if (submit) submit.textContent = mode === 'question' ? '→ Send Question' : '→ Send Suggestion'
      })
    })
  }, [pathname])

  return null
}

function applyTheme(theme: string) {
  const root = document.documentElement
  if (theme === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', theme)
  }
  document.querySelectorAll<HTMLButtonElement>('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === theme)
  })
  localStorage.setItem(THEME_KEY, theme)
}
