# mn4x4.org — Roadmap & Feature Backlog

> Last updated: 2026-06-07
> Current state: 5-page React/TS/Vite site — **live in production**.
> Served from `dist/` via Caddy, fronted by Cloudflare through a `cloudflared` tunnel
> (origin IP hidden). Events are curated by hand in `src/data/events.ts`.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| 🔴 | Blocking / must-do |
| 🟡 | High priority — near-term |
| 🟢 | Nice-to-have / phase 2+ |
| ⬜ | Needs research / decision required |
| ✅ | Done |

---

## ✅ Deployment — DONE

The site is launched and serving the Vite `dist/` build.

- [x] Caddy points at the new `dist/` output
- [x] React Router catch-all rewrite in place (SPA routes resolve)
- [x] HTTPS working
- [x] Behind Cloudflare via a `cloudflared` tunnel — origin IP is not exposed,
      so edge caching / DDoS features come "for free" from Cloudflare's side

---

## ✅ Infrastructure — Cloudflare — DONE

Resolved the earlier "⬜ research" item. The site sits behind Cloudflare via a
`cloudflared` tunnel. Origin IP is hidden; no inbound ports exposed on the home server.

Remaining optional tuning (🟢, only if traffic warrants):
- [ ] Confirm/enable Cache Rules for `dist/` static assets at the edge
- [ ] Bot Fight Mode (free tier) if scrapers become a nuisance

---

## ✅ Events — Resolved (manual curation, no backend)

The big "Events overhaul" from the old roadmap was **descoped**. What actually happened:

- Events are **hand-curated** in `src/data/events.ts` (real club + regional runs,
  with real dates pulled from the MN4WDA calendar manually).
- Events are sorted by date at export time; past events are hidden from the
  homepage featured runs while the Events page shows the full schedule.

Decisions:
- ❌ **Automated MN4WD calendar sync — not pursued.** No fetch script / no
  `mn4wd-events.json` / no `source` field. Manual curation is good enough for the
  volume of events the club runs. (Revisit only if event count grows a lot.)
- ❌ **Community event submissions — not pursued.** No public submission flow and
  no plan to add one; this keeps the site fully static with no backend to run.

> Note: the only server-side dependency is the **feedback/report feature**
> (`ReportModal`), which posts to the shared `report-service` (see Decisions Log).

---

## 🟡 SEO & Discoverability — OPEN (next focus)

None of this is done yet — `index.html` has no meta/OG tags and there is no
`robots.txt` / `sitemap.xml`. This is the highest-value remaining work for a public site.

- [ ] Add per-page `<meta name="description">` (SPA — needs react-helmet or
      equivalent for per-route tags, or static tags in `index.html` as a baseline)
