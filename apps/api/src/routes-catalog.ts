import { Router } from 'express';
import { notFound, type Clock, type ContentRepo } from '@evalio/domain';
import { buildIndex, searchPages } from '@evalio/search';
import { MemoryMetrics } from './metrics.js';
import { requireQuery, sendError } from './http.js';

export function catalogRouter(repo: ContentRepo): Router {
  const router = Router();

  router.get('/space', (_req, res) => {
    res.json(repo.space());
  });

  router.get('/work-items', (_req, res) => {
    res.json(repo.listWorkItems());
  });

  router.get('/work-items/:key', (req, res) => {
    const item = repo.getWorkItem(req.params.key);
    if (!item) {
      sendError(res, notFound('Work item', req.params.key));
      return;
    }
    res.json(item);
  });

  router.get('/pages', (_req, res) => {
    res.json(repo.listPages());
  });

  router.get('/pages/:id', (req, res) => {
    const page = repo.getPage(req.params.id);
    if (!page) {
      sendError(res, notFound('Page', req.params.id));
      return;
    }
    res.json(page);
  });

  router.get('/search', (req, res) => {
    const q = requireQuery(req, 'q');
    const hits = searchPages(buildIndex(repo.listPages()), q, 8);
    res.json({ q, hits });
  });

  return router;
}

export function opsRouter(metrics: MemoryMetrics, clock: Clock): Router {
  const router = Router();
  router.get('/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'evalio-api',
      now: clock.now().toISOString(),
    });
  });
  router.get('/metrics', (_req, res) => {
    res.json(metrics.snapshot());
  });
  return router;
}
