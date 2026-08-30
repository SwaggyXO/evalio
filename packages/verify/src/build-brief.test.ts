import { describe, expect, it } from 'vitest';
import type { ContentRepo, Page, WorkItem } from '@evalio/domain';
import { frozenClock } from '@evalio/domain';
import { buildBrief } from './build-brief.js';

const pages: Page[] = [
  {
    id: 'page-limits',
    spaceKey: 'ENG',
    title: 'API Rate Limits',
    body: 'The public API is limited to 100 requests per minute per client. Clients that exceed this cap receive HTTP 429.',
    updatedAt: '2026-07-15T00:00:00.000Z',
  },
  {
    id: 'page-guidelines',
    spaceKey: 'ENG',
    title: 'Public API Guidelines',
    body: 'The public API is limited to 100 requests per minute. Burst traffic returns HTTP 429.',
    updatedAt: '2026-07-20T00:00:00.000Z',
  },
];

const item: WorkItem = {
  key: 'ENG-101',
  spaceKey: 'ENG',
  title: 'Cap public API at 100 requests per minute',
  description: 'Limit the public API and return HTTP 429 on burst traffic.',
  status: 'In Progress',
  type: 'Task',
  assignee: 'Priya Shah',
  updatedAt: '2026-07-25T00:00:00.000Z',
  acceptance: [
    'Public API is limited to 100 requests per minute per client',
    'Burst traffic returns HTTP 429',
  ],
};

const repo: ContentRepo = {
  space: () => ({ key: 'ENG', name: 'Engineering' }),
  listWorkItems: () => [item],
  getWorkItem: (key) => (key === item.key ? item : undefined),
  listPages: () => pages,
  getPage: (id) => pages.find((p) => p.id === id),
};

describe('buildBrief', () => {
  it('marks a consistent rate-limit brief agent-ready', () => {
    const result = buildBrief(
      repo,
      'ENG-101',
      frozenClock('2026-08-01T00:00:00.000Z'),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.readiness).toBe('agent_ready');
    expect(result.value.claims.length).toBeGreaterThan(0);
  });

  it('returns not found for an unknown key', () => {
    const result = buildBrief(
      repo,
      'ENG-999',
      frozenClock('2026-08-01T00:00:00.000Z'),
    );
    expect(result.ok).toBe(false);
  });
});
