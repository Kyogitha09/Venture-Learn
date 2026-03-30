import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import FilterBar from "../components/investor/FilterBar.jsx";
import InvestorCard from "../components/investor/InvestorCard.jsx";
import Card from "../components/ui/Card.jsx";
import { getInvestorFeedback, getStartups } from "../services/api.js";
import {
  expressInvestorInterest,
  getLatestRun,
  getSessionUser,
  hasInvestorInterest,
  loadAllRuns,
  loadStartupInterests,
  removeInvestorInterest,
} from "../services/storage.js";
import { sectorOptions } from "../services/mockData.js";

function buildLiveStartup(run) {
  const interestCount = loadStartupInterests(run.id).length;

  return {
    id: run.id,
    name: run.profile.idea,
    founder: run.ownerName || "Founder",
    founderEmail: run.ownerEmail || "",
    organization: run.ownerOrganization || "Founder workspace",
    sector: run.profile.sector,
    simulationScore: run.weightedScore,
    demandScore: run.demandScore ?? Math.max(50, Math.round(run.weightedScore * 0.9)),
    investorInterest: interestCount,
    category: run.profile.sector || "Founder submission",
    stage: "Founder Submission",
    summary: run.summary,
  };
}

export default function Investor() {
  const user = getSessionUser();
  const latestRun = getLatestRun();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(user?.userType === "owner" && Boolean(latestRun));
  const [notice, setNotice] = useState("");
  const [startups, setStartups] = useState([]);
  const [filters, setFilters] = useState({
    minimumScore: 0,
    category: "All",
    sector: "All",
  });

  useEffect(() => {
    let active = true;

    async function loadPortalData() {
      const startupResponse = await getStartups();
      const liveStartups = loadAllRuns()
        .filter((run) => run.ownerEmail !== user?.email)
        .map(buildLiveStartup);
      const staticStartups = startupResponse.filter(
        (startup) => !liveStartups.some((item) => item.id === startup.id),
      );
      const combinedStartups = [...liveStartups, ...staticStartups];

      if (active) {
        setStartups(combinedStartups);
      }

      if (user?.userType === "owner" && latestRun) {
        const feedbackResponse = await getInvestorFeedback(latestRun);

        if (active) {
          setFeedback(feedbackResponse);
          setLoading(false);
        }
      } else if (active) {
        setLoading(false);
      }
    }

    loadPortalData();

    return () => {
      active = false;
    };
  }, [latestRun, user?.userType]);

  const categories = useMemo(
    () => ["All", ...new Set(startups.map((item) => item.category))],
    [startups],
  );
  const sectors = useMemo(() => ["All", ...sectorOptions], []);

  const filteredStartups = useMemo(
    () =>
      startups.filter((item) => (
        item.simulationScore >= filters.minimumScore &&
        (filters.category === "All" || item.category === filters.category) &&
        (filters.sector === "All" || item.sector === filters.sector)
      )),
    [filters, startups],
  );

  function handleFilterChange(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleInterested(startup) {
    const response = expressInvestorInterest({
      startup: {
        id: startup.id,
        idea: startup.name,
        founder: startup.founder,
        founderEmail: startup.founderEmail,
        organization: startup.organization,
        sector: startup.sector,
        summary: startup.summary,
        score: startup.simulationScore,
      },
      investor: user,
    });

    if (!response.ok) {
      setNotice(response.reason === "exists" ? "You already marked this startup as interested." : "Could not update interest right now.");
      return;
    }

    setNotice(`${startup.name} was added to your interested pipeline.`);
  }

  function handleWithdrawInterest(startup) {
    const response = removeInvestorInterest(startup.id, user?.email);

    if (!response.ok) {
      setNotice("Could not remove interest right now.");
      return;
    }

    setNotice(`${startup.name} was removed from your interested pipeline.`);
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.userType === "investor") {
    return (
      <AppShell
        title="Investor"
        subtitle="Browse startup listings, filter by score or category, and capture interest without losing portfolio context."
        actions={<Link className="button button--ghost" to="/messages">Open Messages</Link>}
      >
        {notice ? (
          <Card>
            <p className="card-copy">{notice}</p>
          </Card>
        ) : null}

        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          categories={categories}
          sectors={sectors}
        />

        <section className="feed-grid responsive-grid responsive-grid--cards page-section">
          {filteredStartups.map((startup) => (
            <InvestorCard
              key={startup.id}
              startup={startup}
              onInterested={handleInterested}
              onWithdrawInterest={handleWithdrawInterest}
              interested={hasInvestorInterest(startup.id, user?.email)}
            />
          ))}
        </section>
      </AppShell>
    );
  }

  const rankedCategories = latestRun?.categoryScores ? [...latestRun.categoryScores].sort((left, right) => right.value - left.value) : [];
  const strongestCategory = rankedCategories[0] ?? null;
  const weakestCategory = rankedCategories[rankedCategories.length - 1] ?? null;
  const feedbackView = latestRun
    ? feedback ?? {
        investSignal: "Review in progress",
        tone: "Your startup is saved. The investor-facing summary is still loading.",
        questions: [
          "What proof makes this problem urgent enough for customers to act now?",
          "What will improve first if you get a small amount of capital and twelve focused weeks?",
          "Which part of the model becomes defensible once others try to copy it?",
        ],
        yesTrigger: latestRun.recommendations?.[0] ?? "Show clearer traction and stronger execution proof.",
        redFlag: weakestCategory
          ? `${weakestCategory.category} is still the first area investors will challenge.`
          : "The weakest part of the startup story still needs stronger proof.",
      }
    : null;
  const startupLeads = latestRun ? loadStartupInterests(latestRun.id) : [];

  return (
    <AppShell
      title="Investor"
      subtitle="See how your startup reads to investors, track inbound interest, and prepare the proof they will ask for next."
      actions={<Link className="button button--primary" to="/my-startup">My Startup</Link>}
    >
      {!latestRun ? (
        <Card>
          <h2 className="card-title">Start with a venture run first.</h2>
          <p className="card-copy">
            Complete the simulation before opening this section so the review can use your venture score, category breakdown, and report summary.
          </p>
          <div className="action-row action-row--responsive">
            <Link className="button button--primary" to="/simulation">Open Simulation</Link>
          </div>
        </Card>
      ) : (
        <section className="dashboard-grid responsive-grid responsive-grid--sidebar">
          {loading ? (
            <Card>
              <h2 className="card-title">Preparing investor review...</h2>
              <p className="card-copy">Building feedback from your latest founder run.</p>
            </Card>
          ) : (
            <InvestorCard feedback={feedbackView} run={latestRun} />
          )}

          <Card>
            <span className="card-kicker">Startup Snapshot</span>
            <h2 className="card-title">{latestRun.profile.idea}</h2>
            <p className="card-copy">{latestRun.summary}</p>

            <div className="chip-row">
              <span className="chip">Score {latestRun.weightedScore}</span>
              <span className="chip">Demand {latestRun.demandScore}</span>
              <span className="chip">{latestRun.profile.sector}</span>
              <span className="chip">{latestRun.profile.budget}</span>
            </div>

            <div className="history-list">
              <div className="history-item">
                <div>
                  <strong>Strongest category</strong>
                  <span className="card-copy">{strongestCategory?.category || "Not available"}</span>
                </div>
                <span className="status-pill">{strongestCategory?.value ?? "--"}</span>
              </div>
              <div className="history-item">
                <div>
                  <strong>Weakest category</strong>
                  <span className="card-copy">{weakestCategory?.category || "Not available"}</span>
                </div>
                <span className="status-pill">{weakestCategory?.value ?? "--"}</span>
              </div>
              <div className="history-item">
                <div>
                  <strong>Inbound investor interest</strong>
                  <span className="card-copy">People who have already requested a connection.</span>
                </div>
                <span className="status-pill">{startupLeads.length}</span>
              </div>
            </div>
          </Card>
        </section>
      )}
    </AppShell>
  );
}
