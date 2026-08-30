import type {
  Brief,
  Claim,
  ClaimStatus,
  Clock,
  Conflict,
  ContentRepo,
  Page,
  WorkItem,
} from '@evalio/domain';
import { err, notFound, ok, type Result } from '@evalio/domain';
import { buildIndex, searchPages } from '@evalio/search';
import { bestSupportingPage, isSupported } from './attribution.js';
import { allocateChecks, seededVariance } from './budget.js';
import { extractClaims } from './claimify.js';
import { chooseCitedPage, policyForWorkItem } from './citation-policy.js';
import { findConflicts } from './conflicts.js';
import { extractDrafts } from './extract-drafts.js';
import { decideReadiness } from './readiness.js';
import { scoreRubric } from './rubric.js';
import { findStale } from './stale.js';
import { brokenStageFor, buildTrail } from './trail.js';

export function buildBrief(
  repo: ContentRepo,
  workItemKey: string,
  clock: Clock,
): Result<Brief> {
  const workItem = repo.getWorkItem(workItemKey);
  if (!workItem) return err(notFound('Work item', workItemKey));

  const index = buildIndex(repo.listPages());
  const query = `${workItem.title} ${workItem.description}`;
  const hits = searchPages(index, query, 6);
  const hitPages = hits
    .map((hit) => repo.getPage(hit.pageId))
    .filter((page): page is Page => Boolean(page));

  const drafts = extractDrafts(hitPages, query);
  const topHit = hits[0]?.pageId;
  const policy = policyForWorkItem(workItem.key);
  const allPages = repo.listPages();
  const claims = drafts.map((draft, i) =>
    toClaim(draft, i, topHit, policy, allPages),
  );
  const checks = allocateChecks(
    claims.map((c) => ({ id: c.id, variance: seededVariance(c.id) })),
    Math.max(claims.length, 8),
  );
  for (const claim of claims) {
    claim.checksUsed = checks[claim.id] ?? 1;
  }

  return ok(finalize(workItem, claims, hitPages, clock));
}

function finalize(
  workItem: WorkItem,
  claims: Claim[],
  hitPages: Page[],
  clock: Clock,
): Brief {
  const conflicts = findConflicts(hitPages);
  const stale = findStale(hitPages, workItem, clock);
  const rubric = scoreRubric(workItem, claims);
  const marked = applyConflictAndStale(claims, conflicts, stale);
  const { readiness, reasons } = decideReadiness({
    claims: marked,
    conflicts,
    stale,
    rubric,
  });
  return {
    workItemKey: workItem.key,
    title: `${workItem.key} / Brief`,
    claims: marked,
    rubric,
    conflicts,
    stale,
    readiness,
    notReadyReasons: reasons,
  };
}

function toClaim(
  draft: {
    originPageId: string;
    originTitle: string;
    text: string;
  },
  index: number,
  topHit: string | undefined,
  policy: ReturnType<typeof policyForWorkItem>,
  pages: Page[],
): Claim {
  const citedPageId = chooseCitedPage(draft.originPageId, topHit, policy);
  const extracted = extractClaims(draft.text);
  const cited = pages.find((p) => p.id === citedPageId);
  const supporting = bestSupportingPage(draft.text, pages);
  const status = statusOf(extracted.label, draft.text, cited, supporting);
  const claim: Claim = {
    id: `c-${index + 1}`,
    text: draft.text,
    citedPageId,
    status,
    trail: buildTrail({
      pageTitle: draft.originTitle,
      pageId: draft.originPageId,
      excerpt: draft.text,
      citedPageId,
    }),
    checksUsed: 1,
  };
  const supportingId = supporting?.id;
  const broken = brokenStageFor(status);
  if (supportingId) claim.supportingPageId = supportingId;
  if (broken) claim.brokenStage = broken;
  return claim;
}

function statusOf(
  label: 'claim' | 'no_verifiable_claims' | 'cannot_disambiguate',
  text: string,
  cited: Page | undefined,
  supporting: Page | undefined,
): ClaimStatus {
  if (label === 'cannot_disambiguate' || label === 'no_verifiable_claims') {
    return 'needs_human';
  }
  if (cited && isSupported(text, cited)) return 'executable';
  if (supporting) return 'wrong_source';
  return 'unsupported';
}

function applyConflictAndStale(
  claims: Claim[],
  conflicts: Conflict[],
  stale: { pageId: string }[],
): Claim[] {
  const conflictPages = new Set(conflicts.flatMap((c) => c.pageIds));
  const stalePages = new Set(stale.map((s) => s.pageId));
  return claims.map((claim) => {
    if (claim.status !== 'executable') return claim;
    if (conflictPages.has(claim.citedPageId)) {
      return { ...claim, status: 'conflict' };
    }
    if (stalePages.has(claim.citedPageId)) {
      return { ...claim, status: 'stale' };
    }
    return claim;
  });
}
