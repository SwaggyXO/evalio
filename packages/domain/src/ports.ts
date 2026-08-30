import type { Page, WorkItem } from './catalog.js';

export interface ContentRepo {
  space(): SpaceRecord;
  listWorkItems(): WorkItem[];
  getWorkItem(key: string): WorkItem | undefined;
  listPages(): Page[];
  getPage(id: string): Page | undefined;
}

export interface SpaceRecord {
  key: string;
  name: string;
}

export interface MetricsSink {
  increment(name: string, by?: number): void;
  observeMs(name: string, ms: number): void;
}
