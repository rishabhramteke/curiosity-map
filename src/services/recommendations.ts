// Recommendations are stored as GitHub Issues on the curiosity-map repo,
// labelled 'recommendation'. Visitors submit via a prefilled "new issue"
// deep-link (no token, no infra). The site reads issues anonymously via the
// public REST API and re-fetches when the window regains focus, so a new
// suggestion appears as soon as the visitor returns from github.com.

import type { Recommendation, RecommendationDraft } from '../types/recommendation';

const REPO = 'rishabhramteke/curiosity-map';
const LABEL = 'recommendation';

const ISSUES_API = `https://api.github.com/repos/${REPO}/issues?labels=${LABEL}&state=all&per_page=100&sort=created&direction=desc`;

const CURIOSITY_MARKER = /<!--\s*curiosity:([\w.-]+)\s*-->/i;
const FROM_MARKER = /^\*\*Recommended by:\*\*\s*(.+?)\s*$/m;

export interface RawIssue {
  number: number;
  title: string;
  body: string | null;
  state: string;
  created_at: string;
}

export function buildIssueUrl(
  draft: RecommendationDraft,
  curiosityTitle: string
): string {
  const author = (draft.authorName?.trim() || 'Anonymous').slice(0, 40);
  const body = draft.body.trim().slice(0, 500);
  const title = `Rec for "${truncate(curiosityTitle, 80)}"`;
  const bodyText = [
    `**Recommended by:** ${author}`,
    '',
    body,
    '',
    `<!-- curiosity:${draft.curiosityId} -->`,
  ].join('\n');
  const params = new URLSearchParams({
    title,
    body: bodyText,
    labels: LABEL,
  });
  return `https://github.com/${REPO}/issues/new?${params.toString()}`;
}

export async function fetchAllRecommendations(): Promise<Recommendation[]> {
  const res = await fetch(ISSUES_API, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const issues = (await res.json()) as RawIssue[];
  return issues
    .filter((i) => i.state === 'open') // closed ones are moderated away
    .map(parseIssue)
    .filter((r): r is Recommendation => r !== null);
}

export function listenForRecommendations(
  curiosityId: string,
  onChange: (recs: Recommendation[]) => void
): () => void {
  let cancelled = false;

  const update = async () => {
    try {
      const all = await fetchAllRecommendations();
      if (cancelled) return;
      onChange(all.filter((r) => r.curiosityId === curiosityId));
    } catch {
      // GitHub rate limit (60/hr per IP unauth) or transient — ignore;
      // the next focus event will retry.
    }
  };

  update();

  const onFocus = () => {
    update();
  };
  window.addEventListener('focus', onFocus);

  return () => {
    cancelled = true;
    window.removeEventListener('focus', onFocus);
  };
}

function parseIssue(issue: RawIssue): Recommendation | null {
  if (!issue.body) return null;
  const curiosityMatch = issue.body.match(CURIOSITY_MARKER);
  if (!curiosityMatch) return null;
  const fromMatch = issue.body.match(FROM_MARKER);
  const rawAuthor = fromMatch?.[1]?.trim();
  const authorName =
    rawAuthor && rawAuthor.toLowerCase() !== 'anonymous' ? rawAuthor : undefined;
  const cleanedBody = issue.body
    .replace(CURIOSITY_MARKER, '')
    .replace(FROM_MARKER, '')
    .trim();
  if (!cleanedBody) return null;
  return {
    id: String(issue.number),
    curiosityId: curiosityMatch[1],
    body: cleanedBody,
    authorName,
    createdAt: new Date(issue.created_at),
  };
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
