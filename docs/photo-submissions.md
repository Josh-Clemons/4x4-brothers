# Photo Submissions — Design & Phasing

> Status: **Phase A built (frontend + service), not yet deployed.** Frontend is
> gated behind `VITE_FLAG_PHOTO_SUBMIT`; the irc `report-service` changes need a
> service restart. Enable the flag only after the service restart, or
> submissions 400.
> Created: 2026-06-13. Owner: Josh.
> Related: gallery feature in `ROADMAP.md`; photo hosting in `README.md`
> ("Photos" section); intake stack is the `report-service` in the **irc** repo.

How visitors/members could submit their own trail/rig photos for inclusion in the
gallery and rigs pages, with Josh approving each one before it goes live. This doc
captures the option space and the phased plan so we can revise/build on it later.

---

## Context (what we're building on)

- The site is **static** (React/Vite `dist/` via Caddy behind a Cloudflare tunnel).
  Receiving a photo means receiving **bytes** somewhere server-side.
- An intake stack already exists for the **feedback form**: `ReportModal.tsx` →
  `POST /api/report` → Caddy → `report-service` (Node, `127.0.0.1:7823`). It does
  auth (bearer), honeypot, rate-limit, validation, spam-triage; logs to SQLite; posts
  a "report card" to the `#4x4-brothers` Matrix room; and **triggers `pi-matrix-bridge`
  to run an agent investigation that posts analysis and waits for Josh's approval.**
  → The "submission → agent prepares → Josh approves/denies" loop already runs for
  *text* today. The gaps for photos are (a) binary handling and (b) wiring approval
  to a publish step.
- Photos are hosted **outside the repo** at `/var/www/mn4x4/photos/`, served at
  `mn4x4.org/photos/`, resized/WebP'd/edge-cached via Cloudflare Image
  Transformations. Ingest today is `scripts/add-photo.sh` (auto-orient, strip
  EXIF/GPS, cap resolution). Data lives in `src/data/albums.ts` / `rigs.ts` as bare
  filenames, deployed via the build.

### The constraint that shapes everything

> Do untrusted **binaries land on the home server at all**, or do we keep them off it?
> Every option below is a point on that axis.

---

## Options (least → most build, and least → most attack surface)

### A — Link submission (binaries never touch our infra) — **chosen start**
Add a URL field + consent checkbox to a submit form (clone of `ReportModal`); POST
text to the existing `report-service` → Matrix card. Submitter hosts the photos
elsewhere (Google Photos/Drive/Imgur/FB album) and pastes the link. Josh (or an
agent) fetches on our terms, runs `add-photo.sh`, curates into the data files.
- **Pros:** tiny build; reuses the existing channel + spam gate; **zero binary-upload
  attack surface**; we choose if/when to fetch; the agent-prep + approve loop already
  works on the text card.
  - *Caveat on "we choose when to fetch":* this holds only because photo submissions
    will **skip the bridge investigation** (decided below). `routes.mjs` auto-triggers
    an investigation for every non-spam report, and the bwrap sandbox intentionally
    keeps network access (the model API needs it) — so an agent handed the URL could
    fetch it. Skipping the investigation for this type keeps fetching deliberate.
- **Cons:** friction for submitters (must host first); we still do the fetch + ingest;
  a link can point at junk (but fetching is deliberate, never automatic).

### B — Direct upload to a quarantined staging area (binaries land, but gated)
New `/api/photo` multipart endpoint (extend `report-service` or a sibling) with
strict size/count/type limits, storing to a staging dir **outside the web root**.
Posts a Matrix card with a thumbnail + EXIF summary. Josh approves → `add-photo.sh`
runs from staging → data file update → deploy.
- **Pros:** best submitter UX (upload on-site); single channel; nothing auto-publishes;
  staging keeps unverified bytes off the public path.
- **Cons:** accepting untrusted binaries on the home server — the real security cost
  (see cross-cuts). Moderate build.

### C — Agent-assisted prep on top of B ("agent gets it ready, I approve/deny")
`pi-matrix-bridge` agent picks up a staged submission, strips EXIF, generates the
`thumb/card/full` variants, drafts the `albums.ts`/`rigs.ts` entry (ideally a git
branch/PR), renders a preview, posts "ready — approve/deny." Approve → moves file to
`/photos`, commits, deploys. Deny → purges staged bytes.
- **Pros:** maximum leverage — just approve/deny; small conceptual step from the
  investigation agent already running; removes the resize + data-entry toil.
- **Cons:** most moving parts and most to secure — untrusted image processing **plus**
  prompt-injection exposure (captions/filenames/EXIF text are attacker-controlled).
  Build last, on a proven B.

