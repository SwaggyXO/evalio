import { useEffect, useState } from 'react';
import { api } from '../api';

export function HealthChip() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    const tick = () => {
      api
        .health()
        .then(() => alive && setOk(true))
        .catch(() => alive && setOk(false));
    };
    tick();
    const id = window.setInterval(tick, 8000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

  if (ok === null) return <span className="health muted">Checking…</span>;
  return (
    <span className={ok ? 'health ok' : 'health bad'}>
      {ok ? 'API healthy' : 'API down'}
    </span>
  );
}
