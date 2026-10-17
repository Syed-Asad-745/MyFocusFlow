import "./component_styles/Sidebar.css";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h1 className="app-title">My Focus Flow</h1>

      <nav className="navigation">
        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/">
          Dashboard
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/tasks">
          Tasks
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/habits">
          Habits
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/focus-sessions">
          Focus Session
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/settings" id="settings">
          Settings
        </NavLink>
      </nav>

      <div className="sidebar-bottom"></div>
    </div>
  );
}
