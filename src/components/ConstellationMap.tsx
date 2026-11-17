import { useEffect, useMemo, useRef, useState } from 'react';
import type { Simulation } from 'd3-force';
import { THEMES, THEME_BY_ID } from '../data/themes';
import type { Curiosity, PositionedCuriosity } from '../types';
import {
  applyLinkForce,
  buildLinks,
  clusterCenters,
  createSimulation,
  radiusFor,
  type SimLink,
} from '../utils/simulation';
import StarNode from './StarNode';
import Tooltip from './Tooltip';

import type { ThemeId } from '../types';

interface Props {
  items: Curiosity[];
  width: number;
  height: number;
  onSelect: (item: Curiosity) => void;
  selectedId: string | null;
  mutedThemes: Set<ThemeId>;
  poppingTheme: ThemeId | null;
}

interface BackgroundStar {
  x: number;
  y: number;
  r: number;
  delay: number;
}

export default function ConstellationMap({
  items,
  width,
  height,
  onSelect,
  selectedId,
  mutedThemes,
  poppingTheme,
}: Props) {
  // Stable initial positions, scattered around their cluster centres so the
  // simulation has somewhere to start (avoids the chaotic "everyone at 0,0"
  // first frame).
  const initialItems = useMemo<PositionedCuriosity[]>(() => {
    const centers = clusterCenters(THEMES.map((t) => t.id), width, height);
    const byTheme = new Map(centers.map((c) => [c.theme, c]));
    return items.map((it) => {
      const c = byTheme.get(it.theme) ?? { x: width / 2, y: height / 2 };
      return {
        ...it,
        x: c.x + (Math.random() - 0.5) * 80,
        y: c.y + (Math.random() - 0.5) * 80,
      };
    });
    // we deliberately compute once on mount; recomputing would re-randomise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const [positions, setPositions] = useState<PositionedCuriosity[]>(initialItems);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [links, setLinks] = useState<SimLink[]>([]);
  const positionsRef = useRef(positions);
  positionsRef.current = positions;
  const simRef = useRef<Simulation<PositionedCuriosity, undefined> | null>(null);

  // Anchor positions for the zodiac glyphs — fixed per canvas size, so the
  // background symbols don't jitter as the force simulation settles.
  const zodiacAnchors = useMemo(
    () => clusterCenters(THEMES.map((t) => t.id), width, height),
    [width, height]
  );

  // Background twinkle dots — generated once.
  const bgStars = useMemo<BackgroundStar[]>(() => {
    const out: BackgroundStar[] = [];
    const seed = 42;
    let s = seed;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let i = 0; i < 80; i++) {
      out.push({
        x: rand() * width,
        y: rand() * height,
        r: 0.4 + rand() * 0.9,
        delay: rand() * 3,
      });
    }
    return out;
    // background only depends on canvas dimensions
  }, [width, height]);

  // Set up the simulation. We tick into React state so the SVG re-renders.
  useEffect(() => {
    const centers = clusterCenters(THEMES.map((t) => t.id), width, height);
    const sim = createSimulation(positionsRef.current, centers);
    simRef.current = sim;

    sim.on('tick', () => {
      setPositions([...positionsRef.current]);
    });

    // After a brief warm-up, add link forces so constellation lines can settle.
    const linkTimer = window.setTimeout(() => {
      const computedLinks = buildLinks(positionsRef.current);
      setLinks(computedLinks);
      applyLinkForce(sim, computedLinks);
    }, 600);

    return () => {
      window.clearTimeout(linkTimer);
      sim.stop();
      simRef.current = null;
    };
    // re-run only on canvas resize
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  // Drag-to-pin handler. Reheat the simulation on dragstart so ticks resume,
  // mutate fx/fy on pointermove, and let it cool down on pointerup. This is
  // the standard d3-drag pattern adapted to React pointer events.
  function handleDragStart(id: string) {
    return (event: React.PointerEvent<SVGGElement>) => {
      event.stopPropagation();
      event.preventDefault();
      const svg = (event.currentTarget.ownerSVGElement as SVGSVGElement) ?? null;
      if (!svg) return;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const inverse = ctm.inverse();

      const node = positionsRef.current.find((n) => n.id === id);
      if (!node) return;

      let moved = false;
      const startClientX = event.clientX;
      const startClientY = event.clientY;

      // Reheat: kicks the simulation back into ticking even if it had cooled
      // to alpha < alphaMin (otherwise dragging mutates fx/fy invisibly).
      simRef.current?.alphaTarget(0.3).restart();
      node.fx = node.x;
      node.fy = node.y;

      const toSvgPoint = (clientX: number, clientY: number) => {
        const p = svg.createSVGPoint();
        p.x = clientX;
        p.y = clientY;
        return p.matrixTransform(inverse);
      };

      const move = (e: PointerEvent) => {
        if (!moved) {
          const dx = e.clientX - startClientX;
          const dy = e.clientY - startClientY;
          if (dx * dx + dy * dy > 9) moved = true; // 3px deadzone before treating as drag
        }
        const p = toSvgPoint(e.clientX, e.clientY);
        node.fx = Math.max(8, Math.min(width - 8, p.x));
        node.fy = Math.max(8, Math.min(height - 8, p.y));
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        // Cool the simulation back down and release the pin.
        simRef.current?.alphaTarget(0);
        node.fx = null;
        node.fy = null;
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up, { once: true });
      window.addEventListener('pointercancel', up, { once: true });
    };
  }

  const positionById = useMemo(
    () => new Map(positions.map((p) => [p.id, p])),
    [positions]
  );

  // Cluster centroids derived from current positions, used to anchor labels.
  const clusterLabels = useMemo(() => {
    const byTheme = new Map<string, { sumX: number; sumY: number; n: number; maxY: number }>();
    for (const p of positions) {
      const cur = byTheme.get(p.theme) ?? { sumX: 0, sumY: 0, n: 0, maxY: -Infinity };
      cur.sumX += p.x;
      cur.sumY += p.y;
      cur.n += 1;
      cur.maxY = Math.max(cur.maxY, p.y + radiusFor(p.status));
      byTheme.set(p.theme, cur);
    }
    return THEMES.map((t) => {
      const agg = byTheme.get(t.id);
      if (!agg) return null;
      return {
        theme: t,
        x: agg.sumX / agg.n,
        // name the constellation just below its lowest star
        y: Math.min(height - 10, agg.maxY + 20),
      };
    }).filter(Boolean) as { theme: typeof THEMES[number]; x: number; y: number }[];
  }, [positions, height]);

  const hovered = hoveredId ? positionById.get(hoveredId) : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full h-full"
      role="img"
      aria-label="Star chart of curiosities: each star is one, grouped into constellations by theme"
    >
      {/* graticule, as on a printed star chart */}
      <g stroke="#8A2A3D" strokeWidth={1} opacity={0.1} aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`gx${i}`} x1={((i + 1) * width) / 8} y1={0} x2={((i + 1) * width) / 8} y2={height} />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`gy${i}`} x1={0} y1={((i + 1) * height) / 6} x2={width} y2={((i + 1) * height) / 6} />
        ))}
      </g>
      <g fontFamily="Barlow Condensed, Barlow, sans-serif" fontSize={11} fontWeight={600} fill="#5A4549" letterSpacing="0.1em" aria-hidden="true">
        {'ABCDEFGH'.split('').map((c, i) => (
          <text key={c} x={((i + 0.5) * width) / 8} y={16} textAnchor="middle">{c}</text>
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <text key={`r${i}`} x={8} y={((i + 0.5) * height) / 6} dominantBaseline="central">{i + 1}</text>
        ))}
      </g>

      {/* faint catalogue stars */}
      <g fill="#5A4549" opacity={0.32} aria-hidden="true">
        {bgStars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.8} />
        ))}
      </g>

      {/* zodiac glyphs sitting behind each cluster, faded */}
      <g>
        {zodiacAnchors.map((anchor) => {
          const theme = THEME_BY_ID[anchor.theme];
          const muted = mutedThemes.has(anchor.theme);
          return (
            <text
              key={`zodiac-${anchor.theme}`}
              x={anchor.x}
              y={anchor.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Apple Symbols, Segoe UI Symbol, DejaVu Sans, system-ui, sans-serif"
              fontSize={104}
              fill={theme.ink}
              opacity={muted ? 0.03 : 0.08}
              aria-hidden="true"
              className="pointer-events-none"
              style={{ transition: 'opacity 0.4s ease' }}
            >
              {theme.zodiac + '\uFE0E'}
            </text>
          );
        })}
      </g>

      {/* constellation lines */}
      <g>
        {links.map((link, i) => {
          const a = positionById.get(link.source);
          const b = positionById.get(link.target);
          if (!a || !b) return null;
          const palette = THEME_BY_ID[link.theme];
          const muted = mutedThemes.has(link.theme);
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={palette.line}
              strokeWidth={0.9}
              opacity={muted ? 0.18 : 1}
              style={{ transition: 'opacity 0.4s ease' }}
            />
          );
        })}
      </g>

      {/* cluster labels */}
      <g>
        {clusterLabels.map((label) => {
          const muted = mutedThemes.has(label.theme.id);
          return (
            <text
              key={label.theme.id}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              fontFamily="Barlow Condensed, Barlow, sans-serif"
              fontSize={13}
              fontWeight={600}
              letterSpacing="0.2em"
              fill={label.theme.ink}
              opacity={muted ? 0.3 : 1}
              className="pointer-events-none halo"
              style={{ transition: 'opacity 0.4s ease' }}
            >
              {label.theme.label.toUpperCase()}
            </text>
          );
        })}
      </g>

      {/* stars */}
      {positions.map((item) => (
        <StarNode
          key={item.id}
          item={item}
          highlighted={selectedId === item.id || hoveredId === item.id}
          muted={mutedThemes.has(item.theme)}
          popping={poppingTheme === item.theme}
          onSelect={() => onSelect(item)}
          onHover={() => setHoveredId(item.id)}
          onLeave={() => setHoveredId((h) => (h === item.id ? null : h))}
          onDragStart={handleDragStart(item.id)}
        />
      ))}

      {/* tooltip */}
      {hovered && <Tooltip item={hovered} width={width} />}
    </svg>
  );
}
