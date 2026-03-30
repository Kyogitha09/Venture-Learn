import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeProvider.jsx";

export default function Topbar({ title, subtitle, actions, onMenuToggle, user }) {
  const { theme, toggleTheme } = useTheme();
  const quickLink =
    user?.userType === "investor"
      ? { to: "/investor", label: "Deal flow" }
      : user?.userType === "user"
        ? { to: "/views", label: "Views" }
        : { to: "/my-startup", label: "My startup" };

  return (
    <motion.header
      className="topbar"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="topbar-main">
        <button className="topbar-menu" type="button" onClick={onMenuToggle} aria-label="Toggle navigation">
          <span />
          <span />
          <span />
        </button>

        <div>
          {title ? <h1 className="page-heading">{title}</h1> : null}
          {subtitle ? <p className="page-copy">{subtitle}</p> : null}
        </div>
      </div>

      <div className="topbar-actions">
        <button className="theme-toggle" type="button" onClick={toggleTheme}>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <Link className="topbar-pill" to={quickLink.to}>
          {quickLink.label}
        </Link>
        {actions}
      </div>
    </motion.header>
  );
}
