import { THEME_BY_ID } from '../data/themes';
import type { Curiosity } from '../types';

interface Props {
  item: Curiosity;
  onClose: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  idea: '✨ Idea',
  doing: '⏳ In progress',
  done: '✓ Done',
};

export default function DetailPanel({ item, onClose }: Props) {
  const palette = THEME_BY_ID[item.theme];
  return (
    <aside className="pointer-events-auto fixed inset-y-0 right-0 z-20 flex w-full max-w-sm flex-col gap-4 border-l border-white/10 bg-slate-950/85 p-6 shadow-2xl backdrop-blur-md animate-slide-in sm:w-96">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: palette.ink }}
          >
            {palette.label}
          </span>
          <h3 className="mt-2 font-display text-2xl font-bold text-white">{item.title}</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="-m-1 grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          ✕
        </button>
      </header>

      <p className="text-sm font-semibold" style={{ color: palette.ink }}>
        {STATUS_LABEL[item.status] ?? item.status}
      </p>

      <p className="text-base leading-relaxed text-slate-200">{item.description}</p>

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
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Open link ↗
        </a>
      )}

      <div className="mt-auto pt-4 text-xs text-slate-500">
        Edit <code className="rounded bg-white/5 px-1">src/data/items.ts</code> to change this card.
      </div>
    </aside>
  );
}
