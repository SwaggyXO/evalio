import { FormEvent } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { HealthChip } from './HealthChip';
import { Nav } from './Nav';
import './shell.css';

export function Shell() {
  const navigate = useNavigate();

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const q = String(data.get('q') ?? '').trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  }

  return (
    <div className="shell">
      <Nav />
      <div className="main">
        <header className="top">
          <form className="search-form" onSubmit={onSearch}>
            <input
              className="search-input"
              name="q"
              placeholder="Search pages"
              aria-label="Search pages"
            />
          </form>
          <HealthChip />
        </header>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
