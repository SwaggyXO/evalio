import type { Conflict, Page } from '@evalio/domain';
import { tokenize } from '@evalio/search';

interface Topic {
  key: string;
  values: string[];
}

const TOPICS: Topic[] = [
  { key: 'auth-protocol', values: ['oidc', 'saml'] },
  { key: 'rate-limit', values: ['100', '1000'] },
  { key: 'retry-count', values: ['three', 'seven'] },
];

export function findConflicts(pages: Page[]): Conflict[] {
  const found: Conflict[] = [];
  for (const topic of TOPICS) {
    const hits: { pageId: string; value: string }[] = [];
    for (const page of pages) {
      const tokens = new Set(tokenize(`${page.title} ${page.body}`));
      for (const value of topic.values) {
        if (tokens.has(value)) hits.push({ pageId: page.id, value });
      }
    }
    const unique = uniqueByValue(hits);
    if (unique.length >= 2 && unique[0] && unique[1]) {
      found.push({
        topic: topic.key,
        pageIds: [unique[0].pageId, unique[1].pageId],
        left: unique[0].value,
        right: unique[1].value,
      });
    }
  }
  return found;
}

function uniqueByValue(
  hits: { pageId: string; value: string }[],
): { pageId: string; value: string }[] {
  const map = new Map<string, string>();
  for (const hit of hits) map.set(hit.value, hit.pageId);
  return [...map.entries()].map(([value, pageId]) => ({ pageId, value }));
}
