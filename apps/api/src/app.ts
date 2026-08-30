import cors from 'cors';
import express, { type Express } from 'express';
import type { Clock, ContentRepo } from '@evalio/domain';
import { systemClock } from '@evalio/domain';
import { MemoryMetrics } from './metrics.js';
import { memoryRepo } from './repo.js';
import { briefRouter } from './routes-brief.js';
import { catalogRouter, opsRouter } from './routes-catalog.js';

export interface AppDeps {
  repo?: ContentRepo;
  clock?: Clock;
  metrics?: MemoryMetrics;
}

export function createApp(deps: AppDeps = {}): Express {
  const repo = deps.repo ?? memoryRepo();
  const clock = deps.clock ?? systemClock;
  const metrics = deps.metrics ?? new MemoryMetrics();
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(opsRouter(metrics, clock));
  app.use(catalogRouter(repo));
  app.use(briefRouter(repo, clock, metrics));
  return app;
}
