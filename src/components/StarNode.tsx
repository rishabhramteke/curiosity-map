import { memo } from 'react';
import { THEME_BY_ID } from '../data/themes';
import type { PositionedCuriosity, Status } from '../types';
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

const PAPER = '#EDEFEC';

/* Star-atlas symbols, one per status, drawn in a single ink:
   to do = open ring, doing = ring with a centre dot, review = solid with an outer ring, done = solid. */
export function StatusSymbol({ status, r, ink }: { status: Status; r: number; ink: string }) {
  switch (status) {
    case 'todo':
      return <circle r={r} fill={PAPER} stroke={ink} strokeWidth={1.4} />;
    case 'doing':
      return (
        <g>
          <circle r={r} fill={PAPER} stroke={ink} strokeWidth={1.4} />
          <circle r={Math.max(1.4, r * 0.42)} fill={ink} />
        </g>
      );
    case 'review':
      return (
        <g>
          <circle r={r + 2.6} fill="none" stroke={ink} strokeWidth={1} />
          <circle r={r * 0.8} fill={ink} />
        </g>
      );
    default:
      return <circle r={r} fill={ink} />;
  }
}

function StarNodeImpl({ item, highlighted, muted, popping, onSelect, onHover, onLeave, onDragStart }: Props) {
  const palette = THEME_BY_ID[item.theme];
  const r = radiusFor(item.status);
  const visualClass = muted ? 'star-muted' : 'star-active';
  const popClass = popping ? ' star-pop' : '';

  return (
    // Outer <g> handles SVG-attribute positioning. Inner <g> takes events,
    // mute/active opacity, and the CSS pop animation, so CSS scale doesn't fight the SVG translate.
    <g transform={`translate(${item.x} ${item.y})`}>
      <g
        onClick={onSelect}
        onPointerEnter={onHover}
        onPointerLeave={onLeave}
        onPointerDown={onDragStart}
        className={`cursor-pointer ${visualClass}${popClass}`}
        style={{ touchAction: 'none' }}
      >
        {/* generous hit area for small stars and fingers */}
        <circle r={r + 9} fill="transparent" />
        {highlighted && <circle r={r + 7} fill="none" stroke={palette.glow} strokeWidth={1.2} strokeDasharray="2 2.5" />}
        <StatusSymbol status={item.status} r={r} ink={highlighted ? palette.glow : palette.star} />
      </g>
    </g>
  );
}

export default memo(StarNodeImpl);
