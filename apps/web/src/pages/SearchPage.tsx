import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { EmptyState, ErrorState } from '../ui/States';
import { useLoad } from '../ui/useLoad';
import './list.css';

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const { data, error } = useLoad(() => api.search(q), [q]);
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState text="Searching…" />;
  if (!q)
    return <EmptyState text="Type a query in the header to search pages." />;
  if (data.hits.length === 0) {
    return <EmptyState text="No pages matched this query." />;
  }

  return (
    <section data-testid="search-results">
      <h1>Search</h1>
      <p className="crumb">{data.hits.length} pages</p>
      <div className="card">
        {data.hits.map((hit) => (
          <Link className="row" key={hit.pageId} to={`/pages/${hit.pageId}`}>
            <div>
              <span className="row-key">{hit.pageId}</span>
              <span className="row-title">{hit.title}</span>
              <div className="muted">{hit.snippet}</div>
              <div className="muted">
                {hit.reasons
                  .map((r) => `${r.field}: ${r.terms.join(', ')}`)
                  .join(' · ')}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
