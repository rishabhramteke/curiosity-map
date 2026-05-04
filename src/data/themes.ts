import type { Theme, ThemeId } from '../types';

// Order matters — themes are placed clockwise around the canvas in this
// sequence (see clusterCenters in utils/simulation.ts).
export const THEMES: Theme[] = [
  {
    id: 'ai',
    label: 'AI & data',
    star: '#c7d2fe',
    glow: '#a5b4fc',
    line: 'rgba(165,180,252,0.45)',
    ink: '#c7d2fe',
    blurb: 'models, papers, datasets',
  },
  {
    id: 'music',
    label: 'Music',
    star: '#fde68a',
    glow: '#facc15',
    line: 'rgba(252,211,77,0.5)',
    ink: '#fde68a',
    blurb: 'vinyl, listening, gigs',
  },
  {
    id: 'travel',
    label: 'Travel',
    star: '#a7f3d0',
    glow: '#34d399',
    line: 'rgba(110,231,183,0.45)',
    ink: '#a7f3d0',
    blurb: 'trips, stays, slow days',
  },
  {
    id: 'pages',
    label: 'Pages',
    star: '#fbcfe8',
    glow: '#f472b6',
    line: 'rgba(244,114,182,0.45)',
    ink: '#fbcfe8',
    blurb: 'reading and writing',
  },
  {
    id: 'making',
    label: 'Making',
    star: '#fdba74',
    glow: '#fb923c',
    line: 'rgba(251,146,60,0.45)',
    ink: '#fdba74',
    blurb: 'hardware, tools, the house',
  },
  {
    id: 'wishlist',
    label: 'Wishlist',
    star: '#ddd6fe',
    glow: '#a78bfa',
    line: 'rgba(167,139,250,0.45)',
    ink: '#ddd6fe',
    blurb: 'things to own someday',
  },
  {
    id: 'movement',
    label: 'Movement',
    star: '#bef264',
    glow: '#84cc16',
    line: 'rgba(132,204,22,0.5)',
    ink: '#bef264',
    blurb: 'sport, dance, fight, glide',
  },
  {
    id: 'social',
    label: 'Social',
    star: '#7dd3fc',
    glow: '#38bdf8',
    line: 'rgba(56,189,248,0.5)',
    ink: '#7dd3fc',
    blurb: 'people, games, hosting',
  },
];

export const THEME_BY_ID: Record<ThemeId, Theme> = THEMES.reduce(
  (acc, t) => ({ ...acc, [t.id]: t }),
  {} as Record<ThemeId, Theme>
);
