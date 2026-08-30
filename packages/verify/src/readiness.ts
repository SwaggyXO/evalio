import type {
  Claim,
  Conflict,
  Readiness,
  RubricItem,
  StaleFlag,
} from '@evalio/domain';

export function decideReadiness(input: {
  claims: Claim[];
  conflicts: Conflict[];
  stale: StaleFlag[];
  rubric: RubricItem[];
}): { readiness: Readiness; reasons: string[] } {
  const reasons: string[] = [];
  if (input.claims.some((c) => c.status === 'needs_human')) {
    reasons.push('Unresolved ambiguity');
  }
  if (input.claims.some((c) => c.status === 'wrong_source')) {
    reasons.push('Citation points at the wrong page');
  }
  if (input.claims.some((c) => c.status === 'unsupported')) {
    reasons.push('A claim is not supported by retrieved pages');
  }
  if (input.conflicts.length > 0) {
    reasons.push('Architecture pages disagree');
  }
  if (input.stale.length > 0) {
    reasons.push('A cited page is stale');
  }
  if (input.rubric.some((item) => !item.covered)) {
    reasons.push('Acceptance criteria are not fully covered');
  }
  return {
    readiness: reasons.length === 0 ? 'agent_ready' : 'needs_human',
    reasons,
  };
}
