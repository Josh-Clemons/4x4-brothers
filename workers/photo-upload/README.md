# photo-upload Worker

Cloudflare Worker behind `mn4x4.org/api/photo-upload*` that takes direct photo
uploads from the site's submit form into the **private** R2 quarantine bucket
`mn4x4-photo-submissions` (60-day lifecycle delete). Bytes never reach the home
server; nothing is ever served from the bucket. See
`docs/photo-submissions.md` (Phase A.5) for the full architecture.

## Endpoints

- `POST /api/photo-upload/session` — body `{token}` (Turnstile). Returns
  `{ticket}`, an HMAC-signed upload ticket valid 15 minutes.
- `POST /api/photo-upload/file` — raw image bytes with headers
  `X-Upload-Ticket`, `X-File-Name`, `X-File-Index` (0–9). Max 20 MB; magic-byte
  sniffed (jpeg/png/webp/heic only). Returns `{key}`.

## Secrets

```sh
npx wrangler secret put TURNSTILE_SECRET_KEY   # from the Turnstile widget
npx wrangler secret put UPLOAD_TICKET_SECRET   # random 32-byte hex
```

## Dev / deploy

```sh
npm install
npm run dev      # local R2 simulation on :8787 (the Vite dev proxy points here)
npm run deploy
```

For local dev, put the Turnstile *test* secret in `.dev.vars`:

```
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
UPLOAD_TICKET_SECRET=<any hex string>
```

Retrieval after Josh approves a card: `scripts/fetch-submission.sh <key>...`
from the repo root.
