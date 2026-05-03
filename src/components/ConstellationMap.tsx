import { useEffect, useMemo, useRef, useState } from 'react';
import { THEMES, THEME_BY_ID } from '../data/themes';
import type { Curiosity, PositionedCuriosity } from '../types';
import {
  applyLinkForce,
  buildLinks,
  clusterCenters,
  createSimulation,
  type SimLink,
} from '../utils/simulation';
import StarNode from './StarNode';
import Tooltip from './Tooltip';

interface Props {
  items: Curiosity[];
  width: number;
  height: number;
  onSelect: (item: Curiosity) => void;
  selectedId: string | null;
}

interface BackgroundStar {
  x: number;
  y: number;
  r: number;
  delay: number;
}

export default function ConstellationMap({ items, width, height, onSelect, selectedId }: Props) {
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
    };
    // re-run only on canvas resize
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  // Drag-to-pin handler.
  function handleDragStart(id: string) {
    return (event: React.PointerEvent<SVGGElement>) => {
      event.stopPropagation();
      const svg = (event.currentTarget.ownerSVGElement as SVGSVGElement) ?? null;
      if (!svg) return;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const inverse = ctm.inverse();

      const node = positionsRef.current.find((n) => n.id === id);
      if (!node) return;
      node.fx = node.x;
      node.fy = node.y;

      const move = (e: PointerEvent) => {
        const point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const p = point.matrixTransform(inverse);
        node.fx = p.x;
        node.fy = p.y;
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        // release the pin so the simulation reclaims it
        node.fx = null;
        node.fy = null;
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up, { once: true });
    };
  }

  const positionById = useMemo(
    () => new Map(positions.map((p) => [p.id, p])),
    [positions]
  );

  // Cluster centroids derived from current positions, used to anchor labels.
  const clusterLabels = useMemo(() => {
    const byTheme = new Map<string, { sumX: number; sumY: number; n: number }>();
    for (const p of positions) {
      const cur = byTheme.get(p.theme) ?? { sumX: 0, sumY: 0, n: 0 };
      cur.sumX += p.x;
      cur.sumY += p.y;
      cur.n += 1;
      byTheme.set(p.theme, cur);
    }
    return THEMES.map((t) => {
      const agg = byTheme.get(t.id);
      if (!agg) return null;
      return {
        theme: t,
        x: agg.sumX / agg.n,
        // place label below the cluster
        y: agg.sumY / agg.n + 60,
      };
    }).filter(Boolean) as { theme: typeof THEMES[number]; x: number; y: number }[];
  }, [positions]);

  const hovered = hoveredId ? positionById.get(hoveredId) : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full h-full"
      style={{
        background:
          'radial-gradient(ellipse at 30% 25%, #1c2454 0%, #0b1028 55%, #060919 100%)',
      }}
    >
      {/* background twinkling dots */}
      <g fill="#cbd5e1">
        {bgStars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r}>
            <animate
              attributeName="opacity"
              values="0.2;1;0.2"
              dur={`${2.4 + (i % 3) * 0.6}s`}
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>

      {/* constellation lines */}
      <g>
        {links.map((link, i) => {
          const a = positionById.get(link.source);
          const b = positionById.get(link.target);
          if (!a || !b) return null;
          const palette = THEME_BY_ID[link.theme];
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={palette.line}
              strokeWidth={0.9}
            />
          );
        })}
      </g>

      {/* cluster labels */}
      <g>
        {clusterLabels.map((label) => (
          <text
            key={label.theme.id}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            fontFamily="Quicksand, Inter, sans-serif"
            fontSize={11}
            fontWeight={700}
            fill={label.theme.ink}
            opacity={0.85}
            className="pointer-events-none"
          >
            {label.theme.label}
          </text>
        ))}
      </g>

      {/* stars */}
      {positions.map((item) => (
        <StarNode
          key={item.id}
          item={item}
          highlighted={selectedId === item.id || hoveredId === item.id}
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
