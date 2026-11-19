# Onkar Singh — Resume Site

Single-page resume site for Onkar Singh, Major Incident, Problem & Change Manager. Built with React 18 and Vite.

## Project layout

- `src/data.js` — all resume content (edit this to update the site)
- `src/components/` — page sections (`Hero`, `Sections`, `Chrome` for nav/background/footer, `ui` for shared pieces)
- `src/hooks.js` — animation helpers (scroll reveal, text decrypt, count-up, spotlight, magnet)
- `src/styles.css` — all styles, following `DESIGN.md`
- `DESIGN.md` — the design spec

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy

Every push to `main` builds and deploys to GitHub Pages through `.github/workflows/deploy.yml`.
One-time setup: in the repo go to **Settings → Pages** and set **Source** to **GitHub Actions**.
