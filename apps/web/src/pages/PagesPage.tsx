import { Link } from 'react-router-dom';
import { api } from '../api';
import { EmptyState, ErrorState } from '../ui/States';
import { useLoad } from '../ui/useLoad';
import './list.css';

export function PagesPage() {
  const { data, error } = useLoad(() => api.pages(), []);
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState text="Loading pages…" />;

  return (
    <section>
      <h1>Pages</h1>
      <p className="crumb">Space · ENG</p>
      <div className="card">
        {data.map((page) => (
          <Link className="row" key={page.id} to={`/pages/${page.id}`}>
            <div>
              <span className="row-key">{page.id}</span>
              <span className="row-title">{page.title}</span>
            </div>
            <span className="muted">{page.updatedAt.slice(0, 10)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
