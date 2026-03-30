import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AppShell from "../components/layout/AppShell.jsx";
import Card from "../components/ui/Card.jsx";
import { getDashboardFallback } from "../services/api.js";
import { communityFeed } from "../services/mockData.js";
import {
  getLatestRun,
  getSessionUser,
  loadAllRuns,
  loadInvestorPipeline,
  loadRuns,
  loadUserStartupLikes,
  loadUserStartupSuggestions,
  loadStartupInterests,
} from "../services/storage.js";

export default function Home() {
  const user = getSessionUser();
  const isInvestor = user?.userType === "investor";
  const isGeneralUser = user?.userType === "user";
  const runs = loadRuns();
  const allRuns = loadAllRuns();
  const latest = getLatestRun();
  const fallback = getDashboardFallback();
  const activeRun = latest ?? fallback;
  const pipeline = loadInvestorPipeline(user?.email);
  const userLikes = loadUserStartupLikes(user?.email);
  const userSuggestions = loadUserStartupSuggestions(user?.email);
  const latestLeads = latest ? loadStartupInterests(latest.id) : [];
  const openOpportunities = allRuns.length > 0 ? allRuns : communityFeed;
  const verifiedOpportunityCount = openOpportunities.filter((item) => {
    const startupId = item.id;
    return loadStartupInterests(startupId).length > 0;
  }).length;
  const averageOpportunityScore =
    openOpportunities.length > 0
      ? Math.round(
          openOpportunities.reduce((total, item) => total + (item.weightedScore ?? item.score ?? 0), 0) /
            openOpportunities.length,
        )
      : 0;
  const orderedSignals = [...(activeRun.categoryScores ?? fallback.categoryScores)].sort((left, right) => right.value - left.value);
  const strongestSignal = orderedSignals[0];
  const weakestSignal = orderedSignals[orderedSignals.length - 1];
  const topRecommendation = (activeRun.recommendations ?? fallback.recommendations)[0];
  const previousRun = runs[1] ?? null;
  const bestScore = runs.length > 0 ? Math.max(...runs.map((item) => item.weightedScore)) : fallback.score;
  const scoreDelta = latest && previousRun ? latest.weightedScore - previousRun.weightedScore : null;
  const totalLeadCount = runs.reduce((total, run) => total + loadStartupInterests(run.id).length, 0);
  const interestedCount = new Set(pipeline.map((item) => item.startupId ?? item.id)).size;
  const latestRunLabel = latest
    ? new Date(latest.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No saved runs yet";

  if (isInvestor) {
    return (
      <AppShell
        title="Home"
        subtitle=""
        actions={<Link className="button button--primary" to="/discover">Discover Startups</Link>}
      >
        <motion.section
          className="page-section"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Card className="home-banner">
            <span className="card-kicker">Welcome</span>
            <h2 className="card-title">{user?.name ? `Welcome back, ${user.name}.` : "Welcome back."}</h2>
            <p className="card-copy">
              Discover startups, express interest quickly, and track the ventures you want to follow up on.
            </p>

            <div className="investor-stats-grid">
              <div className="hero-stat">
                <strong>{averageOpportunityScore}</strong>
                <span>Average Score</span>
              </div>
              <div className="hero-stat">
                <strong>{verifiedOpportunityCount}</strong>
                <span>Active Market Signals</span>
              </div>
            </div>
          </Card>
        </motion.section>

        <section className="page-section">
          <Card>
            <span className="card-kicker">Investor Focus</span>
            <h2 className="card-title">{pipeline.length > 0 ? "Best next move for your pipeline." : "A good place to start exploring."}</h2>
            <p className="card-copy">
              {pipeline.length > 0
                ? "Use your current pipeline and the live market to decide whether to deepen diligence or keep sourcing."
                : "You have not saved any startups yet, so the smartest next step is to scan new ventures and compare their quality quickly."}
            </p>

            <div className="history-list">
              <div className="history-item">
                <div>
                  <strong>{pipeline.length > 0 ? "Pipeline readiness" : "Discovery readiness"}</strong>
                  <span className="card-copy">
                    {pipeline.length > 0
                      ? `${interestedCount} saved startup${interestedCount === 1 ? "" : "s"} currently need review.`
                      : `${openOpportunities.length} startup${openOpportunities.length === 1 ? "" : "s"} are available to review now.`}
                  </span>
                </div>
                <span className="status-pill">{pipeline.length > 0 ? "Review" : "Explore"}</span>
              </div>

              <div className="history-item">
                <div>
                  <strong>Quality benchmark</strong>
                  <span className="card-copy">
                    The average startup score in your visible market is {averageOpportunityScore}.
                  </span>
                </div>
                <span className="status-pill">Score</span>
              </div>

              <div className="history-item">
                <div>
                  <strong>Signal strength</strong>
                  <span className="card-copy">
                    {verifiedOpportunityCount} startup{verifiedOpportunityCount === 1 ? "" : "s"} already show active investor interest signals.
                  </span>
                </div>
                <span className="status-pill">Live</span>
              </div>
            </div>
          </Card>
        </section>
      </AppShell>
    );
  }

  if (isGeneralUser) {
    return (
      <AppShell
        title="User Overview"
        subtitle="See the startup pitches you liked, the comments you added, and your basic account tools."
        actions={<Link className="button button--primary" to="/views">Open Views</Link>}
      >
        <motion.section
          className="home-hero-grid"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Card className="home-banner">
            <span className="card-kicker">Welcome</span>
            <h2 className="card-title">{user?.name ? `Welcome, ${user.name}.` : "Welcome to your workspace."}</h2>
            <p className="card-copy">
              This page tracks your startup pitch activity so you can quickly revisit what you engaged with.
            </p>

            <div className="home-strip">
              <div className="hero-stat">
                <strong>3</strong>
                <span>Main tabs</span>
              </div>
              <div className="hero-stat">
                <strong>{userLikes.length}</strong>
                <span>Liked pitches</span>
              </div>
              <div className="hero-stat">
                <strong>{userSuggestions.length}</strong>
                <span>Comments added</span>
              </div>
            </div>
          </Card>

          <Card>
            <span className="card-kicker">Latest Activity</span>
            <h2 className="card-title">
              {userLikes[0]?.startupName || userSuggestions[0]?.startupName || "No startup activity yet."}
            </h2>
            <p className="card-copy">
              {userLikes.length > 0 || userSuggestions.length > 0
                ? "Your most recent startup interactions are shown here for quick review."
                : "Like a startup pitch or leave a comment in Community, and it will show up here."}
            </p>

            {(userLikes.length > 0 || userSuggestions.length > 0) ? (
              <div className="history-list">
                {userLikes.slice(0, 2).map((item) => (
                  <div key={item.id} className="history-item history-item--stack">
                    <div>
                      <strong>Liked: {item.startupName}</strong>
                      <span className="card-copy">{item.startupFounder || "Founder not listed"} | {item.startupSector || "Sector pending"}</span>
                      <span className="card-copy">{item.startupSummary || "No summary saved for this startup."}</span>
                    </div>
                    <span className="status-pill">Liked</span>
                  </div>
                ))}

                {userSuggestions.slice(0, 2).map((item) => (
                  <div key={item.id} className="history-item history-item--stack">
                    <div>
                      <strong>Commented: {item.startupName}</strong>
                      <span className="card-copy">{item.startupFounder || "Founder not listed"} | {item.startupSector || "Sector pending"}</span>
                      <span className="card-copy">{item.suggestion}</span>
                    </div>
                    <span className="status-pill">Commented</span>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="insight-list">
                <li className="insight-item">Community: like startup pitches and leave comments.</li>
                <li className="insight-item">Views: revisit your saved pitch activity anytime.</li>
                <li className="insight-item">Profile: update your name and account identity details.</li>
              </ul>
            )}
          </Card>
        </motion.section>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Founder Overview"
      subtitle="Keep your startup moving with simulation progress, readiness signals, and investor activity in one place."
      actions={<Link className="button button--primary" to="/simulation">New Simulation</Link>}
    >
      <motion.section
        className="home-hero-grid"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Card className="home-banner">
          <span className="card-kicker">Active Venture</span>
          <h2 className="card-title">
            {latest?.profile?.idea ?? (user?.name ? `${user.name}, your founder workspace is ready.` : "Your founder workspace is ready.")}
          </h2>
          <p className="card-copy">
            {latest
              ? latest.summary
              : "Start your first simulation run to generate a viability score, category breakdown, and investor-facing guidance."}
          </p>

          <div className="home-strip">
            <div className="hero-stat">
              <strong>{runs.length}</strong>
              <span>Saved runs</span>
            </div>
            <div className="hero-stat">
              <strong>{bestScore}</strong>
              <span>Best score</span>
            </div>
            <div className="hero-stat">
              <strong>{totalLeadCount}</strong>
              <span>Investor leads</span>
            </div>
          </div>
        </Card>

        <Card>
          <span className="card-kicker">Next Founder Move</span>
          <h2 className="card-title">{topRecommendation}</h2>
          <p className="card-copy">
            {scoreDelta !== null
              ? `Your latest run moved ${scoreDelta >= 0 ? "up" : "down"} by ${Math.abs(scoreDelta)} points compared with the previous one.`
              : "Treat this as the highest-value improvement before your next decision run."}
          </p>

          <ul className="insight-list">
            <li className="insight-item">Strongest signal: {strongestSignal?.category ?? "Market"}</li>
            <li className="insight-item">Weakest signal: {weakestSignal?.category ?? "Money"}</li>
            <li className="insight-item">Latest run: {latestRunLabel}</li>
          </ul>
        </Card>
      </motion.section>

      <section className="dashboard-grid home-overview-grid">
        <Card>
          <span className="card-kicker">Venture Snapshot</span>
          <h2 className="card-title">{latest?.profile?.idea ?? "No venture run yet"}</h2>

          {latest ? (
            <>
              <div className="chip-row">
                <span className="chip">{latest.profile.sector}</span>
                <span className="chip">{latest.profile.team}</span>
                <span className="chip">Score {latest.weightedScore}</span>
              </div>

              <ul className="insight-list">
                {latest.strengths.slice(0, 3).map((item) => (
                  <li key={item} className="insight-item">{item}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="card-copy">
              Start your first simulation to generate a venture score, strengths, weaknesses, and recommendations.
            </p>
          )}
        </Card>

        <Card>
          <span className="card-kicker">Investor Activity</span>
          <h2 className="card-title">{latestLeads.length > 0 ? "People watching your latest startup run." : "No investor activity yet."}</h2>
          <p className="card-copy">
            {latestLeads.length > 0
              ? "Use this signal as an early check on how your startup story is landing."
              : "Improve the weakest areas, then share stronger runs through the validation feed to attract attention."}
          </p>

          <div className="history-list">
            {latestLeads.length > 0 ? (
              latestLeads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="history-item">
                  <div>
                    <strong>{lead.investorName}</strong>
                    <span className="card-copy">{lead.investorOrganization || lead.investorEmail}</span>
                  </div>
                  <span className="status-pill">{lead.status}</span>
                </div>
              ))
            ) : (
              <>
                <div className="activity-signal-grid">
                  <div className="activity-signal-card">
                    <span className="card-kicker">Strongest category</span>
                    <strong>{strongestSignal?.category ?? "Market"}</strong>
                    <p className="card-copy">Current best-performing validation area.</p>
                    <span className="status-pill">{strongestSignal?.value ?? "--"}</span>
                  </div>

                  <div className="activity-signal-card">
                    <span className="card-kicker">Weakest category</span>
                    <strong>{weakestSignal?.category ?? "Money"}</strong>
                    <p className="card-copy">The next area to tighten before outreach.</p>
                    <span className="status-pill">{weakestSignal?.value ?? "--"}</span>
                  </div>

                  <div className="activity-signal-card">
                    <span className="card-kicker">Latest score</span>
                    <strong>{activeRun.weightedScore ?? fallback.score}</strong>
                    <p className="card-copy">{latestRunLabel}</p>
                    <span className="status-pill">Readiness</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
