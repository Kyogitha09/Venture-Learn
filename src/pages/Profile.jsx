import AppShell from "../components/layout/AppShell.jsx";
import Card from "../components/ui/Card.jsx";
import {
  findUserByEmail,
  getLatestRun,
  getSessionUser,
  loadInvestorPipeline,
  loadInvestorVerifiedStartups,
  loadRuns,
  loadStartupLikesByIds,
  loadStartupSuggestionsByIds,
  loadUserStartupLikes,
  loadUserStartupViews,
} from "../services/storage.js";

function formatDate(value) {
  if (!value) {
    return "Recently";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name) {
  const trimmed = name?.trim();

  if (!trimmed) {
    return "VL";
  }

  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("") || "VL";
}

export default function Profile() {
  const sessionUser = getSessionUser();
  const storedUser = findUserByEmail(sessionUser?.email ?? "");
  const user = storedUser
    ? {
        ...sessionUser,
        ...storedUser,
        name: storedUser.name || sessionUser?.name,
        email: storedUser.email || sessionUser?.email,
        organization: storedUser.organization || sessionUser?.organization || "",
        role: storedUser.role || sessionUser?.role || "",
        linkedinUrl: storedUser.linkedinUrl || sessionUser?.linkedinUrl || "",
      }
    : sessionUser;
  const isInvestor = user?.userType === "investor";
  const isFounder = user?.userType === "owner";
  const isGeneralUser = user?.userType === "user";
  const initials = getInitials(user?.name);
  const latestRun = getLatestRun();
  const runs = loadRuns();
  const investorPipeline = loadInvestorPipeline(user?.email);
  const investorVerified = loadInvestorVerifiedStartups(user?.email);
  const userViews = loadUserStartupViews(user?.email);
  const userLikes = loadUserStartupLikes(user?.email);
  const runIds = runs.map((item) => item.id);
  const startupLikes = loadStartupLikesByIds(runIds);
  const startupSuggestions = loadStartupSuggestionsByIds(runIds);
  const latestStartupLikeCount = latestRun ? startupLikes.filter((item) => item.startupId === latestRun.id).length : 0;
  const latestStartupCommentCount = latestRun ? startupSuggestions.filter((item) => item.startupId === latestRun.id).length : 0;
  const currentStartup = latestRun?.profile?.idea ?? "No startup selected yet";
  const currentSector = latestRun?.profile?.sector ?? "Sector not added";
  const displayEmail = user?.email || "charan1@gmail.com";
  const displayOrganization = user?.organization || "bvrit";
  const displayRole = user?.role || "student";
  const displayLinkedin = user?.linkedinUrl || "LinkedIn profile not added";

  return (
    <AppShell
      title="Profile"
      subtitle="Your public profile, current startup context, and investor activity."
    >
      <section className="dashboard-grid responsive-grid responsive-grid--sidebar">
        <Card className="profile-summary-card">
          <div className="profile-summary">
            <div className="profile-avatar profile-avatar--large">
              <span>{initials}</span>
            </div>

            <div className="profile-summary-copy">
              <span className="card-kicker">{isInvestor ? "Investor profile" : isGeneralUser ? "User profile" : "Founder profile"}</span>
              <h2 className="card-title">{user?.name ?? "Workspace member"}</h2>
              <p className="card-copy">{user?.role || (isInvestor ? "Investor" : isGeneralUser ? "User" : "Founder")}</p>
            </div>
          </div>

          <div className="chip-row">
            <span className="chip">{isInvestor ? "Investor" : isGeneralUser ? "User" : "Founder"}</span>
            <span className="chip">{user?.organization || "Independent"}</span>
            <span className="chip">Joined {formatDate(user?.createdAt)}</span>
          </div>

          <div className="profile-stat-grid">
            {isFounder ? (
              <>
                <div className="profile-stat-card">
                  <span className="card-kicker">Working On</span>
                  <strong className="profile-stat-value metric-value--small">{currentStartup}</strong>
                </div>

                <div className="profile-stat-card">
                  <span className="card-kicker">Sector</span>
                  <strong className="profile-stat-value metric-value--small">{currentSector}</strong>
                </div>
              </>
            ) : isInvestor ? (
              <>
                <div className="profile-stat-card">
                  <span className="card-kicker">Interested Startups</span>
                  <strong className="profile-stat-value">{investorPipeline.length}</strong>
                </div>

                <div className="profile-stat-card">
                  <span className="card-kicker">Verified Startups</span>
                  <strong className="profile-stat-value">{investorVerified.length}</strong>
                </div>
              </>
            ) : (
              <>
                <div className="profile-stat-card">
                  <span className="card-kicker">Viewed</span>
                  <strong className="profile-stat-value">{userViews.length}</strong>
                </div>

                <div className="profile-stat-card">
                  <span className="card-kicker">Liked</span>
                  <strong className="profile-stat-value">{userLikes.length}</strong>
                </div>
              </>
            )}
          </div>
        </Card>

        {isGeneralUser ? (
          <Card>
            <span className="card-kicker">Viewed Startups</span>
            <h2 className="card-title">{userViews.length > 0 ? "Startups you opened recently." : "No viewed startups yet."}</h2>
            <p className="card-copy">
              {userViews.length > 0
                ? "These are the startup pitches you viewed from the community and discovery pages."
                : "Use the View button on a startup pitch and it will appear here."}
            </p>
            <div className="history-list">
              {userViews.length > 0 ? (
                userViews.slice(0, 3).map((item) => (
                  <div key={item.id} className="history-item history-item--stack">
                    <div>
                      <strong>{item.startupName}</strong>
                      <span className="card-copy">{item.startupFounder || "Founder not listed"} | {item.startupSector || "Sector pending"}</span>
                      <span className="card-copy">{item.startupSummary || "No summary saved for this startup."}</span>
                    </div>
                    <span className="status-pill">{formatDate(item.viewedAt)}</span>
                  </div>
                ))
              ) : (
                <div className="history-item">
                  <div>
                    <strong>No activity yet</strong>
                    <span className="card-copy">Viewed startup pitches will show up here automatically.</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card>
            <span className="card-kicker">Startup Summary</span>
            <h2 className="card-title">{latestRun?.profile?.idea ?? "No startup summary yet"}</h2>
            <p className="card-copy">
              {isInvestor
                ? "Your investor profile becomes more credible as you save startups, verify founders, and keep your organization details complete."
                : latestRun?.summary ?? "Run the simulation to generate a founder summary investors can actually react to."}
            </p>
            <ul className="insight-list">
              <li className="insight-item">Role: {user?.role || (isInvestor ? "Investor" : "Founder")}</li>
              <li className="insight-item">Organization: {user?.organization || "Not added"}</li>
              <li className="insight-item">Startup summary: {latestRun?.profile?.sector || (isInvestor ? "Investor workspace active" : "Not available yet")}</li>
            </ul>
          </Card>
        )}
      </section>

      <section className="dashboard-grid responsive-grid responsive-grid--sidebar page-section">
        {isFounder ? (
          <Card>
            <span className="card-kicker">Startup Engagement</span>
            <h2 className="card-title">How people are reacting to your startups.</h2>

            <div className="profile-stat-grid">
              <div className="profile-stat-card">
                <span className="card-kicker">Total Likes</span>
                <strong className="profile-stat-value">{startupLikes.length}</strong>
              </div>

              <div className="profile-stat-card">
                <span className="card-kicker">Total Comments</span>
                <strong className="profile-stat-value">{startupSuggestions.length}</strong>
              </div>
            </div>

            <div className="history-list">
              <div className="history-item">
                <div>
                  <strong>Latest startup likes</strong>
                  <span className="card-copy">
                    People who liked your most recent startup pitch.
                  </span>
                </div>
                <span className="status-pill">{latestStartupLikeCount}</span>
              </div>

              <div className="history-item">
                <div>
                  <strong>Latest startup comments</strong>
                  <span className="card-copy">
                    Comments added on your latest startup pitch.
                  </span>
                </div>
                <span className="status-pill">{latestStartupCommentCount}</span>
              </div>

              <div className="history-item">
                <div>
                  <strong>Tracked startup posts</strong>
                  <span className="card-copy">
                    Startup runs that can receive community engagement.
                  </span>
                </div>
                <span className="status-pill">{runs.length}</span>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <span className="card-kicker">Account Details</span>
            <h2 className="card-title">Public profile information.</h2>

            <div className="profile-detail-list">
              <div className="profile-detail-item">
                <span className="profile-detail-label">Email</span>
                <p className="profile-detail-value">{displayEmail}</p>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">Organization</span>
                <p className="profile-detail-value">{displayOrganization}</p>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">Role</span>
                <p className="profile-detail-value">{displayRole}</p>
              </div>

              {isInvestor ? (
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Organization LinkedIn</span>
                  {user?.linkedinUrl ? (
                    <a className="profile-detail-link" href={user.linkedinUrl} target="_blank" rel="noreferrer">
                      {user.linkedinUrl}
                    </a>
                  ) : (
                    <p className="profile-detail-value">{displayLinkedin}</p>
                  )}
                </div>
              ) : null}
            </div>
          </Card>
        )}

        {isGeneralUser ? (
          <Card>
            <span className="card-kicker">Liked Startups</span>
            <h2 className="card-title">{userLikes.length > 0 ? "Startup pitches you liked." : "No liked startups yet."}</h2>
            <p className="card-copy">
              {userLikes.length > 0
                ? "These are the startup pitches you marked as liked."
                : "Use the Like button on a startup pitch and it will appear here."}
            </p>

            <div className="history-list">
              {userLikes.length > 0 ? (
                userLikes.slice(0, 3).map((item) => (
                  <div key={item.id} className="history-item history-item--stack">
                    <div>
                      <strong>{item.startupName}</strong>
                      <span className="card-copy">{item.startupFounder || "Founder not listed"} | {item.startupSector || "Sector pending"}</span>
                      <span className="card-copy">{item.startupSummary || "No summary saved for this startup."}</span>
                    </div>
                    <span className="status-pill">{formatDate(item.createdAt)}</span>
                  </div>
                ))
              ) : (
                <div className="history-item">
                  <div>
                    <strong>No likes yet</strong>
                    <span className="card-copy">Liked startup pitches will show up here automatically.</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card>
            <span className="card-kicker">{isInvestor ? "Visibility" : "Profile Status"}</span>
            <h2 className="card-title">
              {isInvestor ? "What founders will use to trust you." : "What investors and peers will see."}
            </h2>
            <p className="card-copy">
              {isInvestor
                ? "Keep your organization and LinkedIn details complete so founders can verify who is reaching out."
                : "Your founder details and saved runs build the public story investors use to judge readiness."}
            </p>

            <ul className="insight-list">
              {isInvestor ? (
                <>
                  <li className="insight-item">Organization listed: {user?.organization ? "Yes" : "No"}</li>
                  <li className="insight-item">LinkedIn listed: {user?.linkedinUrl ? "Yes" : "No"}</li>
                  <li className="insight-item">Interested startups tracked: {investorPipeline.length}</li>
                </>
              ) : (
                <>
                  <li className="insight-item">Founder profile visible: Yes</li>
                  <li className="insight-item">Runs completed: {runs.length}</li>
                  <li className="insight-item">Latest idea: {latestRun?.profile?.idea || "No startup run yet"}</li>
                </>
              )}
            </ul>
          </Card>
        )}
      </section>
    </AppShell>
  );
}
