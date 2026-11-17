import { THEME_BY_ID } from '../data/themes';
import type { PositionedCuriosity } from '../types';
import { STATUS_LABEL } from './Legend';

interface Props {
  item: PositionedCuriosity;
  width: number;
}

const TOOLTIP_W = 232;
const TOOLTIP_H = 62;

export default function Tooltip({ item, width }: Props) {
  const palette = THEME_BY_ID[item.theme];
  // Anchor the tooltip to the right of the star, but flip if it would overflow.
  const flipX = item.x + 16 + TOOLTIP_W > width;
  const x = flipX ? item.x - 16 - TOOLTIP_W : item.x + 16;
  const y = Math.max(8, item.y - 31);

  return (
    <g transform={`translate(${x} ${y})`} className="pointer-events-none animate-fade-in">
      <rect width={TOOLTIP_W} height={TOOLTIP_H} fill="#EDEFEC" stroke="#3A1D24" strokeWidth={1.5} />
      <text x={12} y={22} fill="#231518" fontFamily="Barlow, sans-serif" fontSize={13} fontWeight={600}>
        {truncate(item.title, 30)}
      </text>
      <text x={12} y={38} fill="#8A2A3D" fontFamily="Barlow Condensed, Barlow, sans-serif" fontSize={11} fontWeight={600} letterSpacing="0.12em">
        {palette.label.toUpperCase()} · {STATUS_LABEL[item.status].toUpperCase()}
      </text>
      <text x={12} y={53} fill="#5A4549" fontFamily="Source Serif 4, Georgia, serif" fontStyle="italic" fontSize={11}>
        Click for the details
      </text>
    </g>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
