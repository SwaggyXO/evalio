import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';

const DEFAULT_ORIGINS = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://127.0.0.1:4173',
  'http://localhost:4173',
  'https://swaggyxo.github.io',
];

export function applyGuard(app: Express): void {
  app.disable('x-powered-by');
  if (process.env.K_SERVICE) app.set('trust proxy', 1);

  const origins = (process.env.CORS_ORIGINS ?? DEFAULT_ORIGINS.join(','))
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: origins,
      methods: ['GET'],
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: '8kb' }));
  app.use(getOnly);
  if (process.env.NODE_ENV !== 'test') {
    app.use(minuteLimiter);
    app.use(hourLimiter);
  }
}

function getOnly(req: Request, res: Response, next: () => void): void {
  if (
    req.method === 'GET' ||
    req.method === 'HEAD' ||
    req.method === 'OPTIONS'
  ) {
    next();
    return;
  }
  res.status(405).json({ message: 'GET only' });
}

const minuteLimiter = rateLimit({
  windowMs: 60_000,
  limit: 40,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: skipCheap,
  handler: tooMany,
});

const hourLimiter = rateLimit({
  windowMs: 60 * 60_000,
  limit: 200,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: skipCheap,
  handler: tooMany,
});

function skipCheap(req: Request): boolean {
  return req.path === '/' || req.path === '/health' || req.method === 'OPTIONS';
}

function tooMany(_req: Request, res: Response): void {
  res.status(429).json({
    message: 'Slow down. This demo API is rate-limited on purpose.',
  });
}
