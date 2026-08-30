export interface Clock {
  now(): Date;
}

export const systemClock: Clock = {
  now: () => new Date(),
};

export function frozenClock(iso: string): Clock {
  const fixed = new Date(iso);
  return { now: () => new Date(fixed.getTime()) };
}
