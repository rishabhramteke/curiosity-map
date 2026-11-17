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
  todo: 'To do',
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
      aria-label={item.title}
      className="pointer-events-auto fixed inset-y-0 right-0 z-30 flex w-full max-w-full flex-col border-l-[1.5px] border-rule bg-paper shadow-[-8px_0_28px_-18px_rgba(35,21,24,0.45)] animate-slide-in sm:w-[28rem]"
    >
      {/* Header / curiosity content */}
      <div className="flex flex-col gap-4 overflow-y-auto p-6 pb-5">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h3 className="m-0 text-[1.9rem] leading-[1.05]">{item.title}</h3>
            <p className="mb-0 mt-2 font-display text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-wine">
              {palette.label} <span aria-hidden="true" className="tracking-normal" style={{ fontFamily: '"Apple Symbols", "Segoe UI Symbol", "DejaVu Sans", sans-serif' }}>{palette.zodiac + '\uFE0E'}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-m-1 grid h-10 w-10 shrink-0 place-items-center text-winedeep transition-colors duration-200 hover:bg-winedeep hover:text-paper"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square">
              <path d="M3 3 L13 13 M13 3 L3 13" />
            </svg>
          </button>
        </header>

        {/* Status switcher */}
        <div>
          <div role="radiogroup" aria-label="Status" className="grid grid-cols-4 border-[1.5px] border-winedeep">
            {STATUS_ORDER.map((s, i) => {
              const active = item.status === s;
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => handleStatusChange(s)}
                  className={`px-2 py-2 text-[0.88rem] font-semibold transition-colors duration-200 ${i > 0 ? 'border-l border-winedeep/40' : ''} ${
                    active ? 'bg-winedeep text-paper' : 'text-winedeep hover:bg-winedeep/10'
                  }`}
                >
                  {STATUS_BUTTON_LABEL[s]}
                </button>
              );
            })}
          </div>
          <p className="mb-0 mt-2 font-serif text-[0.85rem] italic text-ink2">
            Your status changes are saved on this device only.
          </p>
        </div>

        <p className="m-0 font-serif text-[1.06rem] leading-relaxed text-ink">{item.description}</p>

        {item.note && (
          <p className="m-0 bg-paper2 px-4 py-3 font-serif text-[1rem] italic leading-relaxed text-ink2">{item.note}</p>
        )}

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 border-[1.5px] border-winedeep px-4 py-2.5 text-[0.95rem] font-semibold text-winedeep no-underline transition-colors duration-200 hover:bg-winedeep hover:text-paper"
          >
            Open link
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square">
              <path d="M5 11 L11 5 M6 5 H11 V10" />
            </svg>
          </a>
        )}
      </div>

      {/* Recommendations heading */}
      <div className="flex items-baseline justify-between border-t-[1.5px] border-rule px-6 pb-2 pt-4">
        <h4 className="m-0 text-[1.3rem]">Recommend me something</h4>
        {recs.length > 0 && (
          <span className="font-display text-[0.9rem] font-semibold tabular-nums text-wine">
            {recs.length} {recs.length === 1 ? 'suggestion' : 'suggestions'}
          </span>
        )}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-6 pb-3">
        <RecommendationList recs={recs} palette={palette} />
      </div>

      {/* Form pinned to the bottom */}
      <div className="border-t border-rulesoft bg-paper2/60 p-5">
        <RecommendationForm curiosityId={item.id} curiosityTitle={item.title} palette={palette} />
      </div>
    </aside>
  );
}
