import type { Brief, Page, SearchHit, Space, WorkItem } from '@evalio/domain';
import { localApi } from './local-api';

const BASE = '/api';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    const error = new Error(body.message ?? res.statusText);
    (error as Error & { status: number }).status = res.status;
    throw error;
  }
  return (await res.json()) as T;
}

const remoteApi = {
  health: () => getJson<{ ok: boolean }>('/health'),
  space: () => getJson<Space>('/space'),
  workItems: () => getJson<WorkItem[]>('/work-items'),
  workItem: (key: string) => getJson<WorkItem>(`/work-items/${key}`),
  brief: (key: string) => getJson<Brief>(`/work-items/${key}/brief`),
  pages: () => getJson<Page[]>('/pages'),
  page: (id: string) => getJson<Page>(`/pages/${id}`),
  search: (q: string) =>
    getJson<{ q: string; hits: SearchHit[] }>(
      `/search?q=${encodeURIComponent(q)}`,
    ),
};

export const api = import.meta.env.PROD ? localApi : remoteApi;
