import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import FeedCard from "../components/community/FeedCard.jsx";
import Card from "../components/ui/Card.jsx";
import { getCommunityFeed } from "../services/api.js";
import {
  countStartupVerifications,
  expressInvestorInterest,
  getSessionUser,
  hasInvestorInterest,
  hasStartupVerification,
  loadAllRuns,
  removeInvestorInterest,
  loadStartupInterests,
  verifyStartupSafety,
} from "../services/storage.js";

export default function Community() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const user = getSessionUser();
  const isInvestor = user?.userType === "investor";

  useEffect(() => {
    let active = true;

    async function loadFeed() {
      const response = await getCommunityFeed();
      const liveRuns = loadAllRuns()
        .map((run) => ({
          id: run.id,
          founder: run.ownerName,
          founderEmail: run.ownerEmail,
          founderOrganization: run.ownerOrganization,
          idea: run.profile.idea,
          sector: run.profile.sector,
          summary: run.summary,
          score: run.weightedScore,
          demandScore: run.demandScore ?? Math.max(50, Math.round(run.weightedScore * 0.9)),
          likes: Math.max(6, Math.round(run.weightedScore / 2)),
          comments: Math.max(2, Math.round(run.weightedScore / 12)),
          stage: run.ownerEmail === user?.email ? "Your startup" : "Founder submission",
          commentThread: [
            { id: `${run.id}-comment-1`, author: "Community", text: "Interesting traction shape so far.", time: "Today" },
          ],
        }))
        .sort((left, right) => String(right.id).localeCompare(String(left.id)));

      if (active) {
        setFeed([...liveRuns, ...response]);
        setLoading(false);
      }
    }

    loadFeed();

    return () => {
      active = false;
    };
  }, [user?.email]);

  function handleInvest(item) {
    if (!isInvestor) {
      return;
    }

    const response = expressInvestorInterest({
      startup: item,
      investor: user,
    });

    if (!response.ok) {
      setNotice(
        response.reason === "exists"
          ? "You already saved this startup."
          : response.message || "Could not save interest.",
      );
      return;
    }

    setNotice(`${item.idea} was added to your saved startups.`);
  }

  function handleWithdrawInterest(item) {
    if (!isInvestor) {
      return;
    }

    const response = removeInvestorInterest(item.id, user?.email);

    if (!response.ok) {
      setNotice("Could not remove your interest right now.");
      return;
    }

    setNotice(`You removed your interest from ${item.idea}.`);
  }

  function handleVerify(item) {
    if (!isInvestor) {
      return;
    }

    const response = verifyStartupSafety({
      startup: item,
      investor: user,
    });

    if (!response.ok) {
      setNotice(
        response.reason === "exists"
          ? "You already verified this startup as safe."
          : response.message || "Could not save the verification.",
      );
      return;
    }

    setNotice(`Verification saved for ${item.idea}. Other investors can now see this safety signal.`);
  }

  return (
    <AppShell
      title="Community"
      subtitle="Review startup posts, discuss traction signals, and surface demand patterns without leaving the main workspace."
      actions={isInvestor ? <Link className="button button--ghost" to="/investor">Investor Desk</Link> : <span className="status-pill">Peer activity</span>}
    >
      {notice ? (
        <Card>
          <p className="card-copy">{notice}</p>
        </Card>
      ) : null}

      {loading ? (
        <Card>
          <h2 className="card-title">Loading community posts...</h2>
          <p className="card-copy">Fetching recent venture updates and peer activity.</p>
        </Card>
      ) : (
        <section className="feed-grid responsive-grid responsive-grid--cards">
          {feed.map((item) => (
            <FeedCard
              key={item.id}
              item={item}
              userType={user?.userType}
              isInterested={isInvestor ? hasInvestorInterest(item.id, user?.email) : false}
              isVerified={isInvestor ? hasStartupVerification(item.id, user?.email) : false}
              leadCount={!isInvestor ? loadStartupInterests(item.id).length : 0}
              verificationCount={countStartupVerifications(item.id)}
              onInvest={() => handleInvest(item)}
              onWithdrawInterest={() => handleWithdrawInterest(item)}
              onVerify={() => handleVerify(item)}
            />
          ))}
        </section>
      )}
    </AppShell>
  );
}

