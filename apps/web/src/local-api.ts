import type { Brief, SearchHit, Space } from '@evalio/domain';
import { memoryRepo, systemClock } from '@evalio/domain';
import { buildIndex, searchPages } from '@evalio/search';
import { buildBrief } from '@evalio/verify';

const repo = memoryRepo();
const clock = systemClock;

function missing(entity: string, id: string): Error {
  const error = new Error(`${entity} not found (${id})`);
  (error as Error & { status: number }).status = 404;
  return error;
}

export const localApi = {
  health: async () => ({ ok: true as const }),
  space: async (): Promise<Space> => repo.space(),
  workItems: async () => repo.listWorkItems(),
  workItem: async (key: string) => {
    const item = repo.getWorkItem(key);
    if (!item) throw missing('Work item', key);
    return item;
  },
  brief: async (key: string): Promise<Brief> => {
    const result = buildBrief(repo, key, clock);
    if (!result.ok) throw missing('Work item', key);
    return result.value;
  },
  pages: async () => repo.listPages(),
  page: async (id: string) => {
    const page = repo.getPage(id);
    if (!page) throw missing('Page', id);
    return page;
  },
  search: async (q: string): Promise<{ q: string; hits: SearchHit[] }> => {
    const hits = searchPages(buildIndex(repo.listPages()), q, 8);
    return { q, hits };
  },
};
