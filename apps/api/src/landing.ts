import type { Request, Response } from 'express';

export const GITHUB = 'https://github.com/SwaggyXO/evalio';
export const LINKEDIN = 'https://linkedin.com/in/devashish-soni-o7';
export const DEMO = 'https://swaggyxo.github.io/evalio/';

export function landingPayload() {
  return {
    service: 'evalio-api',
    github: GITHUB,
    linkedin: LINKEDIN,
    demo: DEMO,
    health: '/health',
  };
}

export function sendLanding(req: Request, res: Response): void {
  if (req.headers.accept?.includes('text/html')) {
    res.type('html').send(landingHtml());
    return;
  }
  res.json(landingPayload());
}

function landingHtml(): string {
  const { github, linkedin, demo, health } = landingPayload();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Evalio API</title>
  <style>
    body { font: 16px/1.5 ui-sans-serif, system-ui, sans-serif; margin: 2.5rem auto; max-width: 36rem; padding: 0 1.25rem; color: #172b4d; }
    h1 { font-size: 1.35rem; margin: 0 0 0.5rem; }
    p { margin: 0.5rem 0 1rem; color: #44546f; }
    ul { padding: 0; list-style: none; }
    a { color: #0c66e4; }
  </style>
</head>
<body>
  <h1>Evalio API</h1>
  <p>Readiness check for agent briefs. GET only.</p>
  <ul>
    <li><a href="${github}">GitHub</a></li>
    <li><a href="${linkedin}">LinkedIn</a></li>
    <li><a href="${demo}">Live UI</a></li>
    <li><a href="${health}">Health</a></li>
  </ul>
</body>
</html>`;
}
