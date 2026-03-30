import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell.jsx";
import Card from "../components/ui/Card.jsx";
import { getSettingsDefaults } from "../services/api.js";
import {
  getSessionUser,
  loadUserPreferences,
  saveUserPreferences,
  updateSessionUserProfile,
} from "../services/storage.js";

export default function Settings() {
  const user = getSessionUser();
  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    role: user?.role ?? "",
    organization: user?.organization ?? "",
    linkedinUrl: user?.linkedinUrl ?? "",
  });
  const [toggles, setToggles] = useState({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      const defaults = await getSettingsDefaults();
      const saved = loadUserPreferences(user?.email);

      if (active) {
        setToggles({ ...defaults, ...saved });
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, [user?.email]);

  function handleSaveProfile() {
    updateSessionUserProfile(profile);
    setNotice("Profile settings updated.");
  }

  function handleToggle(key) {
    const nextToggles = {
      ...toggles,
      [key]: !toggles[key],
    };
    setToggles(nextToggles);
    saveUserPreferences(user?.email, nextToggles);
    setNotice("Preference updated.");
  }

  return (
    <AppShell
      title="Settings"
      subtitle="Edit your workspace profile and toggle the product behaviors you want enabled."
    >
      {notice ? (
        <Card>
          <p className="card-copy">{notice}</p>
        </Card>
      ) : null}

      <section className="dashboard-grid responsive-grid responsive-grid--sidebar page-section">
        <Card>
          <span className="card-kicker">Edit Profile</span>
          <h2 className="card-title">Workspace identity</h2>
          <div className="form-grid responsive-grid responsive-grid--two">
            <label className="field">
              <span>Name</span>
              <input value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label className="field">
              <span>Role</span>
              <input value={profile.role} onChange={(event) => setProfile((current) => ({ ...current, role: event.target.value }))} />
            </label>
            <label className="field">
              <span>Organization</span>
              <input value={profile.organization} onChange={(event) => setProfile((current) => ({ ...current, organization: event.target.value }))} />
            </label>
            <label className="field">
              <span>LinkedIn</span>
              <input value={profile.linkedinUrl} onChange={(event) => setProfile((current) => ({ ...current, linkedinUrl: event.target.value }))} />
            </label>
          </div>
          <div className="action-row action-row--responsive">
            <button className="button button--primary" type="button" onClick={handleSaveProfile}>
              Save Profile
            </button>
          </div>
        </Card>

        <Card>
          <span className="card-kicker">Preferences</span>
          <h2 className="card-title">Product toggles</h2>
          <div className="toggle-list">
            {Object.entries(toggles).map(([key, value]) => (
              <button key={key} className="toggle-item" type="button" onClick={() => handleToggle(key)}>
                <div>
                  <strong>{key.replace(/([A-Z])/g, " $1")}</strong>
                  <span>{value ? "Enabled" : "Disabled"}</span>
                </div>
                <span className={`toggle-switch${value ? " is-on" : ""}`} />
              </button>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
