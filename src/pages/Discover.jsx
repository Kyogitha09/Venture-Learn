import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import Card from "../components/ui/Card.jsx";
import { getCommunityFeed } from "../services/api.js";
import { sectorOptions } from "../services/mockData.js";
import {
  countStartupVerifications,
  expressInvestorInterest,
  getSessionUser,
  hasInvestorInterest,
  loadAllRuns,
  loadStartupInterests,
  removeInvestorInterest,
  recordStartupView,
} from "../services/storage.js";

function buildDemandScore({ simulationScore, likes, comments, interestCount }) {
  const blended = simulationScore * 0.42 + likes * 0.58 + comments * 1.35 + interestCount * 3.5;
  return Math.max(42, Math.min(96, Math.round(blended)));
}

function buildLiveStartup(run) {
  const likes = Math.max(6, Math.round(run.weightedScore / 2));
  const comments = Math.max(2, Math.round(run.weightedScore / 12));
  const interestCount = loadStartupInterests(run.id).length;
  const verificationCount = countStartupVerifications(run.id);

  return {
    id: run.id,
    name: run.profile.idea,
    pitch: run.summary,
    founder: run.ownerName,
    organization: run.ownerOrganization || "Founder workspace",
    sector: run.profile.sector,
    simulationScore: run.weightedScore,
    demandScore: buildDemandScore({
      simulationScore: run.weightedScore,
      likes,
      comments,
      interestCount,
    }),
    likes,
    comments,
    verificationCount,
    verified: verificationCount > 0,
  };
}

function buildPeerStartup(item) {
  const interestCount = loadStartupInterests(item.id).length;
  const verificationCount = countStartupVerifications(item.id);

  return {
    id: item.id,
    name: item.idea,
    pitch: item.summary,
    founder: item.founder,
    organization: item.stage,
    sector: item.sector,
    simulationScore: item.score,
    demandScore: buildDemandScore({
      simulationScore: item.score,
      likes: item.likes,
      comments: item.comments,
      interestCount,
    }),
    likes: item.likes,
    comments: item.comments,
    verificationCount,
    verified: verificationCount > 0,
  };
}

export default function Discover() {
  const user = getSessionUser();
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [startups, setStartups] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStartups() {
      const response = await getCommunityFeed();
      const liveRuns = loadAllRuns().map(buildLiveStartup);
      const peerStartups = response.map(buildPeerStartup);
      const combined = [...liveRuns, ...peerStartups];

      if (active) {
        setStartups(combined);
        setSelectedId((current) => current || combined[0]?.id || "");
        setLoading(false);
      }
    }

    loadStartups();

    return () => {
      active = false;
    };
  }, []);

  const filteredStartups = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    return startups.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.pitch.toLowerCase().includes(normalizedQuery) ||
        item.founder.toLowerCase().includes(normalizedQuery);

      const matchesSector = sector === "All" || item.sector === sector;

      return matchesQuery && matchesSector;
    });
  }, [search, sector, startups]);

  const selectedStartup =
    filteredStartups.find((item) => item.id === selectedId) ??
    startups.find((item) => item.id === selectedId) ??
    filteredStartups[0] ??
    null;

  function handleInterested(startup) {
    const response = expressInvestorInterest({
      startup: {
        id: startup.id,
        idea: startup.name,
        founder: startup.founder,
        founderEmail: startup.founderEmail,
        organization: startup.organization,
        sector: startup.sector,
        summary: startup.pitch,
        score: startup.simulationScore,
      },
      investor: user,
    });

    if (!response.ok) {
      setNotice(
        response.reason === "exists"
          ? "You already marked this startup as interested."
          : response.message || "Could not save your interest.",
      );
      return;
    }

    setNotice(`${startup.name} was added to your interested list.`);
  }

  function handleWithdrawInterest(startup) {
    const response = removeInvestorInterest(startup.id, user?.email);

    if (!response.ok) {
      setNotice("Could not remove this startup from your interested list.");
      return;
    }

    setNotice(`${startup.name} was removed from your interested list.`);
  }

  function handleView(startup) {
    setSelectedId(startup.id);
    recordStartupView({
      startup: {
        id: startup.id,
        name: startup.name,
        founder: startup.founder,
        sector: startup.sector,
        summary: startup.pitch,
      },
      user,
    });
  }

  return (
    <AppShell
      title="Discover Startups"
      subtitle=""
      actions={<Link className="button button--primary" to="/interested">Open Interested</Link>}
    >
      <Card>
        <div className="discover-toolbar">
          <label className="field">
            <span>Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search startups, founders, or keywords"
            />
          </label>

          <label className="field">
            <span>Sector</span>
            <select value={sector} onChange={(event) => setSector(event.target.value)}>
              <option value="All">All</option>
              {sectorOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {notice ? (
        <section className="page-section">
          <Card>
            <p className="card-copy">{notice}</p>
          </Card>
        </section>
      ) : null}

      {selectedStartup ? (
        <section className="page-section">
          <Card>
            <span className="card-kicker">Startup View</span>
            <h2 className="card-title">{selectedStartup.name}</h2>
            <p className="card-copy">{selectedStartup.pitch}</p>

            <div className="chip-row">
              <span className="chip">{selectedStartup.founder}</span>
              <span className="chip">{selectedStartup.sector}</span>
              <span className="chip">Simulation {selectedStartup.simulationScore}</span>
              <span className="chip">Demand {selectedStartup.demandScore}</span>
              <span className={selectedStartup.verified ? "chip chip--verified" : "chip"}>
                {selectedStartup.verified ? `Verified ${selectedStartup.verificationCount}` : "Verification pending"}
              </span>
            </div>
          </Card>
        </section>
      ) : null}

      <section className="page-section">
        {loading ? (
          <Card>
            <h2 className="card-title">Loading startups...</h2>
            <p className="card-copy">Fetching startup cards for discovery.</p>
          </Card>
        ) : filteredStartups.length === 0 ? (
          <Card>
            <h2 className="card-title">No startups match those filters.</h2>
            <p className="card-copy">Try a different sector or a shorter search term.</p>
          </Card>
        ) : (
          <div className="discover-grid">
            {filteredStartups.map((item) => {
              const interested = hasInvestorInterest(item.id, user?.email);

              return (
                <Card key={item.id} className="startup-card">
                  <div>
                    <span className="card-kicker">{item.sector}</span>
                    <h2 className="card-title">{item.name}</h2>
                    <p className="card-copy">{item.pitch}</p>
                  </div>

                  <div className="chip-row">
                    <span className="chip">Simulation {item.simulationScore}</span>
                    <span className="chip">Demand {item.demandScore}</span>
                    <span className={item.verified ? "chip chip--verified" : "chip"}>
                      {item.verified ? "Verified" : "Not verified"}
                    </span>
                  </div>

                  <div className="feed-card__actions">
                    <button
                      className="button button--ghost feed-card__action"
                      type="button"
                      onClick={() => handleView(item)}
                    >
                      View
                    </button>
                    <button
                      className={interested ? "button button--ghost feed-card__action" : "button button--primary feed-card__action"}
                      type="button"
                      onClick={() => (interested ? handleWithdrawInterest(item) : handleInterested(item))}
                    >
                      {interested ? "Withdraw Interest" : "Interested"}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