### D — Offload intake to a third party (Google Form→Drive, Airtable, …)
Users upload to a hosted form; Josh reviews in their dashboard; bridge approved ones
to `add-photo.sh`.
- **Pros:** near-zero infra/attack surface (they handle upload, malware scanning,
  storage, abuse); free.
- **Cons:** off-brand (leaves the site); adds a dependency (ROADMAP leans no-Google);
  submissions live with a third party.

---

## Security cross-cuts (mostly B/C)

- **Human approval before publish is non-negotiable** for any option — not just
  quality but legal (illegal content/CSAM liability, copyright, inappropriate
  material). Keep publish strictly behind the gate.
- **Processing untrusted images is the sharp edge.** `add-photo.sh` uses
  ImageMagick (CVE history — "ImageTragick"). If binaries arrive:
  **re-encode** rather than copy (kills polyglots), strip *all* metadata, and run
  processing in an **ephemeral sandbox/container — no network, CPU/mem/time limits,
  output-size caps** (defuses decompression bombs). Consider libvips for a smaller
  attack surface.
- **Intake hardening:** hard size cap, max count, server-side rate-limit
  (`rate-limiter.mjs` exists), magic-byte/type allowlist (jpeg/png/webp/heic; reject
  archives). `VITE_REPORT_SECRET` is only a trivial gate (baked into the public
  bundle) — for an upload endpoint add **Cloudflare Turnstile** (free; already behind
  CF) for real bot resistance.
- **Prompt injection (C):** agent must treat captions/filenames/EXIF as *data, never
  instructions* (irc `AGENTS.md` `<external-submission>` rule). Enforce approval in
  the pipeline; don't trust the agent to gate it.
