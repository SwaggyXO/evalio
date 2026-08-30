import type { Page } from '@evalio/domain';
import { tokenize } from './tokenize.js';

export interface Posting {
  pageId: string;
  field: 'title' | 'body';
  tf: number;
}

export interface InvertedIndex {
  df: Map<string, number>;
  postings: Map<string, Posting[]>;
  docCount: number;
  pages: Map<string, Page>;
}

export function buildIndex(pages: Page[]): InvertedIndex {
  const df = new Map<string, number>();
  const postings = new Map<string, Posting[]>();
  const pageMap = new Map<string, Page>();

  for (const page of pages) {
    pageMap.set(page.id, page);
    addField(postings, df, page, 'title', page.title);
    addField(postings, df, page, 'body', page.body);
  }

  return { df, postings, docCount: pages.length, pages: pageMap };
}

function addField(
  postings: Map<string, Posting[]>,
  df: Map<string, number>,
  page: Page,
  field: 'title' | 'body',
  text: string,
): void {
  const counts = new Map<string, number>();
  for (const token of tokenize(text)) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  for (const [term, tf] of counts) {
    df.set(term, (df.get(term) ?? 0) + 1);
    const list = postings.get(term) ?? [];
    list.push({ pageId: page.id, field, tf });
    postings.set(term, list);
  }
}
