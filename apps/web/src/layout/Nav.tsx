import { NavLink } from 'react-router-dom';
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
    </nav>
  );
}
