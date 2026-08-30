import type { Request, Response } from 'express';
import { AppError } from '@evalio/domain';

export function sendError(res: Response, error: unknown): void {
  if (error instanceof AppError) {
    const status =
      error.code === 'NOT_FOUND'
        ? 404
        : error.code === 'UNAVAILABLE'
          ? 503
          : 400;
    res.status(status).json({
      error: error.code,
      message: error.message,
      details: error.details,
    });
    return;
  }
  res.status(500).json({ error: 'UNAVAILABLE', message: 'Unexpected error' });
}

export function requireQuery(req: Request, name: string): string {
  const value = req.query[name];
  if (typeof value !== 'string') return '';
  return value;
}
