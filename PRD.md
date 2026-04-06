# PRD: clawcompanion.ai Paywall — Clerk Auth + Stripe Payment

## Overview
Convert the current static HTML site (jinnopenclaw/openclaw-companion-guide) to a Next.js app that preserves all existing free pages and adds a gated paid handbook section behind Clerk auth + Stripe payment.

## Goals
- All existing free pages remain publicly accessible, same design
- Handbook pages (Day 1–4 + Appendix content from HANDBOOK.md) require login + payment
- One-time purchase: £19 / €19 / $19 (currency detection by locale)
- OAuth login via Google (Clerk)
- Netlify deployment via existing GitHub repo pipeline

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Auth:** Clerk (`@clerk/nextjs`) — already has keys
- **Payments:** Stripe Checkout (hosted page, one-time payment)
- **Deployment:** Netlify (add `@netlify/plugin-nextjs`)
- **Styling:** Preserve existing style.css — port to globals.css, keep all CSS variables and classes identical

## Environment Variables (already provided)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_REDACTED
CLERK_SECRET_KEY=sk_test_REDACTED
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_REDACTED
STRIPE_SECRET_KEY=sk_test_REDACTED
STRIPE_WEBHOOK_SECRET= (set after Stripe webhook is configured)
NEXT_PUBLIC_URL=https://clawcompanion.ai
```

## Site Structure

### Free pages (no auth required) — preserve existing content exactly
- `/` → index.html content
- `/before-you-start` → before-you-start.html
- `/installation` → installation.html
- `/telegram` → telegram.html
- `/api-keys` → api-keys.html
- `/identity` → identity.html
- `/memory` → memory.html
- `/tools` → tools.html
- `/safety` → safety.html
- `/automation` → automation.html
- `/heartbeats` → heartbeats.html
- `/agents` → agents.html
- `/social` → social.html
- `/troubleshooting` → troubleshooting.html
- `/reference` → reference.html
- `/privacy` → privacy.html
- `/coming-soon` → coming-soon.html (update to show handbook is available)

### Paid pages (require Clerk login + Stripe payment)
- `/handbook` → Handbook landing/purchase page (shows preview, buy button)
- `/handbook/day-1` → Day 1 content
- `/handbook/day-2` → Day 2 content
- `/handbook/day-3` → Day 3 content
- `/handbook/day-10` → Day 10 content
- `/handbook/appendix` → Working openclaw.json appendix

## Handbook Content Source
Content is in: `/Users/sameer/.openclaw/workspace/projects/jinn-handbook/HANDBOOK.md`
Parse and render the Day 1/2/3/10 and Appendix sections as individual pages.

## Payment Flow
1. User visits `/handbook` — sees preview + "Buy for £19" button
2. If not logged in → Clerk sign-in (Google OAuth)
3. After login → Stripe Checkout (one-time payment, price set in Stripe dashboard OR use price_data inline)
4. On success → Stripe redirects to `/handbook/success?session_id=xxx`
5. Success page calls API route to verify payment + store `hasPaid: true` in Clerk user metadata
6. User redirected to `/handbook/day-1`
7. All future visits: middleware checks Clerk session + hasPaid metadata → grants access

## Key API Routes
- `POST /api/create-checkout-session` — creates Stripe Checkout session with correct currency
- `POST /api/stripe-webhook` — receives Stripe `checkout.session.completed`, sets Clerk user metadata `hasPaid: true`
- `GET /api/verify-purchase` — checks Clerk user metadata for hasPaid flag

## Currency Detection
```js
// In create-checkout-session
const currency = req.headers['accept-language']?.includes('en-GB') ? 'gbp' 
  : req.headers['cf-ipcountry'] in EU_COUNTRIES ? 'eur' 
  : 'usd';
const amount = 1900; // £19 / €19 / $19 in pence/cents
```

## Middleware (middleware.ts)
- Public routes: all free pages + `/`, `/api/create-checkout-session`, `/api/stripe-webhook`
- Protected routes: `/handbook/day-1`, `/handbook/day-2`, `/handbook/day-3`, `/handbook/day-10`, `/handbook/appendix`
- Middleware checks: Clerk session exists AND user metadata `hasPaid === true`
- If no session → redirect to `/handbook` with `?signin=true`
- If session but not paid → redirect to `/handbook` with `?purchase=true`

## Netlify Config
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Sidebar Navigation Update
Add "📖 Handbook" section to sidebar on all pages:
- If not purchased: shows lock icon + "Get the Handbook →" linking to `/handbook`
- If purchased: shows Day 1, Day 2, Day 3, Day 10, Appendix links

## Design Requirements
- Match existing style.css exactly — same fonts, colors, CSS variables, sidebar, topbar
- Handbook pages use same `.main` layout, `.page-title`, `.code-block` etc.
- Purchase page is clean and simple: title, 3-bullet value prop, price, buy button
- After purchase: subtle green "✅ Handbook unlocked" badge in sidebar

## Acceptance Criteria
- [ ] All 17 free pages load correctly at their routes
- [ ] `/handbook` shows purchase page with correct currency
- [ ] Clicking buy → Clerk sign-in → Stripe Checkout → success → handbook unlocked
- [ ] Handbook pages show 401/redirect if accessed without purchase
- [ ] Stripe webhook correctly sets Clerk metadata on payment
- [ ] Netlify build succeeds and deploys
- [ ] `netlify.toml` updated with Next.js plugin
- [ ] All code-copy buttons still work
- [ ] Sidebar highlights active page correctly
- [ ] Mobile responsive (same breakpoints as existing CSS)
- [ ] Favicon, meta tags, Open Graph preserved on all pages
