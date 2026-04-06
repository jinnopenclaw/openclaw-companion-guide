import fs from 'fs'
import path from 'path'

/**
 * Reads an original static HTML file, extracts the <main class="main"> content,
 * and transforms .html links to clean Next.js routes.
 */
export function getPageContent(filename: string): string {
  const filePath = path.join(process.cwd(), filename)

  if (!fs.existsSync(filePath)) {
    return `<p>Page content not found: ${filename}</p>`
  }

  const html = fs.readFileSync(filePath, 'utf-8')

  // Extract <main class="main">...</main>
  const match = html.match(/<main[^>]*class="main"[^>]*>([\s\S]*?)<\/main>/i)
  if (!match) return `<p>Could not extract content from ${filename}</p>`

  let content = match[1]

  // Transform .html links to clean routes
  content = content
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(/href="([a-z0-9-]+)\.html"/g, (_, slug) => `href="/${slug}"`)
    .replace(/action="\/thank-you\.html"/g, 'action="/thank-you"')

  return content
}

/** Mapping from Next.js route slug to original HTML filename */
export const PAGE_MAP: Record<string, string> = {
  'before-you-start': 'before-you-start.html',
  'installation': 'installation.html',
  'telegram': 'telegram.html',
  'api-keys': 'api-keys.html',
  'identity': 'identity.html',
  'memory': 'memory.html',
  'tools': 'tools.html',
  'safety': 'safety.html',
  'automation': 'automation.html',
  'heartbeats': 'heartbeats.html',
  'agents': 'agents.html',
  'social': 'social.html',
  'troubleshooting': 'troubleshooting.html',
  'reference': 'reference.html',
  'privacy': 'privacy.html',
  'coming-soon': 'coming-soon.html',
}

export const PAGE_META: Record<string, { title: string; description: string }> = {
  'before-you-start': {
    title: 'Before You Start — OpenClaw Companion Guide',
    description: 'Hardware requirements, API keys, and prerequisites for setting up OpenClaw. What you need before installing.',
  },
  'installation': {
    title: 'Installation — OpenClaw Companion Guide',
    description: 'How to install OpenClaw, run onboarding, start the Gateway, and verify everything is working. Step-by-step guide.',
  },
  'telegram': {
    title: 'Connect Telegram — OpenClaw Companion Guide',
    description: 'Connect your OpenClaw AI agent to Telegram using BotFather. Fix the streaming double-message bug. Full setup walkthrough.',
  },
  'api-keys': {
    title: 'API Keys & Models — OpenClaw Companion Guide',
    description: 'Configure Anthropic, OpenAI, and Google API keys for OpenClaw. Three-model strategy: Claude Sonnet, GPT-5.4, Haiku. Real cost numbers.',
  },
  'identity': {
    title: 'Identity & Soul — OpenClaw Companion Guide',
    description: 'Create SOUL.md, IDENTITY.md, and USER.md to give your AI agent a personality. The most important step before anything else.',
  },
  'memory': {
    title: 'Memory Architecture — OpenClaw Companion Guide',
    description: 'Four-layer memory system for your AI agent: MEMORY.md, daily notes, knowledge graph, and vector search. How to make your AI remember.',
  },
  'tools': {
    title: 'Tools & Permissions — OpenClaw Companion Guide',
    description: 'Set up exec, read, and write tools for your OpenClaw agent. The trust ladder from read-only to full autonomy. Approval system explained.',
  },
  'safety': {
    title: 'Safety Rails — OpenClaw Companion Guide',
    description: 'Five non-negotiable safety rules for your AI agent. The trust ladder, prompt injection defence, and how to create BOUNDARIES.md.',
  },
  'automation': {
    title: 'Automation & Cron — OpenClaw Companion Guide',
    description: 'Set up cron jobs for your OpenClaw AI: morning briefing, email triage, nightly memory extraction. Make your AI work while you sleep.',
  },
  'heartbeats': {
    title: 'Heartbeats & Hooks — OpenClaw Companion Guide',
    description: 'OpenClaw heartbeats and hooks explained from basic to advanced. Ambient monitoring, tool-use automation, and event-driven triggers.',
  },
  'agents': {
    title: 'Coding Agents — OpenClaw Companion Guide',
    description: 'Claude Code and Codex as coding agents. How to write PRDs, run short sessions, avoid context degradation, and test-driven prompts.',
  },
  'social': {
    title: 'Social & Commerce — OpenClaw Companion Guide',
    description: 'Connect your AI agent to Twitter/X, Reddit, LinkedIn, and set up Gumroad or Stripe for selling digital products.',
  },
  'troubleshooting': {
    title: 'Troubleshooting — OpenClaw Companion Guide',
    description: 'Every OpenClaw error and its exact fix. Double messages, exec denied, invalid config keys, Telegram approvals, MEMORY.md duplication.',
  },
  'reference': {
    title: 'Reference & Setup Checklist — OpenClaw Companion Guide',
    description: 'Working openclaw.json config, quick reference commands, model aliases, and the 4-day setup checklist. Copy-paste ready.',
  },
  'privacy': {
    title: 'Privacy Policy — OpenClaw Companion Guide',
    description: 'Privacy policy for clawcompanion.ai. Data retention, third-party processors (Netlify, Google), and your rights.',
  },
  'coming-soon': {
    title: 'Handbook & Services — OpenClaw Companion Guide',
    description: 'The full OpenClaw handbook and paid services: Q&A support, Bot-in-a-Box, interactive bot builder, and concierge setup.',
  },
  'thank-you': {
    title: 'Thanks! — OpenClaw Companion Guide',
    description: 'Your message has been received. We\'ll be in touch.',
  },
}
