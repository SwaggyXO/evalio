import type { Page } from '@evalio/domain';
import { overlap, tokenize } from '@evalio/search';
import { splitSentences } from './sentences.js';

export interface DraftSentence {
  originPageId: string;
  originTitle: string;
  text: string;
}

export function extractDrafts(pages: Page[], query: string): DraftSentence[] {
  const queryTerms = tokenize(query);
  const drafts: DraftSentence[] = [];
  for (const page of pages) {
    for (const sentence of splitSentences(page.body)) {
      if (overlap(tokenize(sentence), queryTerms).length < 2) continue;
      drafts.push({
        originPageId: page.id,
        originTitle: page.title,
        text: sentence,
      });
    }
  }
  return drafts;
}
