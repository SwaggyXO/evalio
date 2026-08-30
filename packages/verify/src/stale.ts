import type { Clock, Page, StaleFlag, WorkItem } from '@evalio/domain';

export function findStale(
  pages: Page[],
  workItem: WorkItem,
  clock: Clock,
): StaleFlag[] {
  const workUpdated = Date.parse(workItem.updatedAt);
  const now = clock.now().getTime();
  return pages
    .filter((page) => {
      const pageTime = Date.parse(page.updatedAt);
      return pageTime < workUpdated && pageTime < now;
    })
    .filter((page) => workUpdated - Date.parse(page.updatedAt) > dayMs(90))
    .map((page) => ({
      pageId: page.id,
      pageUpdatedAt: page.updatedAt,
      comparedTo: workItem.updatedAt,
    }));
}

function dayMs(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}
