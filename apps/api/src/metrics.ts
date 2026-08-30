import type { MetricsSink } from '@evalio/domain';

export class MemoryMetrics implements MetricsSink {
  readonly counters = new Map<string, number>();
  readonly timings = new Map<string, number[]>();

  increment(name: string, by = 1): void {
    this.counters.set(name, (this.counters.get(name) ?? 0) + by);
  }

  observeMs(name: string, ms: number): void {
    const list = this.timings.get(name) ?? [];
    list.push(ms);
    this.timings.set(name, list);
  }

  snapshot(): {
    counters: Record<string, number>;
    p95: Record<string, number>;
  } {
    const counters: Record<string, number> = {};
    for (const [key, value] of this.counters) counters[key] = value;
    const p95: Record<string, number> = {};
    for (const [key, values] of this.timings) {
      p95[key] = percentile(values, 0.95);
    }
    return { counters, p95 };
  }
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1);
  return sorted[idx] ?? 0;
}
