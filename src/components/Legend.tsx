import { THEMES } from '../data/themes';
import type { Status, ThemeId } from '../types';

interface Props {
  visibleThemes: Set<ThemeId>;
  onToggleTheme: (id: ThemeId) => void;
  totalsByStatus: Record<Status, number>;
}

export default function Legend({ visibleThemes, onToggleTheme, totalsByStatus }: Props) {
  return (
    <div className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-950/75 p-3 text-xs text-slate-300 backdrop-blur-md shadow-2xl">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        Constellations
      </p>
      <ul className="flex flex-col gap-1.5">
        {THEMES.map((t) => {
          const on = visibleThemes.has(t.id);
          return (
            <li key={t.id}>
              <button
                onClick={() => onToggleTheme(t.id)}
                className="group flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left transition hover:bg-white/5"
                aria-pressed={on}
              >
                <span
                  className="grid h-3 w-3 place-items-center rounded-full"
                  style={{ backgroundColor: on ? t.glow : 'rgba(255,255,255,0.1)' }}
                />
                <span
                  className="font-semibold"
                  style={{ color: on ? t.ink : '#64748b' }}
                >
                  {t.label}
                </span>
                <span className="ml-auto text-[10px] text-slate-500">{t.blurb}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 border-t border-white/10 pt-2 text-[10px] text-slate-400">
        ✨ {totalsByStatus.idea} ideas · ⏳ {totalsByStatus.doing} doing · ✓ {totalsByStatus.done} done
      </div>
      <p className="mt-2 text-[10px] text-slate-500">
        Drag a star to nudge it. Click for details.
      </p>
    </div>
  );
}
