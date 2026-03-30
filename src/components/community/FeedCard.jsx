import Card from "../ui/Card.jsx";
import CommentSection from "./CommentSection.jsx";
import UpvoteButton from "./UpvoteButton.jsx";
import { useState } from "react";
import {
  getSessionUser,
  hasUserStartupView,
  hasUserStartupLike,
  recordStartupView,
  toggleStartupLike,
} from "../../services/storage.js";
export default function FeedCard({
  item,
  userType,
  isInterested = false,
  isVerified = false,
  leadCount = 0,
  verificationCount = 0,
  onInvest,
  onWithdrawInterest,
  onVerify,
}) {
  const isInvestor = userType === "investor";
  const currentUser = getSessionUser();
  const initiallyViewed = hasUserStartupView(item.id, currentUser?.email);
  const initiallyLiked = hasUserStartupLike(item.id, currentUser?.email);
  const [viewed, setViewed] = useState(initiallyViewed);
  const [liked, setLiked] = useState(initiallyLiked);
  const [likeCount, setLikeCount] = useState(item.likes + (initiallyLiked ? 1 : 0));

  function handleLike() {
    const response = toggleStartupLike({
      startup: {
        id: item.id,
        name: item.idea,
        founder: item.founder,
        sector: item.sector,
        summary: item.summary,
      },
      user: currentUser,
    });

    if (!response.ok) {
      return;
    }

    setLiked(response.active);
    setLikeCount((current) => current + (response.active ? 1 : -1));
  }

  function handleRecordView() {
    const response = recordStartupView({
      startup: {
        id: item.id,
        name: item.idea,
        founder: item.founder,
        sector: item.sector,
        summary: item.summary,
      },
      user: currentUser,
    });

    if (response) {
      setViewed(true);
    }
  }

  return (
    <Card className="community-card">
      <div className="community-card__header">
        <span className="card-kicker">{item.stage}</span>
        <h3 className="card-title">{item.idea}</h3>
        <p className="card-copy">{item.summary}</p>
      </div>

      <div className="community-card__chips chip-row">
        <span className="chip">{item.founder}</span>
        <span className="chip">{item.sector}</span>
        <span className="chip">Score {item.score}</span>
        <span className="chip">Demand {item.demandScore}</span>
      </div>

      <div className="community-card__engagement">
        <div className="community-card__meta">
          <span className="community-stat">{likeCount} likes</span>
          <span className="community-stat">{item.comments} comments</span>
          {verificationCount > 0 ? <span className="community-stat">{verificationCount} investor verifications</span> : null}
          {!isInvestor && leadCount > 0 ? <span className="community-stat">{leadCount} investor leads</span> : null}
        </div>

        <div className="feed-card__actions community-card__actions">
          <button
            className={viewed ? "button button--primary feed-card__action" : "button button--ghost feed-card__action"}
            type="button"
            onClick={handleRecordView}
          >
            {viewed ? "Viewed" : "View"}
          </button>
          <UpvoteButton count={likeCount} active={liked} onClick={handleLike} />
          {isInvestor ? (
            <>
              <button
                className={isInterested ? "button button--ghost feed-card__action" : "button button--primary feed-card__action"}
                type="button"
                onClick={isInterested ? onWithdrawInterest : onInvest}
              >
                {isInterested ? "Withdraw Interest" : "Interested"}
              </button>

              <button
                className="button button--ghost feed-card__action"
                type="button"
                onClick={onVerify}
                disabled={isVerified}
              >
                {isVerified ? "Verified" : "Verify"}
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="community-card__discussion">
        <CommentSection
          comments={item.commentThread}
          startup={{
            id: item.id,
            name: item.idea,
            founder: item.founder,
            sector: item.sector,
            summary: item.summary,
          }}
        />
      </div>
    </Card>
  );
}
