import { describe, expect, it } from 'vitest';
import { allocateChecks } from './budget.js';
import { chooseCitedPage } from './citation-policy.js';
import { findConflicts } from './conflicts.js';
import { decideReadiness } from './readiness.js';

describe('allocateChecks', () => {
  it('spends extra budget on the high-variance arm', () => {
    const counts = allocateChecks(
      [
        { id: 'easy', variance: 0.1 },
        { id: 'hard', variance: 4 },
      ],
      6,
    );
    expect(counts.hard).toBeGreaterThan(counts.easy ?? 0);
    expect((counts.easy ?? 0) + (counts.hard ?? 0)).toBe(6);
  });
});

describe('chooseCitedPage', () => {
  it('uses the top hit under the naive policy', () => {
    expect(chooseCitedPage('origin', 'top', 'top-hit')).toBe('top');
    expect(chooseCitedPage('origin', 'top', 'origin')).toBe('origin');
  });
});

describe('findConflicts', () => {
  it('flags oidc vs saml', () => {
    const conflicts = findConflicts([
      {
        id: 'v1',
        spaceKey: 'ENG',
        title: 'Auth v1',
        body: 'Authenticate with SAML only.',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'v2',
        spaceKey: 'ENG',
        title: 'Auth v2',
        body: 'Authenticate with OIDC only.',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]);
    expect(conflicts[0]?.topic).toBe('auth-protocol');
  });
});

describe('decideReadiness', () => {
  it('is ready only with a clean brief', () => {
    const ready = decideReadiness({
      claims: [
        {
          id: 'c-1',
          text: 'ok',
          citedPageId: 'p',
          status: 'executable',
          trail: [],
          checksUsed: 1,
        },
      ],
      conflicts: [],
      stale: [],
      rubric: [{ text: 'ok', covered: true }],
    });
    expect(ready.readiness).toBe('agent_ready');
  });
});
