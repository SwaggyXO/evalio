export type Result<T, E = AppError> =
  { ok: true; value: T } | { ok: false; error: E };

export type AppErrorCode = 'NOT_FOUND' | 'INVALID' | 'UNAVAILABLE';

export class AppError {
  constructor(
    readonly code: AppErrorCode,
    readonly message: string,
    readonly details: Record<string, unknown> = {},
  ) {}
}

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err(error: AppError): Result<never> {
  return { ok: false, error };
}

export function notFound(entity: string, id: string): AppError {
  return new AppError('NOT_FOUND', `${entity} not found`, { id });
}

export function unavailable(message: string): AppError {
  return new AppError('UNAVAILABLE', message);
}
