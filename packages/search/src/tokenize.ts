const STOP = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'to',
  'of',
  'in',
  'on',
  'for',
  'is',
  'are',
  'with',
  'that',
  'this',
  'at',
  'by',
  'from',
  'as',
  'be',
  'it',
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function unique(tokens: string[]): string[] {
  return [...new Set(tokens)];
}

export function overlap(a: string[], b: string[]): string[] {
  const set = new Set(b);
  return unique(a.filter((t) => set.has(t)));
}
