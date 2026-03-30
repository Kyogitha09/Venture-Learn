import Card from "../ui/Card.jsx";

export default function FilterBar({ filters, onChange, categories, sectors }) {
  return (
    <Card>
      <div className="filter-bar">
        <label className="field">
          <span>Minimum score</span>
          <select value={filters.minimumScore} onChange={(event) => onChange("minimumScore", Number(event.target.value))}>
            {[0, 60, 70, 80].map((item) => (
              <option key={item} value={item}>{item === 0 ? "All" : `${item}+`}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Category</span>
          <select value={filters.category} onChange={(event) => onChange("category", event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Sector</span>
          <select value={filters.sector} onChange={(event) => onChange("sector", event.target.value)}>
            {sectors.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
    </Card>
  );
}
