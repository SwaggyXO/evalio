import express, { type Express } from 'express';
import type { Clock, ContentRepo } from '@evalio/domain';
import { systemClock } from '@evalio/domain';
import { docsRouter } from './docs.js';
import { applyGuard, apiLimiter } from './guard.js';
import { MemoryMetrics } from './metrics.js';
import { memoryRepo } from './repo.js';
import { briefRouter } from './routes-brief.js';
import { catalogRouter, opsRouter } from './routes-catalog.js';
import { serveWeb } from './web.js';

export interface AppDeps {
  repo?: ContentRepo;
  clock?: Clock;
  metrics?: MemoryMetrics;
  webDist?: string;
}

export function createApp(deps: AppDeps = {}): Express {
  const repo = deps.repo ?? memoryRepo();
  const clock = deps.clock ?? systemClock;
  const metrics = deps.metrics ?? new MemoryMetrics();
  const webDist = deps.webDist ?? process.env.WEB_DIST;
  const app = express();
  applyGuard(app);
  if (process.env.NODE_ENV !== 'test') {
    app.use('/api', ...apiLimiter());
  }
  mountApi(app, '/api', repo, clock, metrics);
  if (!webDist) mountApi(app, '', repo, clock, metrics);
  app.get('/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'evalio-api',
      now: clock.now().toISOString(),
    });
  });
  app.use('/docs', docsRouter());
  if (webDist) serveWeb(app, webDist);
  return app;
}

function mountApi(
  app: Express,
  prefix: string,
  repo: ContentRepo,
  clock: Clock,
  metrics: MemoryMetrics,
): void {
  const routers = [
    opsRouter(metrics, clock),
    catalogRouter(repo),
    briefRouter(repo, clock, metrics),
  ];
  if (prefix) {
    app.use(prefix, ...routers);
    return;
  }
  for (const router of routers) app.use(router);
}
