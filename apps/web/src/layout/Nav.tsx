import { NavLink } from 'react-router-dom';
import { docsHref, GITHUB, LINKEDIN } from './links';
import './shell.css';

export function Nav() {
  return (
    <nav className="nav">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span>
          <span className="brand-name">Evalio</span>
          <span className="brand-space">ENG</span>
        </span>
      </div>
      <NavLink to="/" end>
        Work items
      </NavLink>
      <NavLink to="/pages">Pages</NavLink>
      <NavLink to="/search">Search</NavLink>
      <div className="nav-ext">
        <a href={docsHref()} target="_blank" rel="noreferrer">
          API docs
        </a>
        <a href={GITHUB} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={LINKEDIN} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
    </nav>
  );
}
