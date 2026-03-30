import Card from "../ui/Card.jsx";

export default function InvestorCard({ feedback, run, startup, onInterested, onWithdrawInterest, interested }) {
  if (startup) {
    const founderName = startup.founder || startup.organization || "Founder not listed";
    const interestCount = typeof startup.investorInterest === "number" ? startup.investorInterest : 0;

    return (
      <Card className="startup-card">
        <span className="card-kicker">{startup.stage}</span>
        <h3 className="card-title">{startup.name}</h3>
        <p className="card-copy">{startup.summary}</p>

        <div className="chip-row">
          <span className="chip">{startup.sector}</span>
          <span className="chip">Score {startup.simulationScore}</span>
          <span className="chip">Demand {startup.demandScore}</span>
        </div>

        <div className="startup-card__details">
          <div className="startup-card__detail">
            <span className="startup-card__label">Founder</span>
            <strong className="startup-card__value">{founderName}</strong>
          </div>

          <div className="startup-card__detail">
            <span className="startup-card__label">Category</span>
            <span className="status-pill">{startup.category}</span>
          </div>

          <div className="startup-card__detail">
            <span className="startup-card__label">Investor Interest</span>
            <strong className="startup-card__value">{interestCount} active signals</strong>
          </div>

          <div className="startup-card__detail">
            <span className="startup-card__label">Stage</span>
            <span className="status-pill">{startup.stage}</span>
          </div>
        </div>

        <div className="feed-card__actions startup-card__actions">
          <button
            className={interested ? "button button--ghost feed-card__action" : "button button--primary feed-card__action"}
            type="button"
            onClick={() => (interested ? onWithdrawInterest?.(startup) : onInterested?.(startup))}
          >
            {interested ? "Withdraw Interest" : "Mark Interested"}
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <span className="card-kicker">Investor Review</span>
      <h2 className="card-title">{feedback.investSignal}</h2>
      <p className="card-copy">{feedback.tone}</p>

      <div className="chip-row">
        <span className="chip">Latest score {run.weightedScore}</span>
        <span className="chip">{run.profile.sector}</span>
        <span className="chip">{run.profile.team}</span>
      </div>

      <ul className="insight-list">
        {feedback.questions.map((item) => (
          <li key={item} className="insight-item">{item}</li>
        ))}
      </ul>

      <div className="feed-card__footer">
        <span>Key unlock: {feedback.yesTrigger}</span>
      </div>
    </Card>
  );
}
