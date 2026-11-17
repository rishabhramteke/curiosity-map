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

export default function RecommendationForm({ curiosityId, curiosityTitle }: Props) {
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
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <label className="sr-only" htmlFor={`rec-name-${curiosityId}`}>Your name (optional)</label>
      <input
        id={`rec-name-${curiosityId}`}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
        maxLength={MAX_NAME}
        autoComplete="nickname"
        className="w-full border-[1.5px] border-rulesoft bg-paper px-3 py-2.5 text-[0.98rem] text-ink placeholder:text-ink2/70 outline-none transition-colors duration-200 focus:border-wine"
      />
      <label className="sr-only" htmlFor={`rec-body-${curiosityId}`}>Your suggestion</label>
      <textarea
        id={`rec-body-${curiosityId}`}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What should I check out?"
        required
        maxLength={MAX_BODY}
        rows={2}
        className="w-full border-[1.5px] border-rulesoft bg-paper px-3 py-2.5 text-[0.98rem] text-ink placeholder:text-ink2/70 outline-none transition-colors duration-200 focus:border-wine resize-none"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.8rem] text-ink2" aria-live="polite">
          {error ? (
            <span className="font-semibold text-winedeep">{error}</span>
          ) : opened ? (
            <span className="font-semibold text-ink">Now press "Submit new issue" on GitHub to publish it.</span>
          ) : (
            <span className="tabular-nums">{remaining} characters left</span>
          )}
        </span>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex shrink-0 items-center justify-center gap-2 border-[1.5px] border-wine bg-wine px-4 py-2.5 text-[0.92rem] font-semibold text-paper transition-colors duration-200 hover:border-winedeep hover:bg-winedeep disabled:cursor-not-allowed disabled:border-rulesoft disabled:bg-transparent disabled:text-ink2"
        >
          Open in GitHub
        </button>
      </div>
      <p className="mb-0 font-serif text-[0.82rem] italic leading-relaxed text-ink2">
        Opens a prefilled GitHub issue in a new tab. Your typed nickname is kept; your GitHub username isn't shown here.
      </p>
    </form>
  );
}
