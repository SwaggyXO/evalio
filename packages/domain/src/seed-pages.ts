import type { Page } from './catalog.js';

export const PAGES: Page[] = [
  {
    id: 'page-limits',
    spaceKey: 'ENG',
    title: 'API Rate Limits',
    body: 'The public API is limited to 100 requests per minute per client. Clients that exceed this cap receive HTTP 429.',
    updatedAt: '2026-07-15T00:00:00.000Z',
  },
  {
    id: 'page-guidelines',
    spaceKey: 'ENG',
    title: 'Public API Guidelines',
    body: 'The public API is limited to 100 requests per minute. Burst traffic returns HTTP 429.',
    updatedAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'page-auth-v1',
    spaceKey: 'ENG',
    title: 'Auth Architecture v1',
    body: 'Authenticate every new service with SAML only. SAML remains the corporate standard.',
    updatedAt: '2025-11-01T00:00:00.000Z',
  },
  {
    id: 'page-auth-v2',
    spaceKey: 'ENG',
    title: 'Auth Architecture v2',
    body: 'Authenticate every new service with OIDC only. OIDC replaces SAML for new work.',
    updatedAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'page-billing',
    spaceKey: 'ENG',
    title: 'Billing Runbook',
    body: 'Billing retries are documented for the payments team. Escalate billing retries to finance.',
    updatedAt: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'page-payments',
    spaceKey: 'ENG',
    title: 'Payments FAQ',
    body: 'Invoice retries happen three times with jitter. Do not use seven retries for invoices.',
    updatedAt: '2026-06-12T00:00:00.000Z',
  },
  {
    id: 'page-session',
    spaceKey: 'ENG',
    title: 'Session Policy 2024',
    body: 'Refresh session cookies every 12 hours. Session cookies stay on the monolith host.',
    updatedAt: '2024-01-12T00:00:00.000Z',
  },
  {
    id: 'page-webhooks',
    spaceKey: 'ENG',
    title: 'Webhook design',
    body: 'Webhook delivery is at-least-once. They will own webhook retries after launch.',
    updatedAt: '2026-05-01T00:00:00.000Z',
  },
];
