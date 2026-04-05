import type { Metadata } from 'next'
import HandbookLayout from '@/components/HandbookLayout'

export const metadata: Metadata = {
  title: 'Day 3: Knowledge Graph & Trust Infrastructure — Handbook',
  description: 'Day 3 of the OpenClaw handbook: build Layer 3 knowledge graph, BOUNDARIES.md, email triage crons, and spawn your first coding agent.',
  robots: 'noindex',
}

export default function Day3Page() {
  return (
    <HandbookLayout currentPage="day-3">
      <h1 className="page-title">Day 3: Build Layer 3 + Trust Infrastructure</h1>
      <p className="page-subtitle">Knowledge Graph &amp; Autonomy · 3–4 hours</p>

      <div className="tldr">
        <strong>Day 3 is done when:</strong> Your bot has a knowledge graph, defined boundaries, an approval format, email triage running three times a day, and can spawn a coding agent.
      </div>

      <p>Layer 3 is the knowledge graph — deep, structured storage organised by entity. Combined with the trust and boundary files, this is the day your bot becomes genuinely autonomous.</p>

      <h2>Step 1: Create the knowledge graph structure</h2>

      <div className="code-block">
        <pre><code>{`mkdir -p ~/.openclaw/workspace/life/projects
mkdir -p ~/.openclaw/workspace/life/areas/people
mkdir -p ~/.openclaw/workspace/life/areas/companies
mkdir -p ~/.openclaw/workspace/life/resources
mkdir -p ~/.openclaw/workspace/life/archives`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <p>For each entity you want to track, create a folder with two files:</p>

      <div className="code-block">
        <pre><code>mkdir -p ~/.openclaw/workspace/life/areas/people/YOU</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <p><strong>summary.md</strong> — 3–5 lines, loaded fast:</p>

      <div className="code-block">
        <pre><code>{`# [Name]
- Role: [relationship to you]
- Key facts: [2–3 bullet points]
- Last updated: YYYY-MM-DD`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <p><strong>items.json</strong> — atomic facts with decay tracking:</p>

      <div className="code-block">
        <pre><code>{`[
  {
    "id": "person-001",
    "fact": "Prefers fast iteration",
    "category": "working-style",
    "timestamp": "YYYY-MM-DD",
    "source": "YYYY-MM-DD",
    "status": "active",
    "relatedEntities": [],
    "lastAccessed": "YYYY-MM-DD",
    "accessCount": 1,
    "temperature": "hot"
  }
]`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <div className="alert alert-info">
        <strong>Temperature decay:</strong> hot (≤7 days) → warm (8–30 days) → cold (30+ days). Never delete — set <code>&quot;status&quot;: &quot;superseded&quot;</code> instead.
      </div>

      <h2>Step 2: Create BOUNDARIES.md <em>(copy &amp; customise)</em></h2>

      <div className="code-block">
        <pre><code>{`# BOUNDARIES.md — What I Can Do Autonomously

## Always autonomous (no approval needed)
- Read any file in the workspace
- Update workspace files (MEMORY.md, daily notes, knowledge graph)
- Run read-only shell commands
- Search the web
- Triage and summarise inbound email
- Create draft content (not send)

## Always ask first
- Send any email, tweet, or public post
- Transfer money or sign anything
- Delete files outside the workspace
- Share private information with anyone
- Run commands that modify system config

## Approval queue format
See APPROVAL_QUEUE.md`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <h2>Step 3: Create APPROVAL_QUEUE.md <em>(copy &amp; customise)</em></h2>

      <div className="code-block">
        <pre><code>{`# APPROVAL_QUEUE.md

When I need approval, I use this format:

🔔 APPROVAL NEEDED

Action: [what I want to do]
Target: [who/what it affects]
Why: [brief reason]
Risk: [low/medium/high + why]
Reversible: [yes/no]

Draft:
[the actual content]

Reply APPROVE or REJECT (with reason if rejecting)`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <h2>Step 4: Set up email triage crons</h2>

      <div className="code-block">
        <pre><code>{`openclaw cron add \\
  --name "email-triage-morning" \\
  --schedule "0 9 * * *" \\
  --model anthropic/claude-haiku-4-5-20251001 \\
  --channel telegram \\
  --to YOUR_TELEGRAM_ID \\
  --prompt "Check email. For each unread: sender, subject, 1-sentence summary, urgency (high/med/low). Flag anything needing response today. No action — triage only."

openclaw cron add \\
  --name "email-triage-afternoon" \\
  --schedule "0 13 * * *" \\
  --model anthropic/claude-haiku-4-5-20251001 \\
  --channel telegram \\
  --to YOUR_TELEGRAM_ID \\
  --prompt "Check email since 9am. Same format as morning triage. Flag anything urgent."

openclaw cron add \\
  --name "email-triage-evening" \\
  --schedule "0 18 * * *" \\
  --model anthropic/claude-haiku-4-5-20251001 \\
  --channel telegram \\
  --to YOUR_TELEGRAM_ID \\
  --prompt "End-of-day email check. Flag anything that needs response before tomorrow."`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <h2>Step 5: Install coding agents</h2>

      <div className="code-block">
        <pre><code>{`npm install -g @anthropic-ai/claude-code
npm install -g @openai/codex`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <p>Write your first PRD for a real task and run it:</p>

      <div className="code-block">
        <pre><code>{`claude --permission-mode bypassPermissions --print "implement the feature described in PRD.md"`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <div className="page-nav">
        <a href="/handbook/day-2" className="nav-button">← Day 2</a>
        <a href="/handbook/day-10" className="nav-button next">Day 10 →</a>
      </div>
    </HandbookLayout>
  )
}
