import './states.css';

export function ErrorState({ error }: { error: Error }) {
  const status = (error as Error & { status?: number }).status;
  if (status === 404) {
    return (
      <div className="empty" data-testid="not-found">
        This work item or page does not exist.
      </div>
    );
  }
  return (
    <div className="empty" data-testid="api-down">
      The API is unavailable. Evalio cannot load this surface.
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="empty" data-testid="empty">
      {text}
    </div>
  );
}
