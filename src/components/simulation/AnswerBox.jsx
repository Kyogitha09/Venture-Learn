import Card from "../ui/Card.jsx";

export default function AnswerBox({
  answer,
  onChange,
  onBack,
  onNext,
  isFirst,
  isLast,
  isSubmitting,
  error,
  liveScore,
}) {
  return (
    <Card className="answer-box">
      <span className="card-kicker">Decision response</span>
      <h2 className="card-title">Explain what you would do and why.</h2>
      <p className="card-copy">
        Mention your customer, trade-off, and what success would look like after the decision.
      </p>

      <div className="answer-box__meta">
        <div>
          <span className="card-kicker">Live score</span>
          <strong className="score-value">{liveScore}</strong>
        </div>
        <p className="card-copy">This estimate updates as your answer becomes more specific.</p>
      </div>

      <textarea
        className="textarea"
        required
        minLength={24}
        maxLength={1200}
        value={answer}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: I would use the first part of the budget to validate farmer demand in one district, because proving repeat purchases matters more than branding at this stage..."
      />

      {error ? <p className="form-error">{error}</p> : <p className="helper-copy">Short answers can work, but specific answers usually score better.</p>}

      <div className="action-row action-row--responsive">
        <button className="button button--ghost" type="button" onClick={onBack} disabled={isFirst || isSubmitting}>
          Previous
        </button>
        <button className="button button--primary" type="button" onClick={onNext} disabled={isSubmitting}>
          {isSubmitting ? "Analyzing run..." : isLast ? "Finish Simulation" : "Save & Next"}
        </button>
      </div>
    </Card>
  );
}

