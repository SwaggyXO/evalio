import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Claim } from '@evalio/domain';
import { claimKind, claimLabel, Lozenge } from '../ui/Lozenge';
import './brief.css';

export function ClaimBlock({ claim }: { claim: Claim }) {
  const [open, setOpen] = useState(false);
  const kind = claimKind(claim.status);
  return (
    <article className={`claim claim-${kind}`} data-testid="claim">
      <p>{claim.text}</p>
      <p className="claim-meta">
        <Link to={`/pages/${claim.citedPageId}`}>{claim.citedPageId}</Link>
        <Lozenge kind={kind}>{claimLabel(claim.status)}</Lozenge>
        <span className="muted">{claim.checksUsed} checks</span>
      </p>
      <button
        type="button"
        className="trail-toggle"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? 'Hide trail' : 'Show trail'}
      </button>
      {open ? (
        <ol className="trail" data-testid="trail">
          {claim.trail.map((node) => (
            <li key={`${node.stage}-${node.label}`}>
              {node.stage}: {node.label}
            </li>
          ))}
        </ol>
      ) : null}
    </article>
  );
}
