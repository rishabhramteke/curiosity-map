import { useEffect, useState } from 'react';
import { THEME_BY_ID } from '../data/themes';
import type { Curiosity, Status } from '../types';
import { STATUS_ORDER } from '../types';
import type { Recommendation } from '../types/recommendation';
import { listenForRecommendations } from '../services/recommendations';
import { setOverride } from '../services/status';
import RecommendationList from './RecommendationList';
import RecommendationForm from './RecommendationForm';

interface Props {
  item: Curiosity;
  onClose: () => void;
}

const STATUS_BUTTON_LABEL: Record<Status, string> = {
  todo: 'TODO',
  doing: 'Doing',
  review: 'Review',
  done: 'Done',
};

export default function DetailPanel({ item, onClose }: Props) {
  const palette = THEME_BY_ID[item.theme];
  const [recs, setRecs] = useState<Recommendation[]>([]);

  useEffect(() => {
    setRecs([]);
    const unsubscribe = listenForRecommendations(item.id, setRecs);
    return unsubscribe;
  }, [item.id]);

  function handleStatusChange(next: Status) {
    if (item.status === next) return;
    setOverride(item.id, next);
  }

  return (
    <aside
      className="pointer-events-auto fixed inset-y-0 right-0 z-20 flex w-full max-w-sm flex-col border-l border-white/10 bg-slate-950/85 shadow-2xl backdrop-blur-md animate-slide-in sm:w-[28rem]"
    >
      {/* Header / curiosity content */}
      <div className="flex flex-col gap-3 p-6 pb-4">
        <header className="flex items-start justify-between gap-3">
          <div>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: palette.ink }}
            >
              {palette.label}
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold leading-snug text-white">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-m-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </header>

        {/* Status switcher */}
        <div>
          <div
            role="radiogroup"
            aria-label="Status"
            className="grid grid-cols-4 gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1"
          >
            {STATUS_ORDER.map((s) => {
              const active = item.status === s;
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => handleStatusChange(s)}
                  className="rounded-full px-2 py-1.5 text-[11px] font-semibold transition"
                  style={
                    active
                      ? {
                          backgroundColor: palette.glow,
                          color: '#0b1028',
                        }
                      : {
                          color: '#94a3b8',
                          backgroundColor: 'transparent',
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  {STATUS_BUTTON_LABEL[s]}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[10px] text-slate-500">
            Saved on this device only · edit <code className="rounded bg-white/5 px-1">items.ts</code> to publish.
          </p>
        </div>

        <p className="text-sm leading-relaxed text-slate-200">{item.description}</p>

        {item.note && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm italic text-slate-300">
            {item.note}
          </p>
        )}

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
          >
            Open link ↗
          </a>
        )}
      </div>

      {/* Recommendations heading */}
      <div className="flex items-baseline justify-between border-t border-white/10 px-6 pt-4 pb-2">
        <h4 className="font-display text-base font-bold text-white">
          Recommend me ✨
        </h4>
        {recs.length > 0 && (
          <span className="text-[11px] text-slate-400">
            {recs.length} {recs.length === 1 ? 'suggestion' : 'suggestions'}
          </span>
        )}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-6 pb-3">
        <RecommendationList recs={recs} palette={palette} />
      </div>

      {/* Form pinned to the bottom */}
      <div className="border-t border-white/10 bg-slate-950/60 p-4">
        <RecommendationForm
          curiosityId={item.id}
          curiosityTitle={item.title}
          palette={palette}
        />
      </div>
    </aside>
  );
}
