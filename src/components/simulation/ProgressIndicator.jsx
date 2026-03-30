export default function ProgressIndicator({ current, total }) {
  const completion = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="progress-indicator">
      <div className="progress-indicator__header">
        <span className="card-kicker">Progress</span>
        <span className="status-pill">{completion}% complete</span>
      </div>
      <div className="progress-bar" aria-hidden="true">
        <span style={{ width: `${completion}%` }} />
      </div>
      <p className="card-copy">
        {current} of {total} founder questions completed.
      </p>
    </div>
  );
}
