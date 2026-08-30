import { describe, expect, it } from 'vitest';
import type { Page } from '@evalio/domain';
import { buildIndex } from './index-store.js';
import { searchPages } from './score.js';
import { tokenize } from './tokenize.js';

const pages: Page[] = [
  {
    id: 'limits',
    spaceKey: 'ENG',
    title: 'API Rate Limits',
    body: 'The public API is limited to 100 requests per minute per client.',
    updatedAt: '2026-07-01T00:00:00.000Z',
  },
  {
    id: 'auth',
    spaceKey: 'ENG',
    title: 'Auth Architecture',
    body: 'New services must authenticate with OIDC.',
    updatedAt: '2026-07-01T00:00:00.000Z',
  },
];

describe('tokenize', () => {
  it('drops stopwords and punctuation', () => {
    expect(tokenize('The public API is limited')).toEqual([
      'public',
      'api',
      'limited',
    ]);
  });
});

describe('searchPages', () => {
  it('ranks the rate-limit page for a matching query', () => {
    const hits = searchPages(buildIndex(pages), 'public API rate limits');
    expect(hits[0]?.pageId).toBe('limits');
    expect(hits[0]?.reasons.some((r) => r.terms.includes('api'))).toBe(true);
  });

  it('returns nothing for empty queries', () => {
    expect(searchPages(buildIndex(pages), 'the and or')).toEqual([]);
  });
});
