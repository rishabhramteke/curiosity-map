import type { ThemeId } from '../types';

// A functional-region "connectome" — not anatomy-class accurate, but each region
// sits roughly where it belongs so the glowing cloud reads as a brain. Coordinates:
//   x = left(-) / right(+),  y = down(-) / up(+),  z = back(-) / front(+)
// Mirrored regions get an L and R copy at ±x; 'C' regions sit on the midline;
// 'L' regions (Broca's) exist on the left only.

export type RegionId =
  | 'prefrontal'
  | 'motor'
  | 'parietal'
  | 'temporal'
  | 'occipital'
  | 'broca'
  | 'hippocampus'
  | 'amygdala'
  | 'cerebellum'
  | 'basalGanglia'
  | 'insula';

export type Side = 'L' | 'R' | 'C';

export interface Region {
  id: RegionId;
  name: string;
  blurb: string; // what it does, in plain words
  // base position with positive x; mirrored copies are derived for 'mirror' sides
  pos: [number, number, number];
  sides: Side[]; // which copies exist
  major?: boolean; // surface part that gets a permanent on-brain label
}

// `major` regions are the recognisable surface parts that get a permanent label.
export const REGIONS: Region[] = [
  { id: 'prefrontal', name: 'Frontal lobe', blurb: 'Planning, reasoning, focus, decisions.', pos: [0.42, 0.42, 0.82], sides: ['L', 'R'], major: true },
  { id: 'motor', name: 'Motor cortex', blurb: 'Sends the commands that move you.', pos: [0.46, 0.82, 0.12], sides: ['L', 'R'], major: true },
  { id: 'parietal', name: 'Parietal lobe', blurb: 'Space, attention, stitching the senses together.', pos: [0.46, 0.62, -0.5], sides: ['L', 'R'], major: true },
  { id: 'temporal', name: 'Temporal lobe', blurb: 'Hearing, language, faces, memory.', pos: [0.82, -0.3, 0.12], sides: ['L', 'R'], major: true },
  { id: 'occipital', name: 'Occipital lobe', blurb: 'Vision — everything you see.', pos: [0.32, 0.15, -1.05], sides: ['L', 'R'], major: true },
  { id: 'broca', name: "Broca's area", blurb: 'Building speech and language.', pos: [-0.62, 0.0, 0.6], sides: ['L'] },
  { id: 'hippocampus', name: 'Hippocampus', blurb: 'Forms memories, maps where you are.', pos: [0.42, -0.26, -0.12], sides: ['L', 'R'] },
  { id: 'amygdala', name: 'Amygdala', blurb: 'Emotion and social salience.', pos: [0.44, -0.32, 0.26], sides: ['L', 'R'] },
  { id: 'cerebellum', name: 'Cerebellum', blurb: 'Balance, timing, learning smooth skills.', pos: [0.0, -0.56, -0.86], sides: ['C'], major: true },
  { id: 'basalGanglia', name: 'Basal ganglia', blurb: 'Habits, reward, motor routines.', pos: [0.28, 0.06, 0.06], sides: ['L', 'R'] },
  { id: 'insula', name: 'Insula', blurb: 'Taste, body awareness, gut feeling.', pos: [0.52, -0.06, 0.2], sides: ['L', 'R'] },
];

export const REGION_BY_ID: Record<RegionId, Region> = REGIONS.reduce(
  (acc, r) => ({ ...acc, [r.id]: r }),
  {} as Record<RegionId, Region>
);

// Which brain regions each curiosity-theme trains. Every region is reached by at
// least one theme, so a well-rounded life lights the whole brain.
export const THEME_REGIONS: Record<ThemeId, RegionId[]> = {
  ai: ['prefrontal', 'parietal'],
  music: ['temporal', 'cerebellum', 'basalGanglia'],
  travel: ['hippocampus', 'occipital', 'insula'],
  pages: ['broca', 'temporal', 'occipital'],
  making: ['motor', 'parietal', 'cerebellum'],
  wishlist: ['basalGanglia', 'prefrontal'],
  movement: ['motor', 'cerebellum', 'basalGanglia'],
  social: ['prefrontal', 'amygdala', 'temporal'],
};

export const ALL_REGION_IDS = REGIONS.map((r) => r.id);
