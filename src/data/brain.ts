import type { ThemeId } from '../types';

// A functional-region "connectome" — not anatomy-class accurate, but each region
// sits roughly where it belongs so the glowing cloud reads as a brain. Coordinates:
//   x = left(-) / right(+),  y = down(-) / up(+),  z = back(-) / front(+)
// Mirrored regions get an L and R copy at ±x; 'C' regions sit on the midline;
// 'L' regions (Broca's) exist on the left only.

export type RegionId =
  | 'prefrontal'
  | 'motor'
  | 'somatosensory'
  | 'parietal'
  | 'temporal'
  | 'occipital'
  | 'broca'
  | 'wernicke'
  | 'cingulate'
  | 'hippocampus'
  | 'amygdala'
  | 'thalamus'
  | 'hypothalamus'
  | 'cerebellum'
  | 'basalGanglia'
  | 'accumbens'
  | 'insula'
  | 'brainstem';

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
  { id: 'somatosensory', name: 'Somatosensory cortex', blurb: 'Touch, pressure, proprioception — where your body is.', pos: [0.46, 0.8, -0.12], sides: ['L', 'R'], major: true },
  { id: 'parietal', name: 'Parietal lobe', blurb: 'Space, attention, stitching the senses together.', pos: [0.46, 0.62, -0.5], sides: ['L', 'R'], major: true },
  { id: 'temporal', name: 'Temporal lobe', blurb: 'Hearing, language, faces, memory.', pos: [0.82, -0.3, 0.12], sides: ['L', 'R'], major: true },
  { id: 'occipital', name: 'Occipital lobe', blurb: 'Vision — everything you see.', pos: [0.32, 0.15, -1.05], sides: ['L', 'R'], major: true },
  { id: 'broca', name: "Broca's area", blurb: 'Building speech and language.', pos: [-0.62, 0.0, 0.6], sides: ['L'] },
  { id: 'wernicke', name: "Wernicke's area", blurb: 'Understanding speech and meaning.', pos: [-0.78, 0.08, -0.42], sides: ['L'] },
  { id: 'cingulate', name: 'Cingulate cortex', blurb: 'Motivation, focus, regulating emotion.', pos: [0.0, 0.4, 0.18], sides: ['C'] },
  { id: 'hippocampus', name: 'Hippocampus', blurb: 'Forms memories, maps where you are.', pos: [0.42, -0.26, -0.12], sides: ['L', 'R'] },
  { id: 'amygdala', name: 'Amygdala', blurb: 'Emotion and social salience.', pos: [0.44, -0.32, 0.26], sides: ['L', 'R'] },
  { id: 'thalamus', name: 'Thalamus', blurb: 'Central relay — almost every signal routes through it.', pos: [0.18, 0.02, -0.1], sides: ['L', 'R'] },
  { id: 'hypothalamus', name: 'Hypothalamus', blurb: 'Drives, hunger, sleep, hormones, body clock.', pos: [0.12, -0.22, 0.08], sides: ['L', 'R'] },
  { id: 'cerebellum', name: 'Cerebellum', blurb: 'Balance, timing, learning smooth skills.', pos: [0.0, -0.56, -0.86], sides: ['C'], major: true },
  { id: 'basalGanglia', name: 'Basal ganglia', blurb: 'Habits, reward, motor routines.', pos: [0.28, 0.06, 0.06], sides: ['L', 'R'] },
  { id: 'accumbens', name: 'Nucleus accumbens', blurb: 'Reward, motivation, the wanting circuit.', pos: [0.22, -0.12, 0.3], sides: ['L', 'R'] },
  { id: 'insula', name: 'Insula', blurb: 'Taste, body awareness, gut feeling.', pos: [0.52, -0.06, 0.2], sides: ['L', 'R'] },
  { id: 'brainstem', name: 'Brainstem', blurb: 'Breathing, heartbeat, arousal — keeps you alive and awake.', pos: [0.0, -0.5, -0.32], sides: ['C'] },
];

export const REGION_BY_ID: Record<RegionId, Region> = REGIONS.reduce(
  (acc, r) => ({ ...acc, [r.id]: r }),
  {} as Record<RegionId, Region>
);

// Which brain regions each curiosity-theme trains. Every region is reached by at
// least one theme, so a well-rounded life lights the whole brain.
export const THEME_REGIONS: Record<ThemeId, RegionId[]> = {
  ai: ['prefrontal', 'parietal', 'thalamus', 'cingulate'],
  music: ['temporal', 'cerebellum', 'basalGanglia', 'accumbens'],
  travel: ['hippocampus', 'occipital', 'insula', 'thalamus', 'hypothalamus', 'brainstem'],
  pages: ['broca', 'wernicke', 'temporal', 'occipital'],
  making: ['motor', 'somatosensory', 'parietal', 'cerebellum'],
  wishlist: ['basalGanglia', 'accumbens', 'prefrontal'],
  movement: ['motor', 'somatosensory', 'cerebellum', 'basalGanglia', 'thalamus', 'brainstem', 'hypothalamus'],
  social: ['prefrontal', 'amygdala', 'temporal', 'cingulate', 'wernicke'],
};

export const ALL_REGION_IDS = REGIONS.map((r) => r.id);
