export interface BudgetArm {
  id: string;
  variance: number;
}

export function allocateChecks(
  arms: BudgetArm[],
  budget: number,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const arm of arms) counts[arm.id] = 1;
  let remaining = Math.max(0, budget - arms.length);
  while (remaining > 0 && arms.length > 0) {
    const next = arms.reduce((best, arm) => {
      const bestScore = (best.variance ?? 0) / (counts[best.id] ?? 1);
      const score = arm.variance / (counts[arm.id] ?? 1);
      return score > bestScore ? arm : best;
    });
    counts[next.id] = (counts[next.id] ?? 0) + 1;
    remaining -= 1;
  }
  return counts;
}

export function seededVariance(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return 0.2 + (hash % 80) / 100;
}
