import "./page_styles/FocusSessions.css";
import { useState, useEffect } from "react";

export default function FocusSession() {
  const [sessions, setSessions] = useState(() => {
    let loadedSessions = localStorage.getItem("focusSessions");

    if (loadedSessions) {
      return JSON.parse(loadedSessions);
    } else {
      return [];
    }
  });

  const [duration, setDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [timerStatus, setTimerStatus] = useState("idle");
  const [sessionStart, setSessionStart] = useState(null);
  const [sessionNote, setSessionNote] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);

  function handleDurationChange(event) {
    let newDuration = Number(event.target.value);

    setDuration(newDuration);
    setTimeLeft(newDuration * 60);
  }

  function handleStart() {
    setSessionStart(new Date().toISOString());
    setTimerStatus("running");
  }

  function handlePause() {
    setTimerStatus("paused");
  }

  function handleResume() {
    setTimerStatus("running");
  }

  function handleFinish() {
    setTimerStatus("idle");
    setShowNoteForm(true);
  }

  function handleSaveSession(event) {
    event.preventDefault();

    let sessionEnd = new Date().toISOString();
    let elapsedSeconds = duration * 60 - timeLeft;

    let sessionData = {
      id: crypto.randomUUID(),
      startTime: sessionStart,
      endTime: sessionEnd,
      plannedDuration: duration,
      actualDuration: Math.max(0, Math.floor(elapsedSeconds / 60)),
      note: sessionNote.trim(),
    };

    setSessions((prevSessions) => {
      return [...prevSessions, sessionData];
    });

    setSessionNote("");
    setShowNoteForm(false);
    setSessionStart(null);
    setDuration(30);
    setTimeLeft(30 * 60);
    setTimerStatus("idle");
  }

  function handleDiscardSession() {
    setShowNoteForm(false);
    setSessionNote("");
    setSessionStart(null);
    setDuration(30);
    setTimeLeft(30 * 60);
    setTimerStatus("idle");
  }

  useEffect(() => {
    if (timerStatus !== "running") {
      return;
    }

    let timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTimerStatus("finished");
          setShowNoteForm(true);
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timerStatus]);

  useEffect(() => {
    localStorage.setItem("focusSessions", JSON.stringify(sessions));
  }, [sessions]);

  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  let completedSessions = sessions.length;

  return (
    <div id="focus-session-component">
      <p className="focus-session-subtitle">Focus on one thing at a time. Make every session count.</p>

      <div id="focus-session-layout">
        <section id="focus-timer-card">
          <p className="focus-card-label">FOCUS TIMER</p>

          <div id="focus-timer-display">{formatTime(timeLeft)}</div>

          <p id="focus-timer-status">{timerStatus === "running" ? "Stay focused. You've got this." : timerStatus === "paused" ? "Session paused" : timerStatus === "finished" ? "Time's up! What did you accomplish?" : "Ready when you are"}</p>

          <div id="focus-duration-control">
            <label htmlFor="focus-duration">Session duration</label>
            <select id="focus-duration" value={duration} onChange={handleDurationChange} disabled={timerStatus !== "idle" || showNoteForm}>
              <option value={15}>15 minutes</option>
              <option value={25}>25 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          <div id="focus-timer-buttons">
            {timerStatus === "idle" && !showNoteForm && (
              <button className="focus-button focus-start-button" onClick={handleStart}>
                Start Focus
              </button>
            )}

            {timerStatus === "running" && (
              <>
                <button className="focus-button focus-pause-button" onClick={handlePause}>
                  Pause
                </button>

                <button className="focus-button focus-finish-button" onClick={handleFinish}>
                  Finish Session
                </button>
              </>
            )}

            {timerStatus === "paused" && (
              <>
                <button className="focus-button focus-start-button" onClick={handleResume}>
                  Resume
                </button>

                <button className="focus-button focus-finish-button" onClick={handleFinish}>
                  Finish Session
                </button>
              </>
            )}
          </div>

          {showNoteForm && (
            <form id="focus-session-note-form" onSubmit={handleSaveSession}>
              <label htmlFor="focus-session-note">What did you accomplish?</label>

              <textarea id="focus-session-note" value={sessionNote} onChange={(event) => setSessionNote(event.target.value)} placeholder="e.g. Completed the task form and fixed its validation..." rows="4" required />

              <button type="submit" className="focus-button focus-start-button">
                Save Session
              </button>

              <button type="button" className="focus-button focus-discard-button" onClick={handleDiscardSession}>
                Discard Session
              </button>
            </form>
          )}
        </section>

        <section id="focus-session-stats">
          <div className="focus-stat-card">
            <p className="focus-card-label">TOTAL SESSIONS</p>
            <h2>{completedSessions}</h2>
            <p>Sessions saved</p>
          </div>

          <div className="focus-stat-card">
            <p className="focus-card-label">TOTAL FOCUS TIME</p>
            <h2>
              {Math.floor(sessions.reduce((total, session) => total + session.actualDuration, 0) / 60)}h {sessions.reduce((total, session) => total + session.actualDuration, 0) % 60}m
            </h2>
            <p>Based on saved sessions</p>
          </div>
        </section>
      </div>

      <section id="focus-session-history">
        <h2>Recent Sessions</h2>
        <p className="focus-session-history-subtitle">Look back at what you've accomplished.</p>

        {sessions.length === 0 ? (
          <div id="focus-session-empty">
            <p>No sessions yet.</p>
            <p>Your completed focus sessions will appear here.</p>
          </div>
        ) : (
          <div id="focus-session-list">
            {[...sessions].reverse().map((session) => {
              return (
                <article className="focus-session-entry" key={session.id}>
                  <div className="focus-session-entry-top">
                    <h3>{session.note || "Focus session"}</h3>
                    <span>{session.actualDuration} min</span>
                  </div>

                  <p>{new Date(session.startTime).toLocaleString()}</p>
                  <p>Planned: {session.plannedDuration} min</p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
