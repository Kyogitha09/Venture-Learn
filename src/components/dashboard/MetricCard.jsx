import Card from "../ui/Card.jsx";

export default function MetricCard({ label, value, footnote }) {
  return (
    <Card className="metric-card">
      <span className="card-kicker">{label}</span>
      <strong className="metric-value">{value}</strong>
      <p className="card-copy">{footnote}</p>
    </Card>
  );
}

