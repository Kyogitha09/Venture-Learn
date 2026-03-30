import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import Card from "../components/ui/Card.jsx";
import { getLatestRun, getSessionUser, loadRuns, loadStartupInterests } from "../services/storage.js";

export default function MyStartup() {
  const user = getSessionUser();
  const latestRun = getLatestRun();
  const runs = loadRuns();
  const investorLeads = latestRun ? loadStartupInterests(latestRun.id).length : 0;

  return (
    <AppShell
      title="My Startup"
      subtitle="A founder view of your venture summary, latest validation score, and the traction story you are building."
      actions={<Link className="button button--ghost" to="/simulation">Update Simulation</Link>}
    >
      {!latestRun ? (
        <Card>
          <h2 className="card-title">No startup summary yet.</h2>
          <p className="card-copy">Run the simulation once to create your founder profile, score summary, and investor-facing startup snapshot.</p>
          <div className="action-row action-row--responsive">
            <Link className="button button--primary" to="/simulation">Start Simulation</Link>
          </div>
        </Card>
      ) : (
        <>
          <section className="dashboard-grid responsive-grid responsive-grid--sidebar">
            <Card>
              <span className="card-kicker">Startup Summary</span>
              <h2 className="card-title">{latestRun.profile.idea}</h2>
              <p className="card-copy">{latestRun.summary}</p>
              <div className="chip-row">
                <span className="chip">{latestRun.profile.sector}</span>
                <span className="chip">{latestRun.profile.team}</span>
                <span className="chip">{latestRun.profile.budget}</span>
              </div>
            </Card>

            <Card>
              <span className="card-kicker">Founder Profile</span>
              <h2 className="card-title">{user?.name ?? "Founder"}</h2>
              <div className="history-list">
                <div className="history-item">
                  <div>
                    <strong>Role</strong>
                    <span className="card-copy">{user?.role || "Founder"}</span>
                  </div>
                  <span className="status-pill">{user?.organization || "Independent"}</span>
                </div>
                <div className="history-item">
                  <div>
                    <strong>Saved runs</strong>
                    <span className="card-copy">How many times the startup has been validated.</span>
                  </div>
                  <span className="status-pill">{runs.length}</span>
                </div>
                <div className="history-item">
                  <div>
                    <strong>Investor leads</strong>
                    <span className="card-copy">Interest attached to the latest startup run.</span>
                  </div>
                  <span className="status-pill">{investorLeads}</span>
                </div>
              </div>
            </Card>
          </section>

          <section className="metric-grid responsive-grid responsive-grid--cards page-section">
            <Card className="metric-card">
              <span className="card-kicker">Startup Score</span>
              <strong className="metric-value">{latestRun.weightedScore}</strong>
              <p className="card-copy">Current validation strength based on your latest founder run.</p>
            </Card>
            <Card className="metric-card">
              <span className="card-kicker">Demand Score</span>
              <strong className="metric-value">{latestRun.demandScore}</strong>
              <p className="card-copy">Demand confidence built from specificity, traction logic, and signal quality.</p>
            </Card>
            <Card className="metric-card">
              <span className="card-kicker">Top Action</span>
              <strong className="metric-value metric-value--small">Next</strong>
              <p className="card-copy">{latestRun.topAction}</p>
            </Card>
          </section>
        </>
      )}
    </AppShell>
  );
}
