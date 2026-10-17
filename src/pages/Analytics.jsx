import { useEffect, useMemo, useState } from "react";
import "./page_styles/Analytics.css";

const STORAGE_KEYS = {
  tasks: "tasks",
  habits: "habits",
  sessions: "focusSessions",
};

function readStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

// Format a date using local calendar fields, not UTC.
function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getLastSevenDays() {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - index));

    return {
      key: getDateKey(date),
      label: date.toLocaleDateString("en-IN", {
        weekday: "short",
      }),
      shortDate: date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
    };
  });
}

function formatPercent(value) {
  return value == null ? "—" : `${Math.round(value)}%`;
}

function getLocalDateFromTimestamp(timestamp) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return null;

  return getDateKey(date);
}

function calculateAnalytics(tasks, habits, sessions, days) {
  const taskTrend = days.map((day) => {
    const dueTasks = tasks.filter((task) => task.dueDate === day.key);

    const completed = dueTasks.filter((task) => task.completed).length;

    return {
      ...day,
      value: dueTasks.length ? (completed / dueTasks.length) * 100 : null,
      detail: `${completed} of ${dueTasks.length} tasks completed`,
    };
  });

  const habitTrend = days.map((day) => {
    const completed = habits.filter((habit) => Array.isArray(habit.completedDates) && habit.completedDates.includes(day.key)).length;

    return {
      ...day,
      value: habits.length ? (completed / habits.length) * 100 : null,
      detail: `${completed} of ${habits.length} habits completed`,
    };
  });

  const sessionTrend = days.map((day) => {
    const count = sessions.filter((session) => {
      return getLocalDateFromTimestamp(session.startTime) === day.key;
    }).length;

    return {
      ...day,
      value: count,
      detail: `${count} focus sessions`,
    };
  });

  const eligibleTasks = tasks.filter((task) => days.some((day) => day.key === task.dueDate));

  const completedTasks = eligibleTasks.filter((task) => task.completed).length;

  const overallTaskRate = eligibleTasks.length ? (completedTasks / eligibleTasks.length) * 100 : null;

  const totalHabitOpportunities = habits.length * days.length;

  const completedHabitOpportunities = habits.reduce((total, habit) => {
    const dates = Array.isArray(habit.completedDates) ? habit.completedDates : [];

    return total + days.filter((day) => dates.includes(day.key)).length;
  }, 0);

  const overallHabitRate = totalHabitOpportunities ? (completedHabitOpportunities / totalHabitOpportunities) * 100 : null;

  const sessionsThisWeek = sessionTrend.reduce((total, day) => total + day.value, 0);

  return {
    taskTrend,
    habitTrend,
    sessionTrend,
    overallTaskRate,
    overallHabitRate,
    sessionsThisWeek,
    averageSessions: sessionsThisWeek / days.length,
    completedTasks,
    eligibleTasks: eligibleTasks.length,
    completedHabitOpportunities,
    totalHabitOpportunities,
  };
}

