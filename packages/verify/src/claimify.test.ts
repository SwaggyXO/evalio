import { describe, expect, it } from 'vitest';
import { extractClaims, lexicalSupport } from './claimify.js';

describe('extractClaims', () => {
  it('refuses unresolved they', () => {
    const result = extractClaims('They will own webhook retries after launch.');
    expect(result.label).toBe('cannot_disambiguate');
  });

  it('skips opinion sentences', () => {
    const result = extractClaims(
      'It is important that teams should consider retries.',
    );
    expect(result.label).toBe('no_verifiable_claims');
  });

  it('keeps a factual sentence', () => {
    const result = extractClaims(
      'The public API is limited to 100 requests per minute.',
    );
    expect(result.label).toBe('claim');
  });
});

describe('lexicalSupport', () => {
  it('scores overlapping tokens', () => {
    const score = lexicalSupport(
      'public API 100 requests',
      'The public API allows 100 requests per minute',
    );
    expect(score).toBeGreaterThan(0.5);
  });
});
