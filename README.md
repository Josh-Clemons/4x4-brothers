# mn4x4.org

Website for the **Minnesota 4x4 Brothers**, a four-wheel drive club established in 1967.  
Live at [mn4x4.org](https://mn4x4.org).

---

## Stack

| | |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Build tool | Vite 5 |
| Routing | React Router v6 (client-side, Caddy catch-all required) |
| Styling | Custom CSS design system (`src/styles/theme.css`) + Bootstrap 5 (minimal use) |
| Typography | [Imbue](https://fonts.google.com/specimen/Imbue) (Google Fonts, loaded in `index.html`) |
| Data | Static TypeScript files in `src/data/` — no backend yet |

**Brand palette:** red `#D42B2B` · blue `#3050C8` · dark background `#111827`

---

## Local Development

**Prerequisites:** Node.js 18+, npm

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # type-check + production build → dist/
npm run lint      # ESLint (zero warnings policy)
npm run preview   # serve dist/ locally
```

---

## Directory Structure

```
src/
  pages/          Home, About, Events, Gallery, Album, Rigs, Merch (stub)
  components/     Navbar, Footer, EventCard, ReportModal  (+matching .css files)
  data/           club.ts (club metadata), events.ts (run data),
                  albums.ts (event photo albums), rigs.ts (member builds)
  lib/            photos.ts (photo delivery URLs), dates.ts (date formatting)
  styles/         theme.css (design tokens), pages.css (shared layout)
  main.tsx        entry point
  App.tsx         router + top-level layout
public/           static assets (logos)
scripts/          add-photo.sh (photo ingest: orient, strip EXIF, install)
dist/             build output — served by Caddy in production
```

---

## Design Conventions

- One component per file; CSS file co-located with its component
- Use CSS custom properties from `theme.css` — do **not** hardcode colours or spacing
- Use brand utility classes (`btn-brand-red`, `badge-difficulty`, etc.) before writing new CSS
- Data files use `as const` and export a single default object/array
- Keep Bootstrap imports minimal; prefer custom CSS

---

## Photos (self-hosted + Cloudflare edge transformations)

Content photos (gallery albums, member rigs, board portraits) live **on the
server, outside this repo**, at `/var/www/mn4x4/photos/` — Caddy serves the
directory at `mn4x4.org/photos/`. The repo carries only the tiny logos/favicon.
Delivery goes through Cloudflare **Image Transformations** (free tier: 5,000
unique transformations/month): resized to `thumb`/`card`/`full` widths,
converted to WebP/AVIF, and cached at the edge. `src/lib/photos.ts` is the
only place that builds those URLs; data files store bare filenames
(e.g. `memorial-rally-2026-01.jpg`).

Add photos with the ingest script — it bakes in EXIF rotation, strips all
metadata (EXIF/GPS), and caps resolution *before* anything hits the web root:

```bash
scripts/add-photo.sh memorial-rally-2026-01.jpg ~/photos/IMG_4821.jpg
```

One-time setup: enable Image Transformations for the zone (Cloudflare
dashboard → Images → Transformations), create `/var/www/mn4x4/photos`, and
add the `/photos/*` handler to the Caddyfile.

The gallery and rigs pages ship dark behind feature flags (`VITE_FLAG_GALLERY`,
`VITE_FLAG_RIGS` — see `src/config/flags.ts`). The `/gallery` route itself
stays live either way; the flag only swaps its content between the album index
and the "Coming Soon" stub.

---

## Deployment

The site is served by Caddy. React Router requires a catch-all rewrite so all paths fall back to `index.html`:

```caddy
mn4x4.org {
    root * /var/www/mn4x4/current
    try_files {path} /index.html
    file_server
}
```

See `.pi/skills/deploy/SKILL.md` for the full build → preview → promote → rollback workflow.

---

## Roadmap

Active feature backlog lives in [`ROADMAP.md`](ROADMAP.md).
