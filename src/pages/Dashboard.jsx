import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import MetricCard from "../components/dashboard/MetricCard.jsx";
import ProgressChart from "../components/dashboard/ProgressChart.jsx";
import Card from "../components/ui/Card.jsx";
import { getDashboardFallback } from "../services/api.js";
import { getLatestRun, loadRuns, loadStartupInterests } from "../services/storage.js";

export default function Dashboard() {
  const runs = loadRuns();
  const latest = getLatestRun();
  const fallback = getDashboardFallback();
  const activeRun = latest ?? fallback;
  const totalLeadCount = runs.reduce((total, run) => total + loadStartupInterests(run.id).length, 0);
  const categoryLeaders = [...activeRun.categoryScores].sort((left, right) => right.value - left.value);
  const chartRuns = runs.length > 0 ? runs : [
    { id: "sample-1", weightedScore: 61 },
    { id: "sample-2", weightedScore: 72 },
    { id: "sample-3", weightedScore: fallback.score },
  ];

  return (
    <AppShell
      title="Dashboard"
      subtitle="Track startup score, demand confidence, investor interest, and the shape of your momentum from one founder dashboard."
      actions={<Link className="button button--ghost" to="/simulation">New Run</Link>}
    >
      <section className="metric-grid responsive-grid responsive-grid--cards">
        <MetricCard label="Startup Score" value={`${activeRun.weightedScore ?? fallback.score}`} footnote="Latest weighted readiness score" />
        <MetricCard label="Demand Score" value={`${activeRun.demandScore ?? fallback.demandScore}`} footnote="Demand confidence across your latest run" />
        <MetricCard label="Investor Interest" value={`${activeRun.investorInterest ?? totalLeadCount}`} footnote="Signals and inbound interest across the platform" />
      </section>

      <section className="dashboard-grid responsive-grid responsive-grid--sidebar page-section">
        <ProgressChart runs={chartRuns} />

        <Card>
          <span className="card-kicker">Category Outlook</span>
          <h2 className="card-title">Where your startup looks strongest right now.</h2>
          <div className="history-list">
            {categoryLeaders.slice(0, 4).map((item) => (
              <div key={item.category} className="history-item">
                <div>
                  <strong>{item.category}</strong>
                  <span className="card-copy">Weighted contribution {item.weight}%</span>
                </div>
                <span className="status-pill">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="dashboard-grid responsive-grid responsive-grid--sidebar page-section">
        <Card>
          <span className="card-kicker">Startup Summary</span>
          <h2 className="card-title">{latest?.profile?.idea ?? "No startup run yet"}</h2>
          <p className="card-copy">
            {latest?.summary ?? "Run the simulation to create a startup summary, demand score, and investor-facing signal map."}
          </p>

          {latest ? (
            <div className="chip-row">
              <span className="chip">{latest.profile.sector}</span>
              <span className="chip">{latest.profile.team}</span>
              <span className="chip">{latest.profile.budget}</span>
            </div>
          ) : null}
        </Card>

        <Card>
          <span className="card-kicker">Execution Notes</span>
          <h2 className="card-title">What to protect and what to fix.</h2>

          <h3 className="section-title">Strengths</h3>
          <ul className="insight-list">
            {(activeRun.strengths ?? fallback.strengths).slice(0, 2).map((item) => (
              <li key={item} className="insight-item">{item}</li>
            ))}
          </ul>

          <h3 className="section-title">Weaknesses</h3>
          <ul className="insight-list">
            {(activeRun.weaknesses ?? fallback.weaknesses).slice(0, 2).map((item) => (
              <li key={item} className="insight-item">{item}</li>
            ))}
          </ul>
        </Card>
      </section>
    </AppShell>
  );
}

