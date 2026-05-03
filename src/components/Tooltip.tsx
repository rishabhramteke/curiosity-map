import { THEME_BY_ID } from '../data/themes';
import type { PositionedCuriosity } from '../types';

interface Props {
  item: PositionedCuriosity;
  width: number;
}

const TOOLTIP_W = 220;
const TOOLTIP_H = 56;

export default function Tooltip({ item, width }: Props) {
  const palette = THEME_BY_ID[item.theme];
  // Anchor the tooltip top-right of the star, but flip if it would overflow.
  const flipX = item.x + 14 + TOOLTIP_W > width;
  const x = flipX ? item.x - 14 - TOOLTIP_W : item.x + 14;
  const y = Math.max(8, item.y - 28);

  return (
    <g transform={`translate(${x} ${y})`} className="pointer-events-none animate-fade-in">
      <rect
        width={TOOLTIP_W}
        height={TOOLTIP_H}
        rx={10}
        fill="rgba(15, 23, 42, 0.92)"
        stroke={palette.glow}
        strokeOpacity={0.4}
      />
      <text x={12} y={20} fill="#ffffff" fontSize={11} fontWeight={700}>
        {truncate(item.title, 30)}
      </text>
      <text x={12} y={36} fill={palette.ink} fontSize={9} fontWeight={600}>
        {palette.label} · {item.status}
      </text>
      <text x={12} y={48} fill="#cbd5e1" fontSize={9} opacity={0.85}>
        click to read more
      </text>
    </g>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
