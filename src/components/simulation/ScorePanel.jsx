import Card from "../ui/Card.jsx";

export default function ScorePanel({ phase, scenarios, currentIndex, answersCount, result, liveScore }) {
  return (
    <Card>
      <span className="card-kicker">{phase === "results" ? "Run Summary" : "Scenario Weights"}</span>
      <h2 className="card-title">
        {phase === "results" ? `Venture Score: ${result?.weightedScore ?? 0}` : `Live readiness: ${liveScore}`}
      </h2>
      <p className="card-copy">
        {phase === "results"
          ? result?.summary
          : "Each scenario contributes differently to the final score so high-impact decisions carry more weight than low-impact ones."}
      </p>

      {phase === "results" ? (
        <div className="score-stack">
          {result?.categoryScores?.map((item) => (
            <div key={item.category} className="score-row">
              <div className="score-header">
                <span className="score-label">{item.category}</span>
                <strong className="score-value">{item.value}</strong>
              </div>
              <div className="progress-bar" aria-hidden="true">
                <span style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="score-stack">
          {scenarios.map((item, index) => {
            const isDone = index < answersCount;
            const isActive = index === currentIndex;

            return (
              <div key={item.id} className="score-row">
                <div className="score-header">
                  <span className="score-label">{item.category}</span>
                  <strong className="score-value">{item.weight}%</strong>
                </div>
                <div className="progress-bar" aria-hidden="true">
                  <span style={{ width: isDone ? "100%" : isActive ? "52%" : "18%" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ul className="insight-list">
        {phase === "results"
          ? result?.recommendations?.map((item) => <li key={item} className="insight-item">{item}</li>)
          : [
              `${answersCount} responses saved in this run.`,
              "Repeat the same idea later to compare how your score changes.",
            ].map((item) => (
              <li key={item} className="insight-item">{item}</li>
            ))}
      </ul>
    </Card>
  );
}
