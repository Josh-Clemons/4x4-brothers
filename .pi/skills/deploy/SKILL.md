---
name: deploy
description: Deploy mn4x4.org to preview or production. Handles build, preview deployment to preview.mn4x4.org, promotion to production, and rollback. Use when the user asks to deploy, push to preview, ship a fix, or roll back.
---

# Deploy — mn4x4.org

Manages the full deploy lifecycle: build → preview → promote → rollback.

## Directory layout on the server

```
/var/www/mn4x4/
  builds/
    build-<git-hash>/     ← versioned build dirs (keep 3)
  preview                 → symlink → builds/build-<hash>
  current                 → symlink → builds/build-<hash>  (production)
  previous                → symlink → builds/build-<hash>  (last production, for rollback)
```

Caddy serves:
- `mn4x4.org`         → `/var/www/mn4x4/current`
- `preview.mn4x4.org` → `/var/www/mn4x4/preview`

## One-time setup (run manually before first deploy)

```bash
.pi/skills/deploy/scripts/setup.sh
```

This checks that `/var/www/mn4x4` is writable and prints the Caddy config and DNS
instructions needed. You must run `sudo mkdir -p /var/www/mn4x4/builds && sudo chown -R josh:josh /var/www/mn4x4` before the script will proceed.

## Workflows

### Deploy to preview

```bash
.pi/skills/deploy/scripts/deploy-preview.sh
```

**When to use:** User asks to deploy, test a fix, or push to preview.

**What it does:**
1. Aborts if there are uncommitted changes — tell the user to commit first
2. Runs `npm run lint && npm run build` — aborts on any failure
3. rsyncs `dist/` to `/var/www/mn4x4/builds/build-<git-hash>/`
4. Writes `deploy.json` into the build dir (hash, message, timestamp)
5. Points `/var/www/mn4x4/preview` at the new build
6. Prunes oldest builds, keeping 3 (never deletes current or previous)
7. Smoke-tests `https://preview.mn4x4.org` — HTTP 200 + body contains "mn4x4"

**Report to the user:**
- Commit hash and message
- `https://preview.mn4x4.org` — tell them to check it
- Any failures with full output

**If uncommitted changes:** Tell the user exactly what files are uncommitted and ask
them to commit before you can deploy.

---

### Promote to production

```bash
.pi/skills/deploy/scripts/promote.sh
```

**When to use:** User confirms preview looks good and says to ship it / promote / go live.

**What it does:**
1. Reads what `preview` and `current` point to
2. Refuses if they're already the same build
3. Saves `current` → `previous` symlink (enables one-step rollback)
4. Points `current` at what `preview` points to
5. Smoke-tests `https://mn4x4.org` — HTTP 200 + body contains "mn4x4"
6. Auto-rolls back and exits with error if smoke test fails

**Report to the user:**
- "Production updated → <hash>: <message>"
- "Previous build <hash> saved for rollback"
- Smoke test result

---

### Roll back production

```bash
.pi/skills/deploy/scripts/rollback.sh
```

**When to use:** User reports something is broken in production and wants to revert.
Act quickly — don't ask for extra confirmation before running this.

**What it does:**
1. Swaps `current` and `previous` symlinks
2. Smoke-tests `https://mn4x4.org`

**Report to the user:**
- "Rolled back from <hash> to <hash>"
- Smoke test result

---

## Conversation patterns

### Normal deploy flow

```
User:  "The nav fix is in, deploy to preview"
Agent: [checks git] → [builds] → [deploys preview] → [smoke tests]
       "Preview is live at https://preview.mn4x4.org
        Commit a3f9c12: 'Fix mobile nav collapse' — smoke test OK"

User:  "Looks good, ship it"
Agent: [promotes] → [smoke tests]
       "Production updated → a3f9c12: 'Fix mobile nav collapse'
        Previous build d7b0e45 saved for rollback. Smoke test OK."
```

### Build failure

```
Agent: "Build failed — ESLint errors in src/components/Navbar.tsx:
        Line 42: 'handleToggle' is defined but never used.
        Fix the errors and commit, then I can deploy."
```

### Uncommitted changes

```
Agent: "There are uncommitted changes:
         M  src/components/Navbar.tsx
         M  src/styles/theme.css
        Please commit these before deploying so we know exactly what's live."
```

### Rollback

```
User:  "Something broke, roll it back"
Agent: [runs rollback immediately]
       "Rolled back. Production is now serving d7b0e45: 'Update event card layout'
        (was a3f9c12). Smoke test OK."
```

## Scripts reference

```
.pi/skills/deploy/
├── SKILL.md                        ← this file
└── scripts/
    ├── setup.sh                    ← one-time server setup guide
    ├── deploy-preview.sh           ← build + push to preview
    ├── promote.sh                  ← promote preview → production
    └── rollback.sh                 ← swap production back to previous
```
