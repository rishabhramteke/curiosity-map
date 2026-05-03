export type ThemeId = 'ai' | 'music' | 'travel' | 'books' | 'tech';
export type Status = 'idea' | 'doing' | 'done';

export interface Curiosity {
  id: string;
  title: string;
  description: string;
  theme: ThemeId;
  status: Status;
  link?: string;
  note?: string;
}

export interface Theme {
  id: ThemeId;
  label: string;
  // Tailwind-friendly hex colors used both in SVG fills and CSS pills.
  star: string;       // bright star color
  glow: string;       // halo / pulse color
  line: string;       // constellation line color
  ink: string;        // label text color (light, on dark bg)
  blurb: string;      // tiny description for the legend
}

// Position assigned by the d3-force simulation (mutated each tick).
export interface PositionedCuriosity extends Curiosity {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}
