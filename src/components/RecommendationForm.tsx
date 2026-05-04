import { FormEvent, useState } from 'react';
import { buildIssueUrl } from '../services/recommendations';
import type { Theme } from '../types';

interface Props {
  curiosityId: string;
  curiosityTitle: string;
  palette: Theme;
}

const MAX_BODY = 500;
const MAX_NAME = 40;

export default function RecommendationForm({ curiosityId, curiosityTitle, palette }: Props) {
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!body.trim()) {
      setError('Type a suggestion first.');
      return;
    }
    const url = buildIssueUrl(
      {
        curiosityId,
        body: body.trim(),
        authorName: name.trim() || undefined,
      },
      curiosityTitle
    );
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpened(true);
    window.setTimeout(() => setOpened(false), 6000);
  }

  const remaining = MAX_BODY - body.length;
  const canSubmit = body.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
        maxLength={MAX_NAME}
        autoComplete="nickname"
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-white/25 focus:bg-white/[0.06]"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What should I check out?"
        required
        maxLength={MAX_BODY}
        rows={2}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-white/25 focus:bg-white/[0.06]"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-500">
          {error ? (
            <span className="text-rose-400">{error}</span>
          ) : opened ? (
            <span className="text-emerald-300">
              Tap "Submit new issue" on GitHub to publish ✨
            </span>
          ) : (
            <>{remaining} characters left</>
          )}
        </span>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: palette.glow }}
        >
          Open in GitHub ↗
        </button>
      </div>
      <p className="text-[10px] leading-relaxed text-slate-500">
        Opens a prefilled GitHub issue in a new tab. Your typed nickname is preserved — your GitHub
        username won't be displayed here.
      </p>
    </form>
  );
}
