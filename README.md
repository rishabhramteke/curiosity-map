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

## Recommendations (visitor suggestions)

Click any star → the detail panel shows a list of recommendations from visitors plus a small form to leave one. **No backend, no Firebase, no infrastructure.**

The whole feature is built on top of GitHub Issues:

- **Submitting** → the form opens a prefilled `github.com/rishabhramteke/curiosity-map/issues/new` URL in a new tab. The visitor (who must have a GitHub account) clicks "Submit new issue" to publish. Their typed nickname is embedded in the issue body — their GitHub username is hidden in the panel UI.
- **Reading** → the page fetches `GET /repos/rishabhramteke/curiosity-map/issues?labels=recommendation` from GitHub's public REST API. No auth needed. Re-fetches whenever the window regains focus, so a new suggestion appears the moment a visitor returns from github.com.
- **Filtering** → the issue body contains a hidden marker like `<!-- curiosity:music-vinyl -->` so the panel matches issues to the right star.
- **Moderating** → close the issue on github.com. Closed ones disappear from the site.
- **Limit** → GitHub's unauthenticated API allows 60 reads/hour per IP. One panel open = one read; basically unhittable for a personal site.

If you want to remove the feature entirely, delete `src/services/recommendations.ts` and the related components — there's nothing else to clean up.

---

## Stack

- **React 18 + Vite + TypeScript** — fast dev, static build
- **TailwindCSS** — utility classes for the chrome (legend / detail panel / header)
- **d3-force** — physics simulation that handles the clustering and the constellation links
- **No router, no backend, no auth** — single page

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
