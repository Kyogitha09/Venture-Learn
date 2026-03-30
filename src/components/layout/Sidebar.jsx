import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

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

function getNavigation(userType) {
  if (userType === "investor") {
    return [
      { to: "/home", label: "Home" },
      { to: "/community", label: "Community" },
      { to: "/investor", label: "Investor" },
      { to: "/messages", label: "Messages" },
      { to: "/profile", label: "Profile" },
      { to: "/settings", label: "Settings" },
    ];
  }

  if (userType === "user") {
    return [
      { to: "/home", label: "Home" },
      { to: "/community", label: "Community" },
      { to: "/views", label: "Views" },
      { to: "/profile", label: "Profile" },
      { to: "/settings", label: "Settings" },
    ];
  }

  return [
    { to: "/home", label: "Home" },
    { to: "/simulation", label: "Simulation" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/resources", label: "Startup Schemes" },
    { to: "/community", label: "Community" },
    { to: "/investor", label: "Investor" },
    { to: "/messages", label: "Messages" },
    { to: "/profile", label: "Profile" },
    { to: "/settings", label: "Settings" },
  ];
}

export default function Sidebar({ user, mobileOpen, onClose, onLogout }) {
  const navigation = getNavigation(user?.userType);
  const initials = getInitials(user?.name);

  return (
    <>
      <div className={`sidebar-overlay${mobileOpen ? " is-visible" : ""}`} onClick={onClose} aria-hidden={!mobileOpen} />
      <motion.aside
        className={`sidebar${mobileOpen ? " is-open" : ""}`}
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <NavLink to="/home" className="sidebar-brand" onClick={onClose}>
          <span className="card-kicker">Venture Learn</span>
          <strong>
            {user?.userType === "investor"
              ? "Investor workspace"
              : user?.userType === "user"
                ? "User workspace"
                : "Founder workspace"}
          </strong>
        </NavLink>

        <NavLink to="/profile" className="sidebar-user" onClick={onClose}>
          <div className="sidebar-avatar">
            <span>{initials}</span>
          </div>

          <div className="sidebar-user-copy">
            <strong>{user?.name ?? "Workspace user"}</strong>
            <span>
              {user?.role || (user?.userType === "investor" ? "Investor" : user?.userType === "user" ? "User" : "Founder")}
            </span>
            <span>{user?.organization || user?.email || "Startup workspace"}</span>
          </div>
        </NavLink>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`}
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="button button--ghost sidebar-logout" type="button" onClick={onLogout}>
          Logout
        </button>
      </motion.aside>
    </>
  );
}
