# Curiosity Map ✦

> A constellation of curiosities — things to do, places to go, side quests, sparks.

A personal night-sky of interests. Items are stars, themes are constellations, the layout is driven by a `d3-force` physics simulation so the map feels alive without ever pretending to be a real map.

**Live:** https://rishabhramteke.github.io/curiosity-map/

---

## What it does

- Each item in `src/data/items.ts` becomes a glowing star.
- Items in the same `theme` cluster together via attractive forces and connect with faint constellation lines.
- Star size encodes status (`idea` < `doing` < `done`).
- Hover a star → tooltip. Click → detail panel with description, link, status.
- Drag any star to nudge it; the simulation reclaims it when you let go.
- Click a theme in the legend to hide/show that constellation.

No backend, no analytics, no auth — just a static page that rebuilds when you push.

---

## Edit your map

The whole point is to make this yours.

- **Add or change items** → edit `src/data/items.ts`.
- **Add or change themes** → edit `src/data/themes.ts` (each theme picks its star/glow/line/ink colors).
- **Tweak the physics** → `src/utils/simulation.ts` (`createSimulation` for forces, `buildLinks` for the constellation graph topology).
- **Tweak the visuals** → `src/components/ConstellationMap.tsx` (the SVG composition) and `src/components/StarNode.tsx` (one star).

Push to `main` → GitHub Actions rebuilds and deploys.

---

## Stack

- **React 18 + Vite + TypeScript** — fast dev, static build
- **TailwindCSS** — utility classes for the chrome (legend / detail panel / header)
- **d3-force** — physics simulation that handles the clustering and the constellation links
- **No router** — single page

---

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173/curiosity-map/.

```bash
npm run build && npm run preview   # check the production build
```
