import { useEffect, useState } from 'react';

export function useLoad<T>(loader: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let alive = true;
    setError(null);
    loader()
      .then((value) => {
        if (alive) setData(value);
      })
      .catch((caught: unknown) => {
        if (alive)
          setError(caught instanceof Error ? caught : new Error('Load failed'));
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error };
}
