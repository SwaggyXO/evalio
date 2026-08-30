import type { WorkItem } from './catalog.js';

export const WORK_ITEMS: WorkItem[] = [
  {
    key: 'ENG-101',
    spaceKey: 'ENG',
    title: 'Cap public API at 100 requests per minute',
    description:
      'Limit the public API to 100 requests per minute per client and return HTTP 429 on burst traffic.',
    status: 'In Progress',
    type: 'Task',
    assignee: 'Priya Shah',
    updatedAt: '2026-07-25T00:00:00.000Z',
    acceptance: [
      'Public API is limited to 100 requests per minute per client',
      'Burst traffic returns HTTP 429',
    ],
  },
  {
    key: 'ENG-102',
    spaceKey: 'ENG',
    title: 'Migrate auth to OIDC',
    description:
      'Authenticate new services with OIDC. Confirm whether SAML is still required.',
    status: 'To Do',
    type: 'Story',
    assignee: 'Marcus Chen',
    updatedAt: '2026-07-02T00:00:00.000Z',
    acceptance: [
      'New services authenticate with OIDC',
      'SAML is not required for new services',
    ],
  },
  {
    key: 'ENG-103',
    spaceKey: 'ENG',
    title: 'Update billing retry policy',
    description:
      'Invoice retries happen three times with jitter according to payments.',
    status: 'In Progress',
    type: 'Task',
    assignee: 'Amelia Rao',
    updatedAt: '2026-07-18T00:00:00.000Z',
    acceptance: ['Invoice retries happen three times with jitter'],
  },
  {
    key: 'ENG-104',
    spaceKey: 'ENG',
    title: 'Refresh session cookies',
    description:
      'Refresh session cookies on the current host. Check the session policy.',
    status: 'To Do',
    type: 'Task',
    assignee: 'Noah Patel',
    updatedAt: '2026-08-01T00:00:00.000Z',
    acceptance: ['Refresh session cookies every 12 hours'],
  },
  {
    key: 'ENG-105',
    spaceKey: 'ENG',
    title: 'Clarify webhook ownership',
    description:
      'Webhook delivery is at-least-once. Confirm who owns webhook retries after launch.',
    status: 'To Do',
    type: 'Bug',
    assignee: 'Priya Shah',
    updatedAt: '2026-07-10T00:00:00.000Z',
    acceptance: ['Webhook retry ownership is named'],
  },
];
