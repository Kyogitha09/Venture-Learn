import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import { clearSessionUser, getSessionUser } from "../../services/storage.js";

export default function AppShell({ title, subtitle, actions, children }) {
  const navigate = useNavigate();
  const user = getSessionUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    clearSessionUser();
    navigate("/");
  }

  return (
    <div className="app-frame">
      <div className="shell-layout">
        <Sidebar
          user={user}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />

        <motion.div
          key={title}
          className="shell-main"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
        >
          <Topbar
            title={title}
            subtitle={subtitle}
            actions={actions}
            onMenuToggle={() => setMobileOpen((current) => !current)}
            user={user}
          />
          <div className="page-content">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

