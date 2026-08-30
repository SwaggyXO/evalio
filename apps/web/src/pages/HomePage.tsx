import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { WorkItem, WorkItemStatus } from '@evalio/domain';
import { api } from '../api';
import { EmptyState, ErrorState } from '../ui/States';
import { Lozenge, statusKind } from '../ui/Lozenge';
import { useLoad } from '../ui/useLoad';
import './list.css';

const FILTERS: Array<WorkItemStatus | 'All'> = [
  'All',
  'To Do',
  'In Progress',
  'Done',
];

export function HomePage() {
  const { data, error } = useLoad(() => api.workItems(), []);
  const [filter, setFilter] = useState<WorkItemStatus | 'All'>('All');
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState text="Loading work itemsâ€¦" />;
  const items = data.filter(
    (item) => filter === 'All' || item.status === filter,
  );

  return (
    <section>
      <h1>Engineering</h1>
      <p className="crumb">Space Â· ENG</p>
      <div className="chips">
        {FILTERS.map((name) => (
          <button
            key={name}
            className={filter === name ? 'chip on' : 'chip'}
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="card" data-testid="work-item-list">
        {items.length === 0 ? (
          <EmptyState text="No work items match this filter." />
        ) : (
          items.map((item) => <ItemRow key={item.key} item={item} />)
        )}
      </div>
    </section>
  );
}

function ItemRow({ item }: { item: WorkItem }) {
  return (
    <Link className="row" to={`/items/${item.key}`}>
      <div>
        <span className="row-key">{item.key}</span>
        <span className="row-title">{item.title}</span>
        <div className="muted">{item.assignee}</div>
      </div>
      <Lozenge kind={statusKind(item.status)}>{item.status}</Lozenge>
    </Link>
  );
}
