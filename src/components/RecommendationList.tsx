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
      <p className="m-0 border border-dashed border-rulesoft px-3 py-6 text-center font-serif italic text-ink2">
        Be the first to recommend something.
      </p>
    );
  }

  return (
    <ul className="m-0 list-none p-0">
      {recs.map((r) => {
        const author = r.authorName?.trim() || 'Anonymous';
        const isAnon = author === 'Anonymous';
        return (
          <li key={r.id} className="animate-fade-in border-b border-rulesoft py-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className={`text-[0.9rem] font-semibold ${isAnon ? 'italic text-ink2' : 'text-winedeep'}`} style={isAnon ? undefined : { color: palette.ink }}>
                {author}
              </span>
              <span className="font-display text-[0.8rem] font-semibold tabular-nums text-ink2">{formatRelativeTime(r.createdAt)}</span>
            </div>
            <p className="mb-0 mt-1.5 whitespace-pre-wrap break-words font-serif text-[1rem] leading-relaxed text-ink">{r.body}</p>
          </li>
        );
      })}
    </ul>
  );
}
