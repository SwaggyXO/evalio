import { overlap, tokenize } from '@evalio/search';

const OPINION =
  /\b(should consider|it is important|highlighting the need|crucial)\b/i;
const PRONOUN = /\b(they|them|their|those)\b/i;
const PROPER = /[A-Z][a-z]{2,}/;

export type ExtractLabel =
  'claim' | 'no_verifiable_claims' | 'cannot_disambiguate';

export interface Extracted {
  text: string;
  label: ExtractLabel;
}

export function extractClaims(sentence: string): Extracted {
  if (OPINION.test(sentence)) {
    return { text: sentence, label: 'no_verifiable_claims' };
  }
  if (PRONOUN.test(sentence) && !canResolve(sentence)) {
    return { text: sentence, label: 'cannot_disambiguate' };
  }
  return { text: sentence.trim(), label: 'claim' };
}

function canResolve(sentence: string): boolean {
  const withoutPronoun = sentence.replace(PRONOUN, '');
  return PROPER.test(withoutPronoun) && tokenize(sentence).length > 4;
}

export function lexicalSupport(claim: string, pageBody: string): number {
  const claimTerms = tokenize(claim);
  if (claimTerms.length === 0) return 0;
  const hits = overlap(claimTerms, tokenize(pageBody));
  return hits.length / claimTerms.length;
}
