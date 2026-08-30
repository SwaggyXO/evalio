import type { Claim, RubricItem, WorkItem } from '@evalio/domain';
import { overlap, tokenize } from '@evalio/search';

export function scoreRubric(
  workItem: WorkItem,
  claims: Pick<Claim, 'text'>[],
): RubricItem[] {
  return workItem.acceptance.map((text) => ({
    text,
    covered: claims.some(
      (claim) => overlap(tokenize(text), tokenize(claim.text)).length >= 2,
    ),
  }));
}
