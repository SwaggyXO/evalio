import type { Page } from '@evalio/domain';
import { lexicalSupport } from './claimify.js';

export const SUPPORT_THRESHOLD = 0.45;

export function isSupported(claim: string, page: Page): boolean {
  return (
    lexicalSupport(claim, `${page.title} ${page.body}`) >= SUPPORT_THRESHOLD
  );
}

export function bestSupportingPage(
  claim: string,
  pages: Page[],
): Page | undefined {
  let best: { page: Page; score: number } | undefined;
  for (const page of pages) {
    const score = lexicalSupport(claim, `${page.title} ${page.body}`);
    if (!best || score > best.score) best = { page, score };
  }
  if (!best || best.score < SUPPORT_THRESHOLD) return undefined;
  return best.page;
}

export function attributionMatches(
  citedPageId: string,
  supportingPageId: string | undefined,
): boolean {
  if (!supportingPageId) return false;
  return citedPageId === supportingPageId;
}
