import "./component_styles/Header.css";
import { useLocation } from "react-router-dom";

export default function Header({ theme, toggleTheme }) {
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
    "/settings": {
      title: "Settings",
      paragraph: "Customize FocusFlow to fit your workflow.",
    },
  };

  const pathname = useLocation().pathname;
  const currentPage = pageInfo[pathname];

  return (
    <div className="header">
      <div className="text">
        <h1 id="header-title">{currentPage?.title ?? "Page not found"}</h1>
        <p id="header-paragraph">{currentPage?.paragraph ?? "The page you are looking for does not exist."}</p>
      </div>

      <button
        type="button"
        className="toggle-theme-button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
        <span className="theme-button-label">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
      </button>
    </div>
  );
}
