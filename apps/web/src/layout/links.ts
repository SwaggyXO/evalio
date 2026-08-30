export const GITHUB = 'https://github.com/SwaggyXO/evalio';
export const LINKEDIN = 'https://linkedin.com/in/devashish-soni-o7';
const CLOUD_DOCS = 'https://evalio-api-edienbcrga-el.a.run.app/docs';

export function docsHref(): string {
  if (import.meta.env.VITE_API_URL === '/api') return '/docs';
  if (import.meta.env.DEV) return 'http://127.0.0.1:3001/docs';
  return CLOUD_DOCS;
}
