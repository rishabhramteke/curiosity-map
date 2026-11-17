import { THEMES } from '../data/themes';
import type { Status, ThemeId } from '../types';
import { STATUS_ORDER } from '../types';
import { StatusSymbol } from './StarNode';
import { radiusFor } from '../utils/simulation';

interface Props {
  mutedThemes: Set<ThemeId>;
  onToggleTheme: (id: ThemeId) => void;
  totalsByStatus: Record<Status, number>;
}

export const STATUS_LABEL: Record<Status, string> = { todo: 'To do', doing: 'Doing', review: 'Review', done: 'Done' };

/* The title block of Sheet 4: the constellations (tap to dim) and the key to the star symbols. */
export default function Legend({ mutedThemes, onToggleTheme, totalsByStatus }: Props) {
  return (
    <div className="pointer-events-auto w-full border-[1.5px] border-rule bg-paper/95 p-4 md:w-[20.5rem]">
      <p className="m-0 font-display text-[1.2rem] font-semibold leading-tight text-winedeep">Sheet 4 · Curiosity</p>
      <ul className="mt-3 flex list-none flex-col gap-0.5 p-0">
        {THEMES.map((t) => {
          const active = !mutedThemes.has(t.id);
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onToggleTheme(t.id)}
                aria-pressed={active}
                className="group flex w-full items-baseline gap-2.5 px-1 py-1.5 text-left transition-colors duration-200 hover:bg-winedeep/[0.06]"
              >
                <span
                  aria-hidden="true"
                  className={`relative top-[1px] h-2.5 w-2.5 shrink-0 border-[1.5px] border-winedeep transition-colors duration-200 ${active ? 'bg-winedeep' : 'bg-transparent'}`}
                />
                <span className={`text-[0.95rem] font-semibold transition-colors duration-200 ${active ? 'text-ink' : 'text-ink2/60 line-through decoration-1'}`}>
                  {t.label}
                  <span aria-label={t.zodiacName} title={t.zodiacName} className="ml-1.5 font-normal text-wine" style={{ fontFamily: '"Apple Symbols", "Segoe UI Symbol", "DejaVu Sans", sans-serif' }}>{t.zodiac + '\uFE0E'}</span>
                </span>
                <span className="ml-auto text-right font-serif text-[0.82rem] italic text-ink2">{t.blurb}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-rulesoft pt-3">
        {STATUS_ORDER.map((s) => (
          <div key={s} className="flex items-center gap-2">
            <dt className="flex items-center gap-2 text-[0.88rem] text-ink">
              <svg viewBox="-12 -12 24 24" width="18" height="18" aria-hidden="true">
                <StatusSymbol status={s} r={Math.min(7, radiusFor(s) * 0.78)} ink="#5B1426" />
              </svg>
              {STATUS_LABEL[s]}
            </dt>
            <dd className="m-0 ml-auto font-display text-[0.95rem] font-semibold tabular-nums text-winedeep">{totalsByStatus[s]}</dd>
          </div>
        ))}
      </dl>
      <p className="mb-0 mt-3 font-serif text-[0.85rem] italic leading-snug text-ink2">
        Tap a constellation to dim it. Drag a star to nudge it.
      </p>
    </div>
  );
}
