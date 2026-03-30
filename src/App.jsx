import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Home from "./pages/Home.jsx";
import Simulation from "./pages/Simulation.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Community from "./pages/Community.jsx";
import Discover from "./pages/Discover.jsx";
import Interested from "./pages/Interested.jsx";
import Investor from "./pages/Investor.jsx";
import Messages from "./pages/Messages.jsx";
import MyStartup from "./pages/MyStartup.jsx";
import Resources from "./pages/Resources.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import Views from "./pages/Views.jsx";
import { getSessionUser } from "./services/storage.js";

function ProtectedRoute({ children, allowedTypes }) {
  const user = getSessionUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(user.userType)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function LandingRoute() {
  return getSessionUser() ? <Navigate to="/home" replace /> : <Landing />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/simulation" element={<ProtectedRoute allowedTypes={["owner"]}><Simulation /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute allowedTypes={["owner"]}><Dashboard /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute allowedTypes={["owner", "investor", "user"]}><Community /></ProtectedRoute>} />
      <Route path="/discover" element={<ProtectedRoute allowedTypes={["investor"]}><Discover /></ProtectedRoute>} />
      <Route path="/interested" element={<ProtectedRoute allowedTypes={["investor"]}><Interested /></ProtectedRoute>} />
      <Route path="/investor" element={<ProtectedRoute allowedTypes={["owner", "investor"]}><Investor /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute allowedTypes={["owner", "investor"]}><Messages /></ProtectedRoute>} />
      <Route path="/my-startup" element={<ProtectedRoute allowedTypes={["owner"]}><MyStartup /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute allowedTypes={["owner"]}><Resources /></ProtectedRoute>} />
      <Route path="/views" element={<ProtectedRoute allowedTypes={["user"]}><Views /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
