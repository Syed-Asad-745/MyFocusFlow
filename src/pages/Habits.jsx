import "./page_styles/Habits.css";
import { useState, useEffect } from "react";

export default function Habits() {
  const [habits, setHabits] = useState(() => {
    let loadedHabits = localStorage.getItem("habits");
    if (loadedHabits) {
      let parsedHabits = JSON.parse(loadedHabits);
      return parsedHabits;
    } else {
      return [];
    }
  });

  const [habit, setHabit] = useState("");

  function handleHabitFormSubmit(event) {
    event.preventDefault();

    let habitData = {
      id: crypto.randomUUID(),
      name: habit,
      completedDates: [],
    };

    setHabits((prevHabits) => [...prevHabits, habitData]);
    setHabit("");
  }

  function getTodayDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function handleMarkComplete(id) {
    let today = getTodayDate();

    setHabits((prevHabits) => {
      return prevHabits.map((habit) => {
        if (habit.id === id) {
          let completedDates = habit.completedDates;

          if (completedDates.includes(today)) {
            return {
              ...habit,
              completedDates: completedDates.filter((date) => date !== today),
            };
          } else {
            return {
              ...habit,
              completedDates: [...completedDates, today],
            };
          }
        } else {
          return habit;
        }
      });
    });
  }

  function handleDeleteHabit(id) {
    setHabits((prevHabits) => {
      return prevHabits.filter((habit) => habit.id !== id);
    });
  }

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
    window.dispatchEvent(new Event("focusflow-updated"));
  }, [habits]);

  let today = getTodayDate();

  return (
    <div id="habits-component">
      <h2>Add a habit</h2>

      <form onSubmit={handleHabitFormSubmit} id="habit-form">
        <label htmlFor="habit-input">Habit</label>

        <input type="text" value={habit} onChange={(event) => setHabit(event.target.value)} id="habit-input" className="habit-form-inputs" placeholder="e.g. Read for 20 minutes" required />

        <button type="submit" id="habit-form-submit-button">
          Add Habit
        </button>
      </form>

      <div id="habits-list">
        {habits.map((habit) => {
          let completedToday = habit.completedDates.includes(today);

          return (
            <div key={habit.id} className={`rendered-habit ${completedToday ? "completed" : ""}`}>
              <p className="habit-name">{habit.name}</p>

              <div className="habit-action-buttons">
                <button className="mark-habit-button" onClick={() => handleMarkComplete(habit.id)} aria-label={completedToday ? `Mark ${habit.name} incomplete` : `Mark ${habit.name} complete`}>
                  {completedToday ? "✓" : "○"}
                </button>

                <button className="delete-habit-button" onClick={() => handleDeleteHabit(habit.id)} aria-label={`Delete ${habit.name}`}>
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
