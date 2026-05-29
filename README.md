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
  pages/          Home, About, Events, Gallery (stub), Merch (stub)
  components/     Navbar, Footer, EventCard, ReportModal  (+matching .css files)
  data/           club.ts (club metadata), events.ts (run data)
  styles/         theme.css (design tokens), pages.css (shared layout)
  main.tsx        entry point
  App.tsx         router + top-level layout
public/           static assets (logos)
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
