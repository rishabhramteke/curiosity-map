import { REGIONS, type RegionId, type Side } from '../data/brain';

// Deterministic so the brain looks identical on every load / device.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Vec3 = [number, number, number];

export interface HubNode {
  key: string; // regionId + side
  regionId: RegionId;
  side: Side;
  pos: Vec3;
}

export interface Tract {
  a: RegionId;
  b: RegionId;
  samples: Float32Array; // S points, flat [x,y,z, x,y,z, ...]
  kind: 'assoc' | 'callosal';
}

const SAMPLES = 26;

function gauss(rng: () => number, sd: number) {
  // Box–Muller, good enough for jitter.
  const u = Math.max(1e-6, rng());
  const v = rng();
  return sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function randDir(rng: () => number): Vec3 {
  const z = rng() * 2 - 1;
  const t = rng() * Math.PI * 2;
  const r = Math.sqrt(Math.max(0, 1 - z * z));
  return [r * Math.cos(t), r * Math.sin(t), z];
}

// Per-region neuron clusters. The brain is built as the union of these lumpy
// blobs (lobes overlap into a cerebrum; cerebellum + brainstem hang off the
// back-bottom) so the silhouette reads as a brain and each part is its own mass.
interface Cluster {
  r: [number, number, number]; // ellipsoid radii
  count: number; // neurons per side
  shell: number; // 0 = solid, →1 = hollow shell (surface wrinkles)
  noise: number; // surface jitter
}

const CLUSTERS: Record<RegionId, Cluster> = {
  prefrontal: { r: [0.4, 0.46, 0.46], count: 300, shell: 0.55, noise: 0.05 },
  motor: { r: [0.34, 0.2, 0.24], count: 130, shell: 0.5, noise: 0.045 },
  somatosensory: { r: [0.32, 0.2, 0.22], count: 120, shell: 0.5, noise: 0.045 },
  parietal: { r: [0.36, 0.4, 0.42], count: 230, shell: 0.55, noise: 0.05 },
  temporal: { r: [0.3, 0.3, 0.6], count: 260, shell: 0.55, noise: 0.05 },
  occipital: { r: [0.34, 0.34, 0.32], count: 190, shell: 0.55, noise: 0.05 },
  broca: { r: [0.16, 0.16, 0.16], count: 50, shell: 0.4, noise: 0.04 },
  wernicke: { r: [0.16, 0.16, 0.18], count: 50, shell: 0.4, noise: 0.04 },
  cingulate: { r: [0.12, 0.18, 0.42], count: 120, shell: 0.35, noise: 0.035 },
  hippocampus: { r: [0.16, 0.12, 0.34], count: 70, shell: 0.3, noise: 0.03 },
  amygdala: { r: [0.14, 0.14, 0.14], count: 45, shell: 0.3, noise: 0.03 },
  thalamus: { r: [0.16, 0.16, 0.2], count: 75, shell: 0.3, noise: 0.03 },
  hypothalamus: { r: [0.1, 0.1, 0.12], count: 35, shell: 0.25, noise: 0.025 },
  cerebellum: { r: [0.62, 0.34, 0.42], count: 430, shell: 0.4, noise: 0.028 },
  basalGanglia: { r: [0.18, 0.2, 0.22], count: 80, shell: 0.3, noise: 0.03 },
  accumbens: { r: [0.12, 0.12, 0.14], count: 40, shell: 0.25, noise: 0.03 },
  insula: { r: [0.16, 0.18, 0.2], count: 60, shell: 0.3, noise: 0.03 },
  // brainstem is drawn as a bespoke tapering stalk below, not an ellipsoid blob
  brainstem: { r: [0.16, 0.45, 0.18], count: 0, shell: 0.3, noise: 0.025 },
};

// A brain made of glowing "neurons", clustered by region, plus a brainstem stalk.
export function buildCloud(seed = 7): Float32Array {
  const rng = mulberry32(seed);
  const pts: number[] = [];

  const blob = (cx: number, cy: number, cz: number, c: Cluster) => {
    for (let i = 0; i < c.count; i++) {
      const [dx, dy, dz] = randDir(rng);
      const t = c.shell + (1 - c.shell) * rng();
      pts.push(
        cx + dx * c.r[0] * t + gauss(rng, c.noise),
        cy + dy * c.r[1] * t + gauss(rng, c.noise),
        cz + dz * c.r[2] * t + gauss(rng, c.noise)
      );
    }
  };

  for (const region of REGIONS) {
    const c = CLUSTERS[region.id];
    for (const side of region.sides) {
      const sign = side === 'L' ? -1 : 1;
      const cx = side === 'C' ? region.pos[0] : sign * Math.abs(region.pos[0]);
      blob(cx, region.pos[1], region.pos[2], c);
    }
  }

  // brainstem: a tapering stalk descending from the centre base
  for (let i = 0; i < 130; i++) {
    const f = rng();
    const yy = 0.0 - f * 1.05;
    const rad = 0.16 * (1 - f * 0.5);
    const ang = rng() * Math.PI * 2;
    const rr = rad * Math.sqrt(rng());
    pts.push(
      rr * Math.cos(ang) + gauss(rng, 0.02),
      yy + gauss(rng, 0.02),
      -0.18 - f * 0.25 + rr * Math.sin(ang) + gauss(rng, 0.02)
    );
  }

  return new Float32Array(pts);
}

export function buildHubs(): HubNode[] {
  const hubs: HubNode[] = [];
  for (const r of REGIONS) {
    for (const side of r.sides) {
      const sign = side === 'L' ? -1 : side === 'R' ? 1 : 1;
      const x = side === 'C' ? r.pos[0] : sign * Math.abs(r.pos[0]);
      hubs.push({ key: `${r.id}-${side}`, regionId: r.id, side, pos: [x, r.pos[1], r.pos[2]] });
    }
  }
  return hubs;
}

function dist(a: Vec3, b: Vec3) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function bezier(a: Vec3, c: Vec3, b: Vec3, s: number): Vec3 {
  const u = 1 - s;
  return [
    u * u * a[0] + 2 * u * s * c[0] + s * s * b[0],
    u * u * a[1] + 2 * u * s * c[1] + s * s * b[1],
    u * u * a[2] + 2 * u * s * c[2] + s * s * b[2],
  ];
}

function sampleArc(a: Vec3, b: Vec3, bow: Vec3): Float32Array {
  const mid: Vec3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  const c: Vec3 = [mid[0] + bow[0], mid[1] + bow[1], mid[2] + bow[2]];
  const arr = new Float32Array(SAMPLES * 3);
  for (let i = 0; i < SAMPLES; i++) {
    const p = bezier(a, c, b, i / (SAMPLES - 1));
    arr[i * 3] = p[0];
    arr[i * 3 + 1] = p[1];
    arr[i * 3 + 2] = p[2];
  }
  return arr;
}

// White-matter tracts: short association fibers within each hemisphere, plus
// callosal fibers arcing across the midline between mirrored regions.
export function buildTracts(hubs: HubNode[]): Tract[] {
  const tracts: Tract[] = [];
  const seen = new Set<string>();

  // association fibers: each hub to its 3 nearest hubs on the same side
  const bySide = (s: Side) => hubs.filter((h) => h.side === s || (s !== 'C' && h.side === 'C'));
  for (const side of ['L', 'R'] as Side[]) {
    const group = bySide(side);
    for (const h of group) {
      const nearest = group
        .filter((g) => g.key !== h.key)
        .map((g) => ({ g, d: dist(h.pos, g.pos) }))
        .sort((p, q) => p.d - q.d)
        .slice(0, 3);
      for (const { g } of nearest) {
        const id = [h.key, g.key].sort().join('|');
        if (seen.has(id)) continue;
        seen.add(id);
        // bow the fiber outward from the brain centre
        const mid: Vec3 = [(h.pos[0] + g.pos[0]) / 2, (h.pos[1] + g.pos[1]) / 2, (h.pos[2] + g.pos[2]) / 2];
        const len = Math.hypot(mid[0], mid[1], mid[2]) || 1;
        const k = 0.18;
        const bow: Vec3 = [(mid[0] / len) * k, (mid[1] / len) * k + 0.04, (mid[2] / len) * k];
        tracts.push({ a: h.regionId, b: g.regionId, kind: 'assoc', samples: sampleArc(h.pos, g.pos, bow) });
      }
    }
  }

  // callosal fibers: connect L and R copies of the same region over the top
  const left = new Map(hubs.filter((h) => h.side === 'L').map((h) => [h.regionId, h]));
  const right = new Map(hubs.filter((h) => h.side === 'R').map((h) => [h.regionId, h]));
  for (const [regionId, l] of left) {
    const r = right.get(regionId);
    if (!r) continue;
    const topY = Math.max(l.pos[1], r.pos[1]) + 0.55;
    const bow: Vec3 = [0, topY - (l.pos[1] + r.pos[1]) / 2, 0];
    tracts.push({ a: regionId, b: regionId, kind: 'callosal', samples: sampleArc(l.pos, r.pos, bow) });
  }

  return tracts;
}

// Flatten a set of tracts into gl LINES segment pairs for one draw call.
export function tractsToSegments(tracts: Tract[]): Float32Array {
  let count = 0;
  for (const t of tracts) count += (t.samples.length / 3 - 1) * 2;
  const out = new Float32Array(count * 3);
  let o = 0;
  for (const t of tracts) {
    const pts = t.samples;
    const segs = pts.length / 3 - 1;
    for (let i = 0; i < segs; i++) {
      out[o++] = pts[i * 3];
      out[o++] = pts[i * 3 + 1];
      out[o++] = pts[i * 3 + 2];
      out[o++] = pts[(i + 1) * 3];
      out[o++] = pts[(i + 1) * 3 + 1];
      out[o++] = pts[(i + 1) * 3 + 2];
    }
  }
  return out;
}
