import './lozenge.css';

export function Lozenge({
  kind,
  children,
}: {
  kind: string;
  children: string;
}) {
  return <span className={`lozenge lozenge-${kind}`}>{children}</span>;
}

export function statusKind(status: string): string {
  if (status === 'In Progress') return 'progress';
  if (status === 'Done') return 'done';
  return 'todo';
}

export function claimKind(status: string): string {
  if (status === 'executable') return 'ready';
  if (status === 'wrong_source' || status === 'unsupported') return 'wrong';
  if (status === 'stale') return 'stale';
  if (status === 'conflict') return 'conflict';
  return 'human';
}

export function claimLabel(status: string): string {
  if (status === 'executable') return 'Executable';
  if (status === 'wrong_source') return 'Wrong source';
  if (status === 'unsupported') return 'Unsupported';
  if (status === 'conflict') return 'Conflict';
  if (status === 'stale') return 'Stale';
  return 'Needs a human';
}
