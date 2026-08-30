import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { EmptyState, ErrorState } from '../ui/States';
import { Lozenge, statusKind } from '../ui/Lozenge';
import { useLoad } from '../ui/useLoad';
import './detail.css';

export function WorkItemPage() {
  const { key = '' } = useParams();
  const { data, error } = useLoad(() => api.workItem(key), [key]);
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState text="Loading work item…" />;

  return (
    <section data-testid="work-item">
      <p className="crumb">
        <Link to="/">ENG</Link> / {data.key}
      </p>
      <h1>{data.title}</h1>
      <div className="article-meta">
        <Lozenge kind={statusKind(data.status)}>{data.status}</Lozenge>
        <span className="muted">
          {data.type} · {data.assignee}
        </span>
      </div>
      <p>{data.description}</p>
      <h2>Acceptance</h2>
      <ul className="acceptance">
        {data.acceptance.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p>
        <Link className="brief-link" to={`/items/${data.key}/brief`}>
          Open brief
        </Link>
      </p>
    </section>
  );
}
