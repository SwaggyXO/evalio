import { describe, expect, it } from 'vitest';
import type { Page } from '@evalio/domain';
import {
  attributionMatches,
  bestSupportingPage,
  isSupported,
} from './attribution.js';

const pages: Page[] = [
  {
    id: 'a',
    spaceKey: 'ENG',
    title: 'Billing Runbook',
    body: 'Billing retries are documented for the payments team.',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'b',
    spaceKey: 'ENG',
    title: 'Payments FAQ',
    body: 'Invoice retries happen three times with jitter.',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('attribution', () => {
  it('supports a claim from the page that contains it', () => {
    const claim = 'Invoice retries happen three times with jitter.';
    expect(isSupported(claim, pages[1]!)).toBe(true);
    expect(isSupported(claim, pages[0]!)).toBe(false);
    expect(bestSupportingPage(claim, pages)?.id).toBe('b');
  });

  it('treats mismatched citation as failed attribution', () => {
    expect(attributionMatches('a', 'b')).toBe(false);
    expect(attributionMatches('b', 'b')).toBe(true);
  });
});
