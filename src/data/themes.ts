import type { Theme, ThemeId } from '../types';

// The chart is printed in one ink, like a paper star atlas: constellations are told apart by
// their place on the sheet, their name and their zodiac figure, not by colour.
const INK = {
  star: '#5B1426',              // wine-deep: star symbols
  glow: '#8A2A3D',              // wine: highlights and active controls
  line: 'rgba(138, 42, 61, 0.42)', // constellation lines
  ink: '#5B1426',               // lettering
};

// Order matters — themes are placed clockwise around the canvas in this
// sequence (see clusterCenters in utils/simulation.ts).
export const THEMES: Theme[] = [
  {
    id: 'ai',
    label: 'AI & data',
    star: INK.star,
    glow: INK.glow,
    line: INK.line,
    ink: INK.ink,
    blurb: 'models, papers, datasets',
    zodiac: '♒',
    zodiacName: 'Aquarius',
  },
  {
    id: 'music',
    label: 'Music',
    star: INK.star,
    glow: INK.glow,
    line: INK.line,
    ink: INK.ink,
    blurb: 'vinyl, listening, gigs',
    zodiac: '♎',
    zodiacName: 'Libra',
  },
  {
    id: 'travel',
    label: 'Travel',
    star: INK.star,
    glow: INK.glow,
    line: INK.line,
    ink: INK.ink,
    blurb: 'trips, stays, slow days',
    zodiac: '♐',
    zodiacName: 'Sagittarius',
  },
  {
    id: 'pages',
    label: 'Pages',
    star: INK.star,
    glow: INK.glow,
    line: INK.line,
    ink: INK.ink,
    blurb: 'reading and writing',
    zodiac: '♓',
    zodiacName: 'Pisces',
  },
  {
    id: 'making',
    label: 'Making',
    star: INK.star,
    glow: INK.glow,
    line: INK.line,
    ink: INK.ink,
    blurb: 'hardware, tools, the house',
    zodiac: '♑',
    zodiacName: 'Capricorn',
  },
  {
    id: 'wishlist',
    label: 'Wishlist',
    star: INK.star,
    glow: INK.glow,
    line: INK.line,
    ink: INK.ink,
    blurb: 'things to own someday',
    zodiac: '♉',
    zodiacName: 'Taurus',
  },
  {
    id: 'movement',
    label: 'Movement',
    star: INK.star,
    glow: INK.glow,
    line: INK.line,
    ink: INK.ink,
    blurb: 'sport, dance, fight, glide',
    zodiac: '♈',
    zodiacName: 'Aries',
  },
  {
    id: 'social',
    label: 'Social',
    star: INK.star,
    glow: INK.glow,
    line: INK.line,
    ink: INK.ink,
    blurb: 'people, games, hosting',
    zodiac: '♊',
    zodiacName: 'Gemini',
  },
];

export const THEME_BY_ID: Record<ThemeId, Theme> = THEMES.reduce(
  (acc, t) => ({ ...acc, [t.id]: t }),
  {} as Record<ThemeId, Theme>
);
