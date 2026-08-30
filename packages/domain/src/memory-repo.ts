import type { Page, WorkItem } from './catalog.js';
import type { ContentRepo } from './ports.js';
import { PAGES } from './seed-pages.js';
import { WORK_ITEMS } from './seed-work-items.js';

export function memoryRepo(
  pages: Page[] = PAGES,
  items: WorkItem[] = WORK_ITEMS,
): ContentRepo {
  return {
    space: () => ({ key: 'ENG', name: 'Engineering' }),
    listWorkItems: () => items,
    getWorkItem: (key) => items.find((item) => item.key === key),
    listPages: () => pages,
    getPage: (id) => pages.find((page) => page.id === id),
  };
}
