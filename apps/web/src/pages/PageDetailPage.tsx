import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { EmptyState, ErrorState } from '../ui/States';
import { useLoad } from '../ui/useLoad';
import './detail.css';
import './list.css';

export function PageDetailPage() {
  const { id = '' } = useParams();
  const { data, error } = useLoad(() => api.page(id), [id]);
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState text="Loading page…" />;

  return (
    <section>
      <p className="crumb">
        <Link to="/pages">Pages</Link> / {data.title}
      </p>
      <h1>{data.title}</h1>
      <p className="muted">Updated {data.updatedAt.slice(0, 10)}</p>
      <div className="card page-body">{data.body}</div>
    </section>
  );
}
