# mn4x4.org — Roadmap & Feature Backlog

> Last updated: 2026-05-17
> Current state: 5-page React/TS/Vite site — built, **not yet deployed**.
> Caddy is still serving the old static file. See **Deployment** below.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🔴 | Blocking / must-do before launch |
| 🟡 | High priority — near-term |
| 🟢 | Nice-to-have / phase 2+ |
| ⬜ | Needs research / decision required |

---

## 🔴 Deployment (Pre-launch blocker)

- [ ] Point Caddy at the new `dist/` output instead of the old static file
- [ ] Verify all routes work (React Router needs catch-all rewrite rule in Caddy)
- [ ] Confirm HTTPS cert renews cleanly after cutover
- [ ] Smoke-test all 5 pages in production

**Caddy rewrite needed** — React Router is client-side, so Caddy must fall back to
`index.html` for any path that isn't a real file:

```caddy
mn4x4.org {
    root * /path/to/dist
    try_files {path} /index.html
    file_server
}
```

---

## 🟡 Events — Robust Overhaul

This is the biggest near-term feature. See detailed breakdown below.

### Current state
Static TypeScript data file (`src/data/events.ts`) with 6 hand-written annual runs.
No real dates, no external sources, no way for the public to add events.

---

### Phase 1 — MN4WD Association Calendar Import

