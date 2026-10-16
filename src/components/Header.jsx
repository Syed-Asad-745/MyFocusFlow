import "./component_styles/Header.css";
import { useLocation } from "react-router-dom";

export default function Header() {
  const pageInfo = {
    "/": {
      title: "Dashboard",
      paragraph: "Welcome back! Here's your progress for today.",
    },

    "/tasks": {
      title: "Tasks",
      paragraph: "Break down your goals into actionable tasks.",
    },

    "/habits": {
      title: "Habits",
      paragraph: "Build consistency, one day at a time.",
    },

    "/focus-sessions": {
      title: "Focus Session",
      paragraph: "Run and track focus sessions for insights.",
    },

    "/analytics": {
      title: "Analytics",
      paragraph: "Track your progress and discover your patterns.",
    },

    "/settings": {
      title: "Settings",
      paragraph: "Customize FocusFlow to fit your workflow.",
    },
  };

  return (
    <div className="header">
      <div className="text">
        <h1 id="header-title">{pageInfo[useLocation().pathname]?.title ?? "Page not found"}</h1>
        <p id="header-paragraph">{pageInfo[useLocation().pathname]?.paragraph ?? "The page you are looking for does not exist."}</p>
      </div>
      <button className="toggle-theme-button">☀️</button>
    </div>
  );
}
