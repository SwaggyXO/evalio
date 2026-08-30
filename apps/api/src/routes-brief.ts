import { Router } from 'express';
import type { Clock, ContentRepo } from '@evalio/domain';
import { buildBrief } from '@evalio/verify';
import { sendError } from './http.js';
import { MemoryMetrics } from './metrics.js';

export function briefRouter(
  repo: ContentRepo,
  clock: Clock,
  metrics: MemoryMetrics,
): Router {
  const router = Router();
  router.get('/work-items/:key/brief', (req, res) => {
    const started = Date.now();
    const result = buildBrief(repo, req.params.key, clock);
    metrics.observeMs('brief_ms', Date.now() - started);
    metrics.increment('briefs_total');
    if (!result.ok) {
      sendError(res, result.error);
      return;
    }
    if (result.value.readiness !== 'agent_ready') {
      metrics.increment('briefs_not_ready');
    }
    if (result.value.conflicts.length > 0) {
      metrics.increment('conflicts_total', result.value.conflicts.length);
    }
    res.json(result.value);
  });
  return router;
}
