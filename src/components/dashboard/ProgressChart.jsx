import Card from "../ui/Card.jsx";

export default function ProgressChart({ runs }) {
  const chartRuns = runs.slice(0, 6).reverse();

  return (
    <Card>
      <span className="card-kicker">Progression</span>
      <h2 className="card-title">Score across recent runs</h2>
      <div className="bar-chart">
        {chartRuns.map((run, index) => (
          <div key={run.id ?? index} className="bar-item">
            <div className="bar-track">
              <div className="bar-fill" style={{ height: `${run.weightedScore}%` }} />
            </div>
            <strong>{run.weightedScore}</strong>
            <span>Run {chartRuns.length - index}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

