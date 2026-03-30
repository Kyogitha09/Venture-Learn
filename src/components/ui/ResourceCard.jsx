import Card from "./Card.jsx";

export default function ResourceCard({ item }) {
  return (
    <Card>
      <span className="card-kicker">{item.organization}</span>
      <h3 className="card-title">{item.name}</h3>
      <p className="card-copy">{item.summary}</p>

      <div className="chip-row">
        <span className="chip">{item.sector}</span>
        <span className="chip">{item.supportType}</span>
        <span className="chip">{item.amountBand}</span>
      </div>

      <p className="helper-copy">{item.note}</p>
    </Card>
  );
}

