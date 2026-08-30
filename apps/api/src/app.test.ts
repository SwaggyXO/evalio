import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { frozenClock } from '@evalio/domain';
import { createApp } from './app.js';
import { MemoryMetrics } from './metrics.js';
import { memoryRepo } from './repo.js';

const app = createApp({
  repo: memoryRepo(),
  clock: frozenClock('2026-08-30T00:00:00.000Z'),
  metrics: new MemoryMetrics(),
});

describe('api', () => {
  it('serves health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('lists work items', async () => {
    const res = await request(app).get('/work-items');
    expect(res.status).toBe(200);
    expect(res.body[0].key).toBe('ENG-101');
  });

  it('returns 404 for a missing work item', async () => {
    const res = await request(app).get('/work-items/ENG-999');
    expect(res.status).toBe(404);
  });

  it('builds a brief for ENG-101', async () => {
    const res = await request(app).get('/work-items/ENG-101/brief');
    expect(res.status).toBe(200);
    expect(res.body.workItemKey).toBe('ENG-101');
    expect(res.body.readiness).toBe('agent_ready');
  });

  it('flags a conflict on ENG-102', async () => {
    const res = await request(app).get('/work-items/ENG-102/brief');
    expect(res.status).toBe(200);
    expect(res.body.conflicts.length).toBeGreaterThan(0);
    expect(res.body.readiness).toBe('needs_human');
  });

  it('flags a wrong-source citation on ENG-103', async () => {
    const res = await request(app).get('/work-items/ENG-103/brief');
    expect(res.status).toBe(200);
    expect(
      res.body.claims.some(
        (c: { status: string }) => c.status === 'wrong_source',
      ),
    ).toBe(true);
    expect(res.body.readiness).toBe('needs_human');
  });

  it('searches pages', async () => {
    const res = await request(app).get('/search').query({ q: 'rate limits' });
    expect(res.status).toBe(200);
    expect(res.body.hits[0].pageId).toBe('page-limits');
  });

  it('serves a landing with github and linkedin', async () => {
    const json = await request(app)
      .get('/api')
      .set('Accept', 'application/json');
    expect(json.status).toBe(200);
    expect(json.body.github).toBe('https://github.com/SwaggyXO/evalio');
    expect(json.body.linkedin).toBe(
      'https://linkedin.com/in/devashish-soni-o7',
    );
    expect(json.body.docs).toBe('/docs');
  });

  it('serves swagger ui', async () => {
    const res = await request(app).get('/docs/');
    expect(res.status).toBe(200);
    expect(res.text.toLowerCase()).toContain('swagger');
  });

  it('lists work items under /api', async () => {
    const res = await request(app).get('/api/work-items');
    expect(res.status).toBe(200);
    expect(res.body[0].key).toBe('ENG-101');
  });

  it('rejects writes', async () => {
    const res = await request(app).post('/work-items');
    expect(res.status).toBe(405);
  });
});