- **Consent/attribution + privacy:** checkbox ("I have the right to share this; OK to
  publish; optional credit name"), GPS already stripped on ingest, plus a one-line
  submission policy.

---

## Recommended phasing

1. **Phase A — link submission.** Real on-site "submit your photos," reuses
   everything, no new attack surface. Learn whether people use it and at what volume.
2. **Phase B — staged upload** on the same channel, with sandboxed processing — only
   if demand justifies smoother UX.
3. **Phase C — agent prep** once B is proven; the "cool agent" payoff lands after the
   risky binary path is hardened.
4. **Phase D** as an alternative to B/C if we'd rather not run intake ourselves.

Each phase is independently shippable; don't build/secure the heavy pipeline until
it's worth it.

---

## Phase A — build sketch (next step)

Concrete enough to pick up cold. Not yet implemented. Open questions resolved
2026-07-03 (see "Decisions" below).

- **Frontend:** a "Submit Photos" form — either a new `SubmitPhotosModal` or a variant
  of `ReportModal`. Fields: name (req), email (opt), **photo link URL (req)**, what
  it's from / album or rig context (textarea), and a **consent checkbox** ("I have the
  right to share these and they can be posted; optional photo credit"). A **short
  guidelines blurb** (2–3 lines above the consent checkbox: must be yours or you have
  permission; location data is stripped; credit optional; everything is reviewed
  before posting). Keep the existing honeypot. Reuse `report-field` styles.
- **Transport:** reuse `POST /api/report` with a new `type: 'photo_submission'` and
  dedicated `photoUrl` + `consent` fields. Note: `routes.mjs`/`db.mjs`/
  `matrix-poster.mjs` handle a **fixed field set — unknown fields are silently
  dropped** (not persisted, not shown on the card), so all three need the new fields
  plumbed through, plus `photo_submission` added to `VALID_TYPES` and a `LIMITS`
  entry for `photoUrl`.
- **Service side (irc repo):** in `report-service` — accept the new type + fields,
  render a dedicated Matrix card (URL clickable, consent flag visible), and **skip
  the bridge investigation for this type** (it reads project code, which says nothing
  about a photo link, and skipping keeps the URL out of an agent with network
  access). Side benefit of the dedicated `photoUrl` field: the URL stays out of
  `message`, so triage's "contains URL" flag won't fire on every submission. No
  binary handling anywhere.
- **Entry points:** a "Submit Photos" button in the **Gallery and Rigs page
  headers**, visible whether or not albums/rigs exist yet — so submissions keep
  coming after the pages fill in. (No nav item or footer link for now.)
- **Curation (manual, unchanged):** Josh fetches the linked photos, runs
  `add-photo.sh`, fills in `albums.ts`/`rigs.ts`, deploys.

### Decisions (2026-07-03)
- **New `type: 'photo_submission'`, dedicated fields, no investigation** — clean
  routing, a useful approval card, and the "never fetch automatically" property
  actually holds.
- **Entry points: Gallery/Rigs page headers** (persistent, not just empty states).
- **Guidelines: short blurb inside the modal**, no separate page.

---

## Phase A.5 — direct-to-R2 upload (built 2026-07-04)

Direct upload from the submit form **without any binaries touching the home
server** — supersedes Phase B (same UX win, none of the on-server binary
handling, so B is now obsolete). Bytes go to a **private Cloudflare R2
quarantine bucket** via a Cloudflare Worker on the zone:

```
Browser (SubmitPhotosModal)
  ├─ 1. Turnstile widget → token
  ├─ 2. POST mn4x4.org/api/photo-upload/session {token} → Worker verifies via
  │      siteverify, returns HMAC-signed upload ticket (15 min)
  ├─ 3. POST /api/photo-upload/file (×N, raw bytes) → Worker checks ticket,
  │      size ≤20 MB, magic bytes (jpeg/png/webp/heic) → R2 → {key}
  └─ 4. POST /api/report {type: photo_submission, photoKeys: [...]}
         → report-service → SQLite audit row + 📸 Matrix card (unchanged)
Josh approves → scripts/fetch-submission.sh <keys> → add-photo.sh → deploy
```

- **Worker:** `workers/photo-upload/` in this repo (route
  `mn4x4.org/api/photo-upload*` — same-origin, intercepts before the tunnel).
  Secrets: `TURNSTILE_SECRET_KEY`, `UPLOAD_TICKET_SECRET`.
- **Bucket:** `mn4x4-photo-submissions` — private, nothing serves from it,
  60-day lifecycle delete. Worst-case abuse is quota, not security.
- **Limits:** 10 photos / 20 MB each per submission; Turnstile gates the
  session endpoint; a WAF rate-limit rule covers `/api/photo-upload*`
  (the Worker is stateless, so per-ticket file count is client-enforced).
- **Frontend:** upload is the primary path; "paste a link" stays as a
  collapsed fallback. If `VITE_TURNSTILE_SITE_KEY` is unset at build time the
  modal degrades to the Phase A link-only form.
- **report-service:** new optional `photoKeys` field (≤10 keys matching
  `^submissions/…`); requires `photoUrl` or `photoKeys`; keys are stored in
  `photo_keys` (JSON) and shown on the Matrix card. Link-only submissions are
  unchanged.
- **Retrieval:** `scripts/fetch-submission.sh <key>...` pulls approved
  uploads via wrangler into `~/photo-submissions/`; then `add-photo.sh`
  re-encodes and strips EXIF as always. Fetching stays a deliberate human
  step — keys (not URLs) reach the agent handoff, and nothing fetches
  automatically.

---

## Changelog
- 2026-07-04 — **Phase A.5 implemented** (see section above): photo-upload
  Worker + private R2 quarantine bucket, Turnstile-gated direct upload in
  `SubmitPhotosModal` with link fallback, `photoKeys` support in
  report-service, `scripts/fetch-submission.sh`. Phase B declared obsolete.
- 2026-07-03 — **Context handoff added** (irc repo, `report-service`): skipping
  the investigation also meant photo submissions never entered the bridge's
  open set, so Josh's reply to a card reached the agent with no context. The
  service now writes a handoff row (submission details wrapped in
  `<external-submission>`, via the investigation-results DB columns) at
  submission time; the bridge's existing reply flow attaches it. The URL still
  only reaches an agent after Josh's deliberate reply — no automatic fetching.
- 2026-06-13 — Initial capture of the option space + phasing; Phase A chosen as start.
- 2026-07-03 — **Phase A implemented** (not yet deployed). Site:
  `SubmitPhotosModal` + hero buttons on Gallery/Rigs behind
  `VITE_FLAG_PHOTO_SUBMIT`. irc `report-service`: `photo_submission` type with
  `photoUrl`/`consent` (validated: http(s) URL, consent must be true, 512-char
  cap), consent recorded in SQLite for the audit trail, dedicated 📸 Matrix
  card, investigation skipped. Verified against an isolated service instance
  (valid/invalid/oversize/rate-limit paths + 'other'-type regression).
- 2026-07-03 — Reviewed against both repos; fixed inaccuracies (add-photo.sh is
  ImageMagick-only; new payload fields are dropped without service changes; the
  investigation auto-trigger + sandbox network access undercut "never fetch
  automatically" unless the type skips investigation). Resolved all Phase A open
  questions: new `photo_submission` type with dedicated fields and no investigation;
  entry points in Gallery/Rigs page headers; guidelines blurb in the modal.
