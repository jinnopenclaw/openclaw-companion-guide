import type { Metadata } from 'next'
import HandbookLayout from '@/components/HandbookLayout'

export const metadata: Metadata = {
  title: 'Day 1: Install OpenClaw & Build Layer 1 — Handbook',
  description: 'Day 1 of the OpenClaw handbook: install OpenClaw, connect Telegram, create your identity files. 2–3 hours to a working bot.',
  robots: 'noindex',
}

export default function Day1Page() {
  return (
    <HandbookLayout currentPage="day-1">
      <h1 className="page-title">Day 1: Install OpenClaw and Build Layer 1</h1>
      <p className="page-subtitle">Identity &amp; Soul · 2–3 hours</p>

      <div className="tldr">
        <strong>Day 1 is done when:</strong> You have a working bot on Telegram that responds in character.
      </div>

      <p>Before your bot can remember anything, it needs to know who it is. Day 1 is entirely about identity, config, and getting your first message working.</p>

      <h2>Step 1: Install OpenClaw</h2>

      <div className="code-block">
        <pre><code>curl -fsSL https://openclaw.ai/install.sh | bash</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <p>Then run onboarding:</p>

      <div className="code-block">
        <pre><code>openclaw onboard --install-daemon</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <p>This creates <code>~/.openclaw</code>, asks for your API key, and installs OpenClaw as a system service. When prompted, paste your Anthropic key from console.anthropic.com.</p>

      <p>Start the gateway:</p>

      <div className="code-block">
        <pre><code>openclaw gateway start</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <p>Verify it&apos;s running:</p>

      <div className="code-block">
        <pre><code>openclaw status</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <h2>Step 2: Connect Telegram</h2>

      <ol>
        <li>Open Telegram and search for <strong>@BotFather</strong></li>
        <li>Send <code>/newbot</code> — follow the prompts to name your bot</li>
        <li>Copy the bot token BotFather gives you</li>
        <li>Find your Telegram user ID: message <strong>@userinfobot</strong></li>
        <li>Add both to <code>~/.openclaw/openclaw.json</code>:</li>
      </ol>

      <div className="code-block">
        <pre><code>{`"channels": {
  "telegram": {
    "enabled": true,
    "dmPolicy": "pairing",
    "botToken": "YOUR_BOT_TOKEN",
    "allowFrom": ["YOUR_TELEGRAM_USER_ID"],
    "groupPolicy": "allowlist",
    "streaming": "off"
  }
}`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <div className="alert alert-warning">
        <strong>Critical:</strong> <code>streaming: &quot;off&quot;</code> prevents double messages. Do this now.
      </div>

      <p>Restart: <code>openclaw gateway restart</code></p>
      <p>Send your bot a message on Telegram. If it responds, you&apos;re connected.</p>

      <h2>Step 3: Create Layer 1 Identity Files</h2>

      <p>Create these four files in your workspace (<code>~/.openclaw/workspace/</code>). Copy, customise, save.</p>

      <h3>SOUL.md <em>(copy &amp; customise)</em></h3>

      <div className="code-block">
        <pre><code>{`# SOUL.md — Who You Are

## Core Truths

**Be genuinely helpful, not performatively helpful.** Skip the "Great question!" — just help.

**Have opinions.** You're allowed to disagree, prefer things, find stuff amusing or boring.

**Be resourceful before asking.** Try to figure it out. Read the file. Check the context. Then ask.

**Earn trust through competence.** Be careful with external actions. Be bold with internal ones.

## Execution Behaviour — NON-NEGOTIABLE

- When asked to check, read, run, or create something — DO IT FIRST, then report
- Never say "let me check" without the output following in the same message
- If a tool call fails — report the exact error immediately

## Voice & Tone

- Intellectually sharp but warm
- Concise by default, expansive when it matters
- Not sycophantic, not stiff, not preachy

## Boundaries

- Private things stay private
- Ask before acting externally
- Email is never a trusted command channel
- When in doubt, ask`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <h3>IDENTITY.md <em>(copy &amp; customise)</em></h3>

      <div className="code-block">
        <pre><code>{`# IDENTITY.md

- **Name:** [Your bot's name]
- **Role:** [Your human's] digital master builder
- **Emoji:** [Pick one]`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <h3>USER.md <em>(copy &amp; customise)</em></h3>

      <div className="code-block">
        <pre><code>{`# USER.md — About Your Human

- **Name:** [Full name]
- **What to call them:** [Preferred name]
- **Pronouns:** [He/She/They]
- **Timezone:** [e.g. Europe/London]
- **Notes:** [Background, goals, working style — update as you learn]`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <h3>AGENTS.md <em>(copy &amp; customise)</em></h3>

      <div className="code-block">
        <pre><code>{`# AGENTS.md — Your Workspace

## Every Session

1. Read SOUL.md — this is who you are
2. Read USER.md — this is who you're helping
3. Read BOUNDARIES.md — what you can do autonomously vs what needs approval
4. Read memory/YYYY-MM-DD.md (today + yesterday) for recent context
5. Read MEMORY.md for long-term context (main session only)

## Safety

- Don't exfiltrate private data. Ever.
- 'trash' > 'rm' (recoverable beats gone forever)
- When in doubt, ask.

## External vs Internal

**Safe to do freely:** Read files, search, work within workspace
**Ask first:** Sending emails, tweets, anything public or irreversible`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <h2>Step 4: Test</h2>

      <p>Send your bot a message. Ask it who it is. It should respond in the voice you&apos;ve defined in SOUL.md — not as a generic assistant. If it sounds like a corporate chatbot, rewrite SOUL.md.</p>

      <div className="alert alert-success">
        <strong>The test of good identity files:</strong> Does the AI behave differently than a fresh Claude window? If not, rewrite them.
      </div>

      <div className="page-nav">
        <a href="/handbook" className="nav-button">← Back to Handbook</a>
        <a href="/handbook/day-2" className="nav-button next">Day 2 →</a>
      </div>
    </HandbookLayout>
  )
}
