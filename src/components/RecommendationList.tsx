import type { Theme } from '../types';
import type { Recommendation } from '../types/recommendation';
import { formatRelativeTime } from '../utils/relativeTime';

interface Props {
  recs: Recommendation[];
  palette: Theme;
}

export default function RecommendationList({ recs, palette }: Props) {
  if (recs.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/10 px-3 py-6 text-center text-sm italic text-slate-400">
        Be the first to recommend something ✨
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {recs.map((r) => {
        const author = r.authorName?.trim() || 'Anonymous';
        const isAnon = author === 'Anonymous';
        return (
          <li
            key={r.id}
            className="rounded-2xl border border-white/5 bg-white/[0.04] p-3 animate-fade-in"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span
                className={`text-xs font-semibold ${isAnon ? 'italic' : ''}`}
                style={{ color: isAnon ? '#94a3b8' : palette.ink }}
              >
                {author}
              </span>
              <span className="text-[10px] text-slate-500">
                {formatRelativeTime(r.createdAt)}
              </span>
            </div>
            <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-100">
              {r.body}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
