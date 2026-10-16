import "./component_styles/MainContent.css";
import Header from "./Header.jsx";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard.jsx";
import Tasks from "../pages/Tasks.jsx";
import Habits from "../pages/Habits.jsx";
import FocusSessions from "../pages/FocusSessions.jsx";
import Analytics from "../pages/Analytics.jsx";
import Settings from "../pages/Settings.jsx";
import NotFound from "../pages/NotFound.jsx";

export default function MainContent() {
  return (
    <div className="main-area">
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/focus-sessions" element={<FocusSessions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