- [ ] Add Open Graph / Twitter Card tags — important for Facebook link previews
      (the club's primary social channel)
- [ ] Add `public/robots.txt` and `public/sitemap.xml`
- [ ] Structured data (JSON-LD `Event` schema) for the events list

---

## 🟡 Gallery — phase 1 built, dark behind flags

Phase 1 (curated event albums + member rigs showcase) is implemented behind
`VITE_FLAG_GALLERY` / `VITE_FLAG_RIGS` (default off — prod still shows the stub).
Plan: `~/.claude/plans/i-like-your-read-quirky-matsumoto.md`.

- [x] Decide image hosting: **self-hosted at `/var/www/mn4x4/photos` (outside the
      repo) + Cloudflare Image Transformations** (free tier) for resize/WebP/edge
      cache — repo carries no content binaries, $0/mo
- [x] Layout: album grid + lightbox (`yet-another-react-lightbox`), rigs page styled
      like the About board cards
- [x] Lazy-loading + CSS aspect-ratio (edge serves WebP/AVIF via `format=auto`)
- [x] EXIF stripping (privacy — removes GPS data): `scripts/add-photo.sh` auto-orients
      and strips before files reach the web root; `metadata=none` on delivery as backup
- [ ] **To go live:** enable Image Transformations for the zone (dashboard → Images),
      create `/var/www/mn4x4/photos` + add the Caddy `/photos/*` handler, ingest board
      photos + first album, switch `club.ts` board photos to filenames + delete
      `public/board/*.webp`, flip flags
- [ ] Tag/filter by run or year — once content exists
- [ ] Masonry layout — nice-to-have

---

## 🟢 Photo submissions — Phase A built, pending deploy

Letting visitors/members submit their own photos for the gallery/rigs, with Josh
approving each before publish. Full option space + trade-offs + phasing in
[`docs/photo-submissions.md`](docs/photo-submissions.md).

- Phased plan: **A** link submission (reuses `report-service`, no binary intake) →
  **B** staged upload → **C** agent-assisted prep → (**D** third-party intake as alt).
- [x] **Phase A built (2026-07-03):** `SubmitPhotosModal` + hero buttons on
      Gallery/Rigs behind `VITE_FLAG_PHOTO_SUBMIT`; `report-service` accepts
      `photo_submission` (link + consent, dedicated Matrix card, no agent
      investigation). Josh fetches + ingests via `scripts/add-photo.sh` manually.
- [ ] **Deploy:** restart `report-service` (irc repo) first, then ship a site
      build with `VITE_FLAG_PHOTO_SUBMIT=true`.
- [ ] Phase B+ deferred until Phase A shows real demand.

---

## 🟡 Merch — still a stub

`src/pages/Merch.tsx` is a "Coming Soon" placeholder linking to Facebook.

- [ ] Decide fulfillment: print-on-demand (Printful/Printify) vs. in-house bulk order
- [ ] If POD: integrate store widget or link out to storefront
- [ ] If bulk: catalog page + order/interest form
- [ ] Ensure logo files exist in vector (SVG/AI) for print

---

## 🟢 About page — flagged sections to finish & enable

Three About sections are **built but gated off** via `src/config/flags.ts`
(`VITE_FLAG_ABOUT_*`, default OFF). Content exists in `src/data/club.ts`.

- [ ] "Our History" (`aboutHistory`) — review copy, then enable
- [ ] "Milestones" timeline (`aboutMilestones`) — dates/events are placeholder-ish; verify before enabling
- [ ] "What Drives Us" / Core Values (`aboutValues`) — review copy, then enable
- [x] Board / leadership section with bios + photos — **live**

---

## 🟢 General Site Improvements

### Content (mostly done)
- [x] Real event dates and locations in `events.ts`
- [x] Real leadership/board bios on About
- [ ] Trail conditions / run report section (post-event write-ups) — not started

### Performance & Quality — OPEN
- [ ] Audit Lighthouse scores in production
- [ ] Optimize hero images (WebP, explicit width/height to prevent CLS)
- [ ] Add an `ErrorBoundary` for graceful runtime error handling — not present
- [ ] Privacy-respecting analytics (Plausible or self-hosted Umami; no Google) — not present

### Accessibility — OPEN
- [ ] Audit color contrast (red-on-dark especially)
- [ ] Keyboard-navigability pass on all interactive elements
- [ ] `aria-label` on icon-only buttons/links
- [ ] Screen-reader test

### Developer Experience — OPEN
- [ ] Add a `prettier` config (none exists)
- [ ] Set up CI (GitHub Actions): lint + build on push (no `.github/` yet)
- [x] README covers local dev setup

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-17 | Static React/TS/Vite, Bootstrap mostly unused | Established in previous session |
| 2026-05-17 | Brand palette: red `#D42B2B`, blue `#3050C8`, dark bg | Pulled from logo |
| 2026-05-17 | Gallery and Merch deferred to phase 2 | Content/logistics not ready |
| 2026-05-17 | Feedback uses shared `report-service` (irc project) | Already running on server; `projects.json` has `mn4x4` entry pointing to `#4x4-brothers` room |
| 2026-06-07 | Site is live; served from `dist/` via Caddy behind a Cloudflare `cloudflared` tunnel | Launch complete; origin IP hidden, no inbound ports exposed |
| 2026-06-07 | **Automated MN4WD calendar sync — dropped.** Events curated by hand in `events.ts` | Manual curation is sufficient for current event volume; avoids standing up a backend |
| 2026-06-07 | **Community event submissions — dropped.** | Keeps the site fully static; no backend to maintain |
| 2026-06-07 | About History/Milestones/Values kept behind feature flags | Copy not finalized; shipped board section only |
