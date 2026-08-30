export { AppError, err, notFound, ok, unavailable } from './result.js';
export type { AppErrorCode, Result } from './result.js';
export { frozenClock, systemClock } from './clock.js';
export type { Clock } from './clock.js';
export type {
  MatchReason,
  Page,
  SearchHit,
  Space,
  WorkItem,
  WorkItemStatus,
  WorkItemType,
} from './catalog.js';
export type {
  Brief,
  Claim,
  ClaimStatus,
  Conflict,
  Readiness,
  RubricItem,
  StaleFlag,
  TrailNode,
  TrailStage,
} from './brief.js';
export type { ContentRepo, MetricsSink, SpaceRecord } from './ports.js';
export { PAGES } from './seed-pages.js';
export { WORK_ITEMS } from './seed-work-items.js';
export { memoryRepo } from './memory-repo.js';
