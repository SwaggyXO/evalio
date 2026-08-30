import { join } from 'node:path';
import type { Express, Request, Response } from 'express';
import express from 'express';

export function serveWeb(app: Express, dist: string): void {
  app.use(express.static(dist));
  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/docs')) {
      next();
      return;
    }
    res.sendFile(join(dist, 'index.html'));
  });
}
