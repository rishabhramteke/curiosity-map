import type { Theme, ThemeId } from '../types';

export const THEMES: Theme[] = [
  {
    id: 'ai',
    label: 'AI rabbit holes',
    star: '#c7d2fe',
    glow: '#a5b4fc',
    line: 'rgba(165,180,252,0.45)',
    ink: '#c7d2fe',
    blurb: 'papers, models, weird tools',
  },
  {
    id: 'music',
    label: 'Music',
    star: '#fde68a',
    glow: '#facc15',
    line: 'rgba(252,211,77,0.5)',
    ink: '#fde68a',
    blurb: 'instruments, gigs, listening',
  },
  {
    id: 'travel',
    label: 'Travel',
    star: '#a7f3d0',
    glow: '#34d399',
    line: 'rgba(110,231,183,0.45)',
    ink: '#a7f3d0',
    blurb: 'places, trips, seasons',
  },
  {
    id: 'books',
    label: 'Books',
    star: '#fbcfe8',
    glow: '#f472b6',
    line: 'rgba(244,114,182,0.45)',
    ink: '#fbcfe8',
    blurb: 'reading list, worlds',
  },
  {
    id: 'tech',
    label: 'Tech tinkering',
    star: '#fdba74',
    glow: '#fb923c',
    line: 'rgba(251,146,60,0.45)',
    ink: '#fdba74',
    blurb: 'side projects, hardware',
  },
];

export const THEME_BY_ID: Record<ThemeId, Theme> = THEMES.reduce(
  (acc, t) => ({ ...acc, [t.id]: t }),
  {} as Record<ThemeId, Theme>
);
