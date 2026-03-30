import Card from "../ui/Card.jsx";
import ProgressIndicator from "./ProgressIndicator.jsx";

export default function QuestionCard({ scenario, index, total, answeredCount }) {
  return (
    <Card>
      <div className="question-meta">
        <span className="card-kicker">Scenario {index} of {total}</span>
        <span className="status-pill">{scenario.weight}% weight</span>
      </div>

      <h2 className="card-title">{scenario.title}</h2>
      <p className="card-copy">{scenario.prompt}</p>

      <ProgressIndicator current={answeredCount} total={total} />

      <div className="question-tags">
        <span className="tag">{scenario.category}</span>
        <span className="tag">{Math.max(0, total - answeredCount)} remaining</span>
      </div>

      <ul className="bullet-list">
        <li>{scenario.note}</li>
        <li>Answer like a founder making a real decision, not like a student writing theory.</li>
        <li>Specific trade-offs score better than broad optimism.</li>
      </ul>
    </Card>
  );
}

