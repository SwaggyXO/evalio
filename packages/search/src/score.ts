import type { MatchReason, SearchHit } from '@evalio/domain';
import type { InvertedIndex } from './index-store.js';
import { tokenize, unique } from './tokenize.js';

const K1 = 1.2;
const B = 0.75;
const AVG_LEN = 80;

export function searchPages(
  index: InvertedIndex,
  query: string,
  limit = 8,
): SearchHit[] {
  const terms = unique(tokenize(query));
  if (terms.length === 0 || index.docCount === 0) return [];

  const scores = new Map<string, number>();
  const reasons = new Map<string, MatchReason[]>();

  for (const term of terms) {
    const list = index.postings.get(term);
    if (!list) continue;
    const df = index.df.get(term) ?? 1;
    const idf = Math.log(1 + (index.docCount - df + 0.5) / (df + 0.5));
    for (const posting of list) {
      const fieldBoost = posting.field === 'title' ? 2.2 : 1;
      const tfNorm =
        (posting.tf * (K1 + 1)) /
        (posting.tf + K1 * (1 - B + B * (AVG_LEN / AVG_LEN)));
      scores.set(
        posting.pageId,
        (scores.get(posting.pageId) ?? 0) + idf * tfNorm * fieldBoost,
      );
      pushReason(reasons, posting.pageId, posting.field, term);
    }
  }

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([pageId, score]) => toHit(index, pageId, score, reasons, terms));
}

function pushReason(
  reasons: Map<string, MatchReason[]>,
  pageId: string,
  field: 'title' | 'body',
  term: string,
): void {
  const list = reasons.get(pageId) ?? [];
  const existing = list.find((r) => r.field === field);
  if (existing) {
    if (!existing.terms.includes(term)) existing.terms.push(term);
  } else {
    list.push({ field, terms: [term] });
  }
  reasons.set(pageId, list);
}

function toHit(
  index: InvertedIndex,
  pageId: string,
  score: number,
  reasons: Map<string, MatchReason[]>,
  terms: string[],
): SearchHit {
  const page = index.pages.get(pageId);
  const snippet = snippetAround(page?.body ?? '', terms);
  return {
    pageId,
    title: page?.title ?? pageId,
    score,
    reasons: reasons.get(pageId) ?? [],
    snippet,
  };
}

function snippetAround(body: string, terms: string[]): string {
  const lower = body.toLowerCase();
  let idx = 0;
  for (const term of terms) {
    const found = lower.indexOf(term);
    if (found >= 0) {
      idx = found;
      break;
    }
  }
  const start = Math.max(0, idx - 40);
  const slice = body.slice(start, start + 140).trim();
  return slice.length < body.length ? `${slice}â€¦` : slice;
}