function LineChart({ title, subtitle, data, color, suffix = "%", maxValue = 100 }) {
  const width = 600;
  const height = 230;
  const padding = { top: 20, right: 22, bottom: 48, left: 42 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const x = (index) => padding.left + (data.length > 1 ? (index / (data.length - 1)) * chartWidth : 0);

  const y = (value) => padding.top + chartHeight - (value / maxValue) * chartHeight;

  // A missing value breaks the line rather than inventing a value.
  const segments = [];
  let currentSegment = [];

  data.forEach((point, index) => {
    if (point.value == null) {
      if (currentSegment.length) segments.push(currentSegment);
      currentSegment = [];
    } else {
      currentSegment.push({
        ...point,
        index,
        x: x(index),
        y: y(point.value),
      });
    }
  });

  if (currentSegment.length) segments.push(currentSegment);

  const [activePoint, setActivePoint] = useState(null);

  return (
    <section className="analytics-chart panel">
      <div className="analytics-chart-heading">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>

        <span className="analytics-chart-legend" style={{ "--chart-color": color }}>
          <span />
          {suffix === "%" ? "Rate" : "Sessions"}
        </span>
      </div>

      <div className="analytics-svg-wrap">
        <svg viewBox={`0 0 ${width} ${height}`} className="analytics-svg" role="img" aria-label={`${title}, last seven days`}>
          {[0, 25, 50, 75, 100]
            .filter((value) => value <= maxValue)
            .map((value) => (
              <g key={value}>
                <line x1={padding.left} x2={width - padding.right} y1={y(value)} y2={y(value)} className="analytics-grid-line" />
                <text x={padding.left - 9} y={y(value) + 4} textAnchor="end" className="analytics-axis-label">
                  {value}
                  {suffix}
                </text>
              </g>
            ))}

          {segments.map((segment, index) => (
            <polyline key={index} points={segment.map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          ))}

          {data.map((point, index) => {
            if (point.value == null) return null;

            const pointX = x(index);
            const pointY = y(point.value);
            const isActive = activePoint === index;

            return (
              <g key={point.key} className="analytics-chart-point" onMouseEnter={() => setActivePoint(index)} onMouseLeave={() => setActivePoint(null)} onFocus={() => setActivePoint(index)} onBlur={() => setActivePoint(null)} tabIndex={0} role="img" aria-label={`${point.label}, ${point.detail}`}>
                <circle cx={pointX} cy={pointY} r={isActive ? 7 : 4.5} fill={color} stroke="hsl(0, 0%, 12%)" strokeWidth="2" />

                {isActive && (
                  <g>
                    <rect x={Math.min(width - 132, Math.max(4, pointX - 62))} y={Math.max(2, pointY - 43)} width="128" height="32" rx="7" className="analytics-tooltip" />
                    <text x={Math.min(width - 68, Math.max(68, pointX))} y={Math.max(22, pointY - 23)} textAnchor="middle" className="analytics-tooltip-text">
                      {point.value}
                      {suffix} · {point.shortDate}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {data.map((point, index) => (
            <text key={point.key} x={x(index)} y={height - 22} textAnchor="middle" className="analytics-axis-label">
              {point.label}
            </text>
          ))}
        </svg>
      </div>

      <div className="analytics-chart-details">
        {data.map((point) => (
          <div key={point.key} className="analytics-day-detail">
            <span>{point.shortDate}</span>
            <strong>{point.value == null ? "No data" : `${Number(point.value.toFixed(1))}${suffix}`}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Analytics() {
  const [tasks, setTasks] = useState(() => readStorage(STORAGE_KEYS.tasks));
  const [habits, setHabits] = useState(() => readStorage(STORAGE_KEYS.habits));
  const [sessions, setSessions] = useState(() => readStorage(STORAGE_KEYS.sessions));

  useEffect(() => {
    function refreshData() {
      setTasks(readStorage(STORAGE_KEYS.tasks));
      setHabits(readStorage(STORAGE_KEYS.habits));
      setSessions(readStorage(STORAGE_KEYS.sessions));
    }

    // Cross-tab updates.
    window.addEventListener("storage", refreshData);

    // Same-tab updates from other FocusFlow pages.
    window.addEventListener("focusflow-updated", refreshData);

    // Refresh when returning to this tab.
    window.addEventListener("focus", refreshData);

    return () => {
      window.removeEventListener("storage", refreshData);
      window.removeEventListener("focusflow-updated", refreshData);
      window.removeEventListener("focus", refreshData);
    };
  }, []);

  const days = useMemo(() => getLastSevenDays(), []);

  const stats = useMemo(() => calculateAnalytics(tasks, habits, sessions, days), [tasks, habits, sessions, days]);

  return (
    <main className="analytics-page">
      <header className="analytics-page-heading">
        <div>
          <p className="analytics-eyebrow">YOUR PROGRESS</p>
          <h1>Analytics</h1>
          <p className="analytics-description">Understand your consistency, productivity, and focus.</p>
        </div>

        <span className="analytics-period">LAST 7 DAYS</span>
      </header>

      <section className="analytics-stats-grid">
        <article className="analytics-stat-card panel lime-stat">
          <span className="analytics-stat-label">Task completion</span>
          <strong>{formatPercent(stats.overallTaskRate)}</strong>
          <p>
            {stats.completedTasks} of {stats.eligibleTasks} tasks
          </p>
        </article>

        <article className="analytics-stat-card panel cyan-stat">
          <span className="analytics-stat-label">Habit consistency</span>
          <strong>{formatPercent(stats.overallHabitRate)}</strong>
          <p>
            {stats.completedHabitOpportunities} of {stats.totalHabitOpportunities} habit-days
          </p>
        </article>

        <article className="analytics-stat-card panel magenta-stat">
          <span className="analytics-stat-label">Focus sessions</span>
          <strong>{stats.sessionsThisWeek}</strong>
          <p>Sessions this week</p>
        </article>

        <article className="analytics-stat-card panel">
          <span className="analytics-stat-label">Daily average</span>
          <strong>{stats.averageSessions.toFixed(1)}</strong>
          <p>Sessions per calendar day</p>
        </article>
      </section>

      <div className="analytics-charts">
        <LineChart title="Task completion" subtitle="Current completion status of tasks grouped by due date" data={stats.taskTrend} color="hsl(80, 100%, 55%)" />

        <LineChart title="Habit consistency" subtitle="Percentage of tracked habits completed each day" data={stats.habitTrend} color="hsl(185, 100%, 50%)" />

        <LineChart title="Focus activity" subtitle="Completed focus sessions per day" data={stats.sessionTrend} color="hsl(300, 100%, 65%)" suffix="" maxValue={Math.max(4, ...stats.sessionTrend.map((day) => day.value))} />
      </div>

      <section className="analytics-note panel">
        <div className="analytics-note-icon">i</div>
        <div>
          <h3>About these numbers</h3>
          <p>Task completion uses each task's current status, grouped by its due date. It does not represent the day the task was completed. Habit consistency assumes every stored habit is tracked daily throughout the seven-day period. Focus sessions are grouped by their local start date.</p>
        </div>
      </section>
    </main>
  );
}
