import { memo } from 'react';
import { THEME_BY_ID } from '../data/themes';
import type { PositionedCuriosity } from '../types';
import { radiusFor } from '../utils/simulation';

interface Props {
  item: PositionedCuriosity;
  highlighted: boolean;
  muted: boolean;
  popping: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
  onDragStart: (event: React.PointerEvent<SVGGElement>) => void;
}

function StarNodeImpl({
  item,
  highlighted,
  muted,
  popping,
  onSelect,
  onHover,
  onLeave,
  onDragStart,
}: Props) {
  const palette = THEME_BY_ID[item.theme];
  const r = radiusFor(item.status);
  const haloR = r + (highlighted ? 14 : 8);
  const haloOpacity = highlighted ? 0.7 : 0.3;

  const visualClass = muted ? 'star-muted' : 'star-active';
  const popClass = popping ? ' star-pop' : '';

  return (
    // Outer <g> handles SVG-attribute positioning. Inner <g> takes events,
    // mute/active opacity, and the CSS pop animation — separating them so
    // CSS scale doesn't fight the SVG translate.
    <g transform={`translate(${item.x} ${item.y})`}>
      <g
        onClick={onSelect}
        onPointerEnter={onHover}
        onPointerLeave={onLeave}
        onPointerDown={onDragStart}
        className={`cursor-pointer ${visualClass}${popClass}`}
        style={{ touchAction: 'none' }}
      >
        {/* halo */}
        <circle r={haloR} fill={palette.glow} opacity={haloOpacity}>
          <animate
            attributeName="opacity"
            values={`${haloOpacity * 0.5};${haloOpacity};${haloOpacity * 0.5}`}
            dur="2.6s"
            repeatCount="indefinite"
          />
        </circle>
        {/* star body */}
        <circle r={r} fill={palette.star} stroke="#ffffff" strokeOpacity={0.6} strokeWidth={0.6} />
        {/* tiny inner sparkle */}
        <circle cx={-r * 0.3} cy={-r * 0.3} r={0.9} fill="#ffffff" opacity={0.85} />
        {/* status ring on done items */}
        {item.status === 'done' && (
          <circle r={r + 3} fill="none" stroke={palette.glow} strokeWidth={1} opacity={0.6} />
        )}
      </g>
    </g>
  );
}

export default memo(StarNodeImpl);
