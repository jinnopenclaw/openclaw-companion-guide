/* OpenClaw Companion Guide — App JS
   Handles: theme, navigation, copy buttons, feedback form
*/

// ════════════════════════════════════
// THEME
// ════════════════════════════════════

const THEME_KEY = 'oc-guide-theme';

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }

  // Update active button state
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === theme);
  });

  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'system';
  applyTheme(saved);

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.mode));
  });

  // Watch system preference changes
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    if (localStorage.getItem(THEME_KEY) === 'system' || !localStorage.getItem(THEME_KEY)) {
      applyTheme('system');
    }
  });
}

// ════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════

const PAGES = [
  { id: 'home',             title: 'Home',                   filename: 'index.html' },
  { id: 'before-you-start', title: 'Before You Start',       filename: 'before-you-start.html' },
  { id: 'installation',     title: 'Installation',           filename: 'installation.html' },
  { id: 'telegram',         title: 'Connect Telegram',       filename: 'telegram.html' },
  { id: 'api-keys',         title: 'API Keys & Models',      filename: 'api-keys.html' },
  { id: 'identity',         title: 'Identity & Soul',        filename: 'identity.html' },
  { id: 'memory',           title: 'Memory Architecture',    filename: 'memory.html' },
  { id: 'tools',            title: 'Tools & Permissions',    filename: 'tools.html' },
  { id: 'safety',           title: 'Safety Rails',           filename: 'safety.html' },
  { id: 'automation',       title: 'Automation & Cron',      filename: 'automation.html' },
  { id: 'heartbeats',       title: 'Heartbeats & Hooks',     filename: 'heartbeats.html' },
  { id: 'agents',           title: 'Coding Agents',          filename: 'agents.html' },
  { id: 'social',           title: 'Social & Commerce',      filename: 'social.html' },
  { id: 'troubleshooting',  title: 'Troubleshooting',        filename: 'troubleshooting.html' },
  { id: 'reference',        title: 'Reference & Setup Checklist', filename: 'reference.html' },
];

function getCurrentPageId() {
  const filename = window.location.pathname.split('/').pop() || 'index.html';
  const page = PAGES.find(p => p.filename === filename);
  return page ? page.id : 'home';
}

function initNav() {
  const currentId = getCurrentPageId();
  const currentIndex = PAGES.findIndex(p => p.id === currentId);

  // Mark active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.pageId === currentId);
  });

  // Wire prev/next buttons if they exist
  // Nav buttons: hrefs are set correctly in HTML by build.py.
  // JS only removes the 'disabled' class — never rewrites hrefs or text,
  // which would override the correct values baked in at build time.
  const prevBtn = document.querySelector('.nav-button.prev');
  const nextBtn = document.querySelector('.nav-button.next');
  if (prevBtn && currentIndex > 0) prevBtn.classList.remove('disabled');
  if (nextBtn && currentIndex < PAGES.length - 1) nextBtn.classList.remove('disabled');
}

function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!toggle || !sidebar) return;

  const open = () => { sidebar.classList.add('active'); overlay && overlay.classList.add('active'); };
  const close = () => { sidebar.classList.remove('active'); overlay && overlay.classList.remove('active'); };

  toggle.addEventListener('click', () => sidebar.classList.contains('active') ? close() : open());
  overlay && overlay.addEventListener('click', close);

  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', close));
}

// ════════════════════════════════════
// SIDEBAR SCROLL MEMORY
// ════════════════════════════════════

const SCROLL_KEY = 'oc-sidebar-scroll';

function initSidebarScrollMemory() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  // Restore previous scroll position
  const saved = sessionStorage.getItem(SCROLL_KEY);
  if (saved !== null) {
    // Use requestAnimationFrame to ensure layout is complete before scrolling
    requestAnimationFrame(() => { sidebar.scrollTop = parseInt(saved, 10); });
  }

  // Save scroll position before navigating away
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      sessionStorage.setItem(SCROLL_KEY, sidebar.scrollTop);
    });
  });

  // Also save on scroll (debounced) in case user scrolls then uses prev/next
  let scrollTimer;
  sidebar.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      sessionStorage.setItem(SCROLL_KEY, sidebar.scrollTop);
    }, 100);
  });
}

// ════════════════════════════════════
// COPY BUTTONS
// ════════════════════════════════════

function initCopyButtons() {
  document.querySelectorAll('.code-block').forEach(block => {
    const btn = block.querySelector('.code-copy-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const code = block.querySelector('code')?.textContent || '';
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        btn.textContent = 'Failed';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      }
    });
  });
}

// ════════════════════════════════════
// FEEDBACK FORM
// ════════════════════════════════════

function initFeedback() {
  // Tab switching
  document.querySelectorAll('.feedback-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.tab;
      document.querySelectorAll('.feedback-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide paid field
      const paidNote = document.querySelector('.paid-note');
      if (paidNote) paidNote.style.display = mode === 'question' ? 'block' : 'none';

      const typeField = document.querySelector('.form-group.type-field');
      if (typeField) typeField.style.display = mode === 'suggestion' ? 'flex' : 'none';

      // Update submit label
      const submit = document.querySelector('.feedback-submit');
      if (submit) {
        submit.textContent = mode === 'question' ? '→ Send Question' : '→ Send Suggestion';
      }
    });
  });

  // Form submission
  const form = document.querySelector('.feedback-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.feedback-submit');
    const success = document.querySelector('.feedback-success');
    const name = form.querySelector('[name="name"]')?.value.trim() || 'Anonymous';
    const email = form.querySelector('[name="email"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();
    const tab = document.querySelector('.feedback-tab.active')?.dataset.tab || 'question';
    const page = window.location.pathname.split('/').pop() || 'index.html';

    if (!email || !message) {
      alert('Please enter your email and message.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';

    // Netlify Forms — works automatically when deployed on Netlify.
    // Falls back to mailto if not on Netlify (e.g. local file testing).
    const isNetlify = window.location.hostname.includes('netlify') ||
                      window.location.hostname.includes('openclaw') ||
                      (window.location.protocol === 'https:');

    try {
      if (isNetlify) {
        // Netlify Forms submission
        const formData = new URLSearchParams();
        formData.append('form-name', 'companion-feedback');
        formData.append('name', name);
        formData.append('email', email);
        formData.append('message', message);
        formData.append('type', tab);
        formData.append('page', page);

        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
        if (!res.ok) throw new Error('Submit failed');
      } else {
        throw new Error('Not on Netlify — using mailto fallback');
      }

      form.style.display = 'none';
      if (success) success.style.display = 'block';
    } catch {
      // Fallback: open mailto
      const subject = encodeURIComponent(`[Companion Guide] ${tab === 'question' ? 'Question' : 'Suggestion'} — ${page}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:jinnopenclaw@gmail.com?subject=${subject}&body=${body}`;
    } finally {
      btn.disabled = false;
      btn.textContent = tab === 'question' ? '→ Send Question' : '→ Send Suggestion';
    }
  });
}

// ════════════════════════════════════
// INIT
// ════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initMobileNav();
  initSidebarScrollMemory();
  initCopyButtons();
  initFeedback();
});
