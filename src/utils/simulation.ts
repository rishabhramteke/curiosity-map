import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
} from 'd3-force';
import type { PositionedCuriosity, ThemeId } from '../types';

export interface ClusterCenter {
  theme: ThemeId;
  x: number;
  y: number;
}

export interface SimLink {
  source: string;
  target: string;
  theme: ThemeId;
}

const STATUS_RADIUS: Record<string, number> = {
  idea: 5,
  doing: 7,
  done: 9,
};

export function radiusFor(status: string): number {
  return STATUS_RADIUS[status] ?? 5;
}

/**
 * Lay out the cluster centroids on a circle around the canvas centre. Same
 * order every render so the user develops spatial memory ("Music is top-right").
 */
export function clusterCenters(
  themes: ThemeId[],
  width: number,
  height: number
): ClusterCenter[] {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.32;
  const slice = (Math.PI * 2) / themes.length;
  return themes.map((theme, i) => ({
    theme,
    // Start at the top and go clockwise — feels more natural.
    x: cx + radius * Math.sin(i * slice),
    y: cy - radius * Math.cos(i * slice),
  }));
}

/**
 * Build the constellation links: connect each item to its cluster's nearest
 * neighbour by simple radial sweep, so we get pretty constellations rather
 * than a star-hub fan.
 */
export function buildLinks(items: PositionedCuriosity[]): SimLink[] {
  const links: SimLink[] = [];
  const byTheme = new Map<ThemeId, PositionedCuriosity[]>();
  for (const item of items) {
    if (!byTheme.has(item.theme)) byTheme.set(item.theme, []);
    byTheme.get(item.theme)!.push(item);
  }
  for (const [theme, group] of byTheme.entries()) {
    if (group.length < 2) continue;
    // Sort by angle around the cluster's centroid.
    const cx = group.reduce((s, p) => s + p.x, 0) / group.length;
    const cy = group.reduce((s, p) => s + p.y, 0) / group.length;
    const sorted = [...group].sort(
      (a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx)
    );
    for (let i = 0; i < sorted.length; i++) {
      const a = sorted[i];
      const b = sorted[(i + 1) % sorted.length];
      links.push({ source: a.id, target: b.id, theme });
    }
  }
  return links;
}

export function createSimulation(
  nodes: PositionedCuriosity[],
  centers: ClusterCenter[]
): Simulation<PositionedCuriosity, undefined> {
  const centerByTheme = new Map(centers.map((c) => [c.theme, c]));

  return forceSimulation(nodes)
    .alpha(0.9)
    .alphaDecay(0.02)
    .force('charge', forceManyBody().strength(-60).distanceMax(220))
    .force('collide', forceCollide<PositionedCuriosity>().radius((d) => radiusFor(d.status) + 6))
    .force(
      'cluster-x',
      forceX<PositionedCuriosity>((d) => centerByTheme.get(d.theme)?.x ?? 0).strength(0.18)
    )
    .force(
      'cluster-y',
      forceY<PositionedCuriosity>((d) => centerByTheme.get(d.theme)?.y ?? 0).strength(0.18)
    );
}

// Optional: link force we apply *after* the cluster has settled, so the
// constellation lines don't fight the layout.
export function applyLinkForce(
  sim: Simulation<PositionedCuriosity, undefined>,
  links: SimLink[]
): void {
  sim
    .force(
      'links',
      forceLink<PositionedCuriosity, SimLink>(links)
        .id((d) => d.id)
        .distance(40)
        .strength(0.06)
    )
    .alpha(0.4)
    .restart();
}
