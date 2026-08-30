export type CitationPolicy = 'origin' | 'top-hit';

export function chooseCitedPage(
  originPageId: string,
  topHitPageId: string | undefined,
  policy: CitationPolicy,
): string {
  if (policy === 'top-hit' && topHitPageId) return topHitPageId;
  return originPageId;
}

export function policyForWorkItem(workItemKey: string): CitationPolicy {
  return workItemKey === 'ENG-103' ? 'top-hit' : 'origin';
}
