import type { Metadata } from 'next'
import HandbookLayout from '@/components/HandbookLayout'

export const metadata: Metadata = {
  title: 'Appendix: The Working openclaw.json — Handbook',
  description: 'The complete openclaw.json configuration that actually works. Validated over three weeks of debugging. Copy, replace the tokens, and you\'re done.',
  robots: 'noindex',
}

export default function AppendixPage() {
  return (
    <HandbookLayout currentPage="appendix">
      <h1 className="page-title">Appendix: The Working openclaw.json</h1>
      <p className="page-subtitle">Validated configuration · Copy and replace the tokens</p>

      <div className="tldr">
        This is the config that actually works. Validated across three weeks of debugging. Copy it, replace the tokens, and you&apos;re done.
      </div>

      <div className="code-block">
        <pre><code>{`{
  "meta": { "lastTouchedVersion": "2026.4.x" },
  "env": {
    "ANTHROPIC_API_KEY": "\${ANTHROPIC_API_KEY}",
    "OPENAI_API_KEY": "\${OPENAI_API_KEY}",
    "GOOGLE_API_KEY": "\${GOOGLE_API_KEY}"
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-6",
        "fallbacks": ["anthropic/claude-haiku-4-5-20251001", "openai/gpt-5.4"]
      },
      "workspace": "/Users/YOU/.openclaw/workspace",
      "compaction": { "mode": "safeguard" },
      "maxConcurrent": 4,
      "subagents": { "maxConcurrent": 8 }
    }
  },
  "tools": {
    "profile": "coding",
    "allow": ["group:fs", "group:runtime", "read", "write", "exec"],
    "exec": {
      "host": "gateway",
      "security": "full",
      "ask": "off",
      "pathPrepend": ["/opt/homebrew/bin", "/usr/local/bin"]
    },
    "elevated": {
      "enabled": true,
      "allowFrom": { "telegram": ["YOUR_TELEGRAM_ID"] }
    }
  },
  "commands": { "native": "auto", "nativeSkills": "auto", "bash": true },
  "hooks": {
    "internal": {
      "enabled": true,
      "entries": {
        "boot-md": { "enabled": true },
        "bootstrap-extra-files": { "enabled": true },
        "command-logger": { "enabled": true },
        "session-memory": { "enabled": true }
      }
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "dmPolicy": "pairing",
      "botToken": "YOUR_BOT_TOKEN",
      "allowFrom": ["YOUR_TELEGRAM_ID"],
      "groupPolicy": "allowlist",
      "streaming": "off"
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": { "mode": "token", "token": "YOUR_GATEWAY_TOKEN" }
  }
}`}</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <h2>Critical Notes</h2>

      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>streaming</code></td>
            <td><code>&quot;off&quot;</code></td>
            <td>Prevents double messages in Telegram</td>
          </tr>
          <tr>
            <td><code>tools.profile</code></td>
            <td><code>&quot;coding&quot;</code></td>
            <td>Unlocks group:fs and group:runtime natively</td>
          </tr>
          <tr>
            <td><code>tools.exec.security</code></td>
            <td><code>&quot;full&quot;</code></td>
            <td>No per-command approval prompts</td>
          </tr>
          <tr>
            <td><code>tools.exec.ask</code></td>
            <td><code>&quot;off&quot;</code></td>
            <td>Combined with security:full for full autonomy</td>
          </tr>
        </tbody>
      </table>

      <div className="alert alert-warning">
        <strong>What NOT to add:</strong>
        <ul style={{ marginTop: '0.5rem', marginLeft: '1.25rem' }}>
          <li>No <code>execApprovals</code> inside the telegram block — that key is invalid there</li>
          <li>No <code>allowOperators</code>, <code>shell</code>, or <code>cwd</code> in exec — all rejected as unrecognised</li>
          <li>Redirections (<code>&gt;</code>, <code>&gt;&gt;</code>) never work in allowlist mode — use <code>tee</code> instead</li>
        </ul>
      </div>

      <h2>Validate your config</h2>

      <p>Before restarting the gateway, always validate your JSON:</p>

      <div className="code-block">
        <pre><code>cat ~/.openclaw/openclaw.json | python3 -m json.tool && openclaw gateway restart</code></pre>
        <button className="code-copy-btn">Copy</button>
      </div>

      <p>If the gateway rejects it, run <code>openclaw doctor --fix</code> and find the actual valid key in the error output.</p>

      <div className="page-nav">
        <a href="/handbook/day-10" className="nav-button">← Day 10</a>
        <a href="/" className="nav-button">Back to Guide →</a>
      </div>
    </HandbookLayout>
  )
}
