import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import Card from "../components/ui/Card.jsx";
import {
  getSessionUser,
  loadInvestorPipeline,
  markStartupAsInvested,
  removeInvestorInterest,
} from "../services/storage.js";

function formatSavedDate(value) {
  if (!value) {
    return "Recently saved";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Interested() {
  const user = getSessionUser();
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const pipeline = useMemo(() => loadInvestorPipeline(user?.email), [refreshKey, user?.email]);
  const investedCount = pipeline.filter((item) => item.status === "invested").length;
  const pendingCount = pipeline.length - investedCount;
  const latestSaved = pipeline[0]?.createdAt ? formatSavedDate(pipeline[0].createdAt) : "No startups saved yet";

  function handleMarkInvested(startupId, startupIdea) {
    const response = markStartupAsInvested(startupId, user?.email);

    if (!response.ok) {
      setNotice(
        response.reason === "exists"
          ? `${startupIdea} is already marked as invested.`
          : "Could not update this startup right now.",
      );
      return;
    }

    setNotice(`${startupIdea} is now marked as invested.`);
    setRefreshKey((current) => current + 1);
  }

  function handleWithdrawInterest(startupId, startupIdea) {
    const response = removeInvestorInterest(startupId, user?.email);

    if (!response.ok) {
      setNotice("Could not remove this startup right now.");
      return;
    }

    setNotice(`${startupIdea} was removed from your interested pipeline.`);
    setRefreshKey((current) => current + 1);
  }

  return (
    <AppShell
      title="Interested Startups"
      subtitle="Track the ventures you have saved, review the strongest signals, and move your best-fit conversations forward."
      actions={<Link className="button button--primary" to="/discover">Discover More</Link>}
    >
      {notice ? (
        <Card>
          <p className="card-copy">{notice}</p>
        </Card>
      ) : null}

      <section className="dashboard-grid">
        <Card>
          <span className="card-kicker">Pipeline Snapshot</span>
          <h2 className="card-title">{pipeline.length > 0 ? "Your investor pipeline is active." : "Your pipeline is empty."}</h2>
          <p className="card-copy">
            {pipeline.length > 0
              ? "Use this list to keep track of who is still under review and which startups have already moved forward."
              : "When you click Interested from Discover Startups, those ventures will appear here automatically."}
          </p>

          <div className="home-strip">
            <div className="hero-stat">
              <strong>{pipeline.length}</strong>
              <span>Saved startups</span>
            </div>
            <div className="hero-stat">
              <strong>{pendingCount}</strong>
              <span>Pending review</span>
            </div>
            <div className="hero-stat">
              <strong>{investedCount}</strong>
              <span>Marked invested</span>
            </div>
          </div>
        </Card>

        <Card>
          <span className="card-kicker">Current Focus</span>
          <h2 className="card-title">{pipeline[0]?.startupIdea ?? "Start by saving your first startup."}</h2>
          <p className="card-copy">
            {pipeline[0]?.startupSummary ?? "The most recently saved startup will show up here with its summary and score for faster follow-up."}
          </p>

          <div className="history-list">
            <div className="history-item">
              <div>
                <strong>Latest save</strong>
                <span className="card-copy">{latestSaved}</span>
              </div>
              <span className="status-pill">{pipeline[0]?.status ?? "Waiting"}</span>
            </div>
            <div className="history-item">
              <div>
                <strong>Founder</strong>
                <span className="card-copy">{pipeline[0]?.startupFounder ?? "No founder selected yet"}</span>
              </div>
              <span className="status-pill">{pipeline[0]?.startupSector ?? "Sector pending"}</span>
            </div>
            <div className="history-item">
              <div>
                <strong>Simulation score</strong>
                <span className="card-copy">Quick signal for early fit and traction quality.</span>
              </div>
              <span className="status-pill">{pipeline[0]?.startupScore ?? "--"}</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="page-section">
        {pipeline.length === 0 ? (
          <Card className="empty-state">
            <h2 className="card-title">No interested startups yet.</h2>
            <p className="card-copy">
              Open the discovery feed, review a startup, and save the ones you want to revisit here.
            </p>
            <div className="action-row">
              <Link className="button button--primary" to="/discover">Open Discover</Link>
            </div>
          </Card>
        ) : (
          <Card>
            <span className="card-kicker">Saved Startups</span>
            <h2 className="card-title">Ventures you have already shortlisted.</h2>

            <div className="history-list">
              {pipeline.map((item) => {
                const isInvested = item.status === "invested";

                return (
                  <div key={item.id} className="history-item history-item--stack">
                    <div>
                      <strong>{item.startupIdea}</strong>
                      <span className="card-copy">{item.startupFounder} | {item.startupSector} | Score {item.startupScore}</span>
                      <span className="card-copy">{item.startupSummary}</span>
                    </div>

                    <div className="feed-card__actions">
                      <span className="status-pill">{isInvested ? "Invested" : "Pending"}</span>
                      <span className="chip">{formatSavedDate(item.createdAt)}</span>
                      {!isInvested ? (
                        <button
                          className="button button--ghost feed-card__action"
                          type="button"
                          onClick={() => handleWithdrawInterest(item.startupId, item.startupIdea)}
                        >
                          Withdraw Interest
                        </button>
                      ) : null}
                      {!isInvested ? (
                        <button
                          className="button button--primary feed-card__action"
                          type="button"
                          onClick={() => handleMarkInvested(item.startupId, item.startupIdea)}
                        >
                          Mark Invested
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </section>
    </AppShell>
  );
}
