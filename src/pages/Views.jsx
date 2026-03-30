import AppShell from "../components/layout/AppShell.jsx";
import Card from "../components/ui/Card.jsx";
import {
  getSessionUser,
  loadUserStartupLikes,
  loadUserStartupSuggestions,
} from "../services/storage.js";

function formatDateTime(value) {
  if (!value) {
    return "Recently";
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Views() {
  const user = getSessionUser();
  const likes = loadUserStartupLikes(user?.email);
  const suggestions = loadUserStartupSuggestions(user?.email);

  return (
    <AppShell
      title="Views"
      subtitle="Review the startup pitches you liked and the comments you added."
    >
      <section className="dashboard-grid responsive-grid responsive-grid--sidebar">
        <Card>
          <span className="card-kicker">Liked Pitches</span>
          <h2 className="card-title">{likes.length > 0 ? "Startup pitches you liked." : "No liked pitches yet."}</h2>
          <p className="card-copy">
            {likes.length > 0
              ? "These are the startup pitches you marked as liked."
              : "Liked startup pitches will appear here after you use the like button."}
          </p>

          <div className="history-list">
            {likes.length > 0 ? (
              likes.map((item) => (
                <div key={item.id} className="history-item history-item--stack">
                  <div>
                    <strong>{item.startupName}</strong>
                    <span className="card-copy">{item.startupFounder || "Founder not listed"} | {item.startupSector || "Sector pending"}</span>
                    <span className="card-copy">{item.startupSummary || "No summary saved for this startup."}</span>
                  </div>
                  <span className="status-pill">{formatDateTime(item.createdAt)}</span>
                </div>
              ))
            ) : (
              <div className="history-item">
                <div>
                  <strong>Nothing saved yet</strong>
                  <span className="card-copy">Startup likes will show up here automatically.</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <span className="card-kicker">Your Comments</span>
          <h2 className="card-title">{suggestions.length > 0 ? "Comments you added on startup pitches." : "No comments yet."}</h2>
          <p className="card-copy">
            {suggestions.length > 0
              ? "Every startup comment or suggestion you submitted is listed here."
              : "Comments will appear here after you leave feedback on a startup pitch."}
          </p>

          <div className="history-list">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <div key={item.id} className="history-item history-item--stack">
                  <div>
                    <strong>{item.startupName}</strong>
                    <span className="card-copy">{item.startupFounder || "Founder not listed"} | {item.startupSector || "Sector pending"}</span>
                    <span className="card-copy">{item.suggestion}</span>
                  </div>
                  <span className="status-pill">{formatDateTime(item.createdAt)}</span>
                </div>
              ))
            ) : (
              <div className="history-item">
                <div>
                  <strong>No comments recorded</strong>
                  <span className="card-copy">Your feedback history will appear here after you submit a comment.</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
