import "./page_styles/Dashboard.css";
import Analytics from "./Analytics.jsx";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [tasks, setTasks] = useState(() => {
    let loadedTasks = localStorage.getItem("tasks");

    if (loadedTasks) {
      return JSON.parse(loadedTasks);
    } else {
      return [];
    }
  });

  const [habits, setHabits] = useState(() => {
    let loadedHabits = localStorage.getItem("habits");

    if (loadedHabits) {
      return JSON.parse(loadedHabits);
    } else {
      return [];
    }
  });

  const [sessions, setSessions] = useState(() => {
    let loadedSessions = localStorage.getItem("focusSessions");

    if (loadedSessions) {
      return JSON.parse(loadedSessions);
    } else {
      return [];
    }
  });

  useEffect(() => {
    function handleStorageChange() {
      let loadedTasks = localStorage.getItem("tasks");
      let loadedHabits = localStorage.getItem("habits");
      let loadedSessions = localStorage.getItem("focusSessions");

      setTasks(loadedTasks ? JSON.parse(loadedTasks) : []);
      setHabits(loadedHabits ? JSON.parse(loadedHabits) : []);
      setSessions(loadedSessions ? JSON.parse(loadedSessions) : []);
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getGreeting() {
    let hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }

  let today = getTodayDate();

  let completedTasks = tasks.filter((task) => task.completed).length;
  let pendingTasks = tasks.filter((task) => !task.completed).length;

  let overdueTasks = tasks.filter((task) => {
    return !task.completed && task.dueDate < today;
  }).length;

  let completionPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  let completedHabits = habits.filter((habit) => {
    return habit.completedDates.includes(today);
  }).length;

  let habitPercentage = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;

  let totalFocusMinutes = sessions.reduce((total, session) => {
    return total + session.actualDuration;
  }, 0);

  let recentSessions = [...sessions].sort((a, b) => new Date(b.startTime) - new Date(a.startTime)).slice(0, 3);

  return (
    <div id="dashboard-component">
      <div id="dashboard-welcome">
        <h2>{getGreeting()}!</h2>
        <p>Here's your productivity at a glance.</p>
      </div>

      <section id="dashboard-task-stats">
        <div className="dashboard-stat-card">
          <p className="dashboard-card-label">TOTAL TASKS</p>
          <h2>{tasks.length}</h2>
          <p>Tasks in your list</p>
        </div>

        <div className="dashboard-stat-card">
          <p className="dashboard-card-label">PENDING</p>
          <h2>{pendingTasks}</h2>
          <p>Tasks left to complete</p>
        </div>

        <div className="dashboard-stat-card">
          <p className="dashboard-card-label">COMPLETED</p>
          <h2>{completedTasks}</h2>
          <p>{completionPercentage}% completion rate</p>
        </div>

        <div className="dashboard-stat-card">
          <p className="dashboard-card-label">OVERDUE</p>
          <h2>{overdueTasks}</h2>
          <p>Uncompleted past-due tasks</p>
        </div>
      </section>

      <section id="dashboard-progress-section">
        <div className="dashboard-panel">
          <h2>Task Progress</h2>
          <p className="dashboard-panel-subtitle">How much of your task list you've completed.</p>

          <div className="dashboard-progress-track">
            <div id="dashboard-task-progress" style={{ width: `${completionPercentage}%` }}></div>
          </div>

          <p className="dashboard-progress-label">{completionPercentage}% completed</p>
        </div>

        <div className="dashboard-panel">
          <h2>Today's Habits</h2>
          <p className="dashboard-panel-subtitle">Your daily consistency at a glance.</p>

          <h3 className="dashboard-large-stat">
            {completedHabits} / {habits.length}
          </h3>

          <div className="dashboard-progress-track">
            <div id="dashboard-habit-progress" style={{ width: `${habitPercentage}%` }}></div>
          </div>

          <p className="dashboard-progress-label">{habits.length === 0 ? "No habits added yet" : `${habitPercentage}% of habits completed today`}</p>
        </div>
      </section>

      <section id="dashboard-focus-summary">
        <div className="dashboard-panel dashboard-focus-panel">
          <p className="dashboard-card-label">TOTAL FOCUS TIME</p>

          <h2>
            {Math.floor(totalFocusMinutes / 60)}h {totalFocusMinutes % 60}m
          </h2>

          <p>
            Across {sessions.length} saved focus {sessions.length === 1 ? "session" : "sessions"}.
          </p>
        </div>

        <div className="dashboard-panel dashboard-recent-panel">
          <h2>Recent Focus Sessions</h2>
          <p className="dashboard-panel-subtitle">A look at your latest accomplishments.</p>

          {recentSessions.length === 0 ? (
            <div className="dashboard-empty-state">
              <p>No focus sessions yet.</p>
              <p>Your completed sessions will appear here.</p>
            </div>
          ) : (
            <div id="dashboard-session-list">
              {recentSessions.map((session) => {
                return (
                  <article className="dashboard-session-entry" key={session.id}>
                    <div>
                      <h3>{session.note || "Focus session"}</h3>
                      <p>{new Date(session.startTime).toLocaleDateString()}</p>
                    </div>

                    <span>{session.actualDuration} min</span>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-panel" id="dashboard-tasks-preview">
        <h2>Tasks to Focus On</h2>
        <p className="dashboard-panel-subtitle">Your next priorities, all in one place.</p>

        {tasks.filter((task) => !task.completed).length === 0 ? (
          <div className="dashboard-empty-state">
            <p>You're all caught up!</p>
            <p>Add a task when you're ready for your next goal.</p>
          </div>
        ) : (
          <div id="dashboard-task-list">
            {tasks
              .filter((task) => !task.completed)
              .slice(0, 4)
              .map((task) => {
                return (
                  <article className="dashboard-task-entry" key={task.id}>
                    <div>
                      <h3>{task.description}</h3>
                      <p>
                        {task.category} · Due {task.dueDate}
                      </p>
                    </div>

                    <span className={`dashboard-priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                  </article>
                );
              })}
          </div>
        )}
      </section>

      <Analytics />
    </div>
  );
}
