import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { EmptyState, ErrorState } from '../ui/States';
import { useLoad } from '../ui/useLoad';
import { ClaimBlock } from './ClaimBlock';
import './brief.css';
import './list.css';

export function BriefPage() {
  const { key = '' } = useParams();
  const { data, error } = useLoad(() => api.brief(key), [key]);
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState text="Building brief…" />;

  const ready = data.readiness === 'agent_ready';

  return (
    <section data-testid="brief">
      <p className="crumb">
        <Link to="/">ENG</Link> / <Link to={`/items/${key}`}>{key}</Link> /
        Brief
      </p>
      <h1>{data.title}</h1>
      <div className={ready ? 'banner banner-ready' : 'banner banner-human'}>
        <div>
          <div className="banner-title">
            {ready ? 'Agent-ready' : 'Needs a human'}
          </div>
          {data.notReadyReasons.length > 0 ? (
            <div className="reasons" data-testid="not-ready">
              {data.notReadyReasons.map((reason) => (
                <div key={reason}>{reason}</div>
              ))}
            </div>
          ) : (
            <p className="muted">
              Citations, trails, and acceptance coverage all clear.
            </p>
          )}
        </div>
      </div>
      <h2>Acceptance coverage</h2>
      <ul className="coverage">
        {data.rubric.map((item) => (
          <li key={item.text}>
            {item.covered ? 'Covered' : 'Missing'}: {item.text}
          </li>
        ))}
      </ul>
      <div className="card">
        {data.claims.map((claim) => (
          <ClaimBlock key={claim.id} claim={claim} />
        ))}
      </div>
    </section>
  );
}
