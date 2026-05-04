import { FormEvent, useState } from 'react';
import { addRecommendation } from '../services/recommendations';
import type { Theme } from '../types';

interface Props {
  curiosityId: string;
  palette: Theme;
}

const MAX_BODY = 500;
const MAX_NAME = 40;

export default function RecommendationForm({ curiosityId, palette }: Props) {
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSent, setJustSent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!body.trim()) {
      setError('Type a suggestion first.');
      return;
    }
    setBusy(true);
    try {
      await addRecommendation({
        curiosityId,
        body: body.trim(),
        authorName: name.trim() || undefined,
      });
      setBody('');
      setName('');
      setJustSent(true);
      window.setTimeout(() => setJustSent(false), 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send. Try again.');
    } finally {
      setBusy(false);
    }
  }

  const remaining = MAX_BODY - body.length;
  const canSubmit = body.trim().length > 0 && !busy;

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
          ) : justSent ? (
            <span className="text-emerald-300">Sent ✨ thank you</span>
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
          {busy ? 'Sending…' : 'Recommend'}
        </button>
      </div>
    </form>
  );
}