**Goal:** Pull events from the [MN4WD Association calendar](https://mn4wd.org) automatically
so club members see regional events alongside club-specific runs.

#### Research needed ⬜
- [ ] Determine what the MN4WD site exposes:
  - Do they publish an **iCal / `.ics` feed**? (most common for club sites — check for a
    "Subscribe" or "Export" button on their events page)
  - Do they run WordPress with a calendar plugin (The Events Calendar, etc.)? If so,
    a `/wp-json/tribe/events/v1/events` REST endpoint may be available.
  - Fallback: periodic HTML scrape (fragile — last resort)
- [ ] Confirm licensing/ToS — is automated consumption of their calendar acceptable?
  Consider reaching out to MN4WD directly.

#### Implementation options (choose after research)

| Option | Pros | Cons |
|--------|------|------|
| **A — Build-time fetch** (iCal/API → baked into static JS) | Zero runtime cost, no backend | Stale between deploys; needs scheduled rebuild (cron → `npm run build`) |
| **B — Runtime fetch in browser** (iCal/API → fetched by React) | Always fresh | CORS may block direct fetch; needs a small proxy |
| **C — Backend sync job** (cron job → writes to JSON → static site reads it) | Decoupled, easy to cache | Needs server-side process |

**Recommendation:** Start with **Option A** (build-time) using a simple Node fetch script.
Add a GitHub Actions / cron-triggered rebuild to keep it fresh. Graduate to Option C if
the site gains a backend for event submissions anyway.

#### Tasks
- [ ] Spike: fetch MN4WD calendar and inspect format
- [ ] Write `scripts/fetch-mn4wd-events.ts` — fetches, parses, and writes to
  `src/data/mn4wd-events.json`
- [ ] Update `EventCard` / Events page to display MN4WD events in a separate section
  with clear attribution ("via MN4WD Association")
- [ ] Add MN4WD events to the `ClubEvent` interface with a `source` field
  (`'club' | 'mn4wd' | 'community'`)
- [ ] Set up automated rebuild (cron or CI job) so the calendar stays current
- [ ] Filter/de-duplicate events that appear in both club and MN4WD calendars

---

### Phase 2 — Community Event Submissions

**Goal:** Allow any member to submit an event for consideration. Submitted events appear
on the site after admin approval.

#### Architecture decision ⬜

The site is currently a **fully static SPA** — there is no backend.
A submission form requires at minimum an endpoint to receive POST requests.

| Option | Complexity | Cost | Notes |
|--------|-----------|------|-------|
| **Formspree / EmailJS** | Low | Free tier | Submissions arrive as email; admin manually adds to data file. No moderation UI. |
| **Serverless function** (Cloudflare Workers / Netlify / Vercel) | Medium | Free tier | Can write to KV store or forward to email; no persistent DB |
| **Lightweight Node API on existing server** | Medium | Free (same host) | Full control; can store pending events in SQLite or flat JSON; admin approval endpoint |
| **Headless CMS** (Sanity, Contentful) | Medium | Free tier | Rich admin UI for content editors; overkill for now |

**Recommendation:** Start with a **lightweight Node/Express API on the existing server**
(already running Caddy). SQLite for pending + approved events. This also unlocks the
MN4WD sync job in one place. Long-term this becomes the site's backend.

#### Submission form (frontend)
- [ ] Add `/events/submit` route or modal
- [ ] Fields: Event name, date/time, location, description, difficulty, organizer name,
  contact email, tags, external link (optional)
- [ ] Client-side validation (required fields, date in future, etc.)
- [ ] Spam protection: honeypot field + rate limiting on the API
- [ ] CAPTCHA if spam becomes an issue (hCaptcha preferred — no Google)
- [ ] Success/error states with clear messaging

#### Backend (new service)
- [ ] `POST /api/events/submit` — accepts submission, stores as `pending`
- [ ] Email notification to admin on new submission
- [ ] `GET /api/events/approved` — returns approved events as JSON (consumed by frontend)
- [ ] Admin approval endpoints (protected by token/basic auth initially)
- [ ] Simple admin UI or CLI script for reviewing/approving/rejecting submissions
- [ ] Data model: `id`, `source`, `status` (`pending|approved|rejected`), all event fields,
  `submittedAt`, `submittedBy` (name + email, not public), `approvedAt`

#### Events page updates
- [ ] Show community-submitted events in their own section (below club + MN4WD events)
- [ ] Show submitter name (not email) and a "Submitted by the community" badge
- [ ] Link to submission form from the Events page
- [ ] Consider a simple calendar view in addition to card grid (month/list toggle)

---

## 🟡 Gallery — Phase 2

**Current state:** Placeholder stub page.

- [ ] Decide on image hosting: self-hosted in `public/gallery/` vs. external CDN
  (Cloudflare Images, Bunny, etc.) — photos can be large; CDN preferred
- [ ] Design gallery layout: masonry grid, lightbox on click
- [ ] Add photo upload path for admins (could tie into the backend above)
- [ ] Tag/filter by run or year
- [ ] Consider lazy-loading and WebP conversion at build or upload time
- [ ] EXIF stripping before publishing (privacy — removes GPS data from photos)

---

## 🟡 Merch — Phase 2

**Current state:** "Coming soon" page.

- [ ] Decide on fulfillment: print-on-demand (Printful, Printify + Shopify) vs.
  in-house bulk order
- [ ] If print-on-demand: integrate store widget or link out to storefront
- [ ] If bulk: build a simple catalog page with an order/interest form
- [ ] Design assets: ensure logo files are in vector (SVG/AI) for print use

---

## 🟢 General Site Improvements

### Content
- [ ] Fill in real event dates and locations as they are confirmed
- [ ] Replace placeholder "TBD" location text throughout events data
- [ ] Add real member bios / leadership section to About page
- [ ] Add a trail conditions or run report section (post-event write-ups)

### SEO & Discoverability
- [ ] Add `<meta>` description tags per page
- [ ] Add Open Graph / Twitter Card tags (for Facebook link previews — relevant for
  the club's primary social channel)
- [ ] Add `sitemap.xml` and `robots.txt`
- [ ] Structured data (JSON-LD) for events (`Event` schema) — improves Google visibility

### Performance & Quality
- [ ] Audit Lighthouse scores after deployment
- [ ] Optimize hero images (WebP, explicit width/height to prevent CLS)
- [ ] Add `ErrorBoundary` component for graceful runtime error handling
- [ ] Add basic analytics (privacy-respecting — Plausible or self-hosted Umami;
  no Google Analytics)

### Accessibility
- [ ] Audit color contrast ratios (red-on-dark especially)
- [ ] Ensure all interactive elements are keyboard-navigable
- [ ] Add `aria-label` to icon-only buttons/links
- [ ] Test with a screen reader

### Developer Experience
- [ ] Add `prettier` config for consistent formatting
- [ ] Set up CI (GitHub Actions): lint + build on every push
- [ ] Write a proper `README.md` for local dev setup

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-17 | Static React/TS/Vite, Bootstrap mostly unused | Established in previous session |
| 2026-05-17 | Brand palette: red `#D42B2B`, blue `#3050C8`, dark bg | Pulled from logo |
| 2026-05-17 | Gallery and Merch deferred to phase 2 | Content/logistics not ready |
| 2026-05-17 | Events backend: lightweight Node API recommended | Needed for submissions + MN4WD sync |
| 2026-05-17 | Feedback uses shared `report-service` (irc project) | Already running on server; `projects.json` has `mn4x4` entry pointing to `#4x4-brothers` room |
