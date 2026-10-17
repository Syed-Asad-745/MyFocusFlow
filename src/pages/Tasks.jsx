import "./page_styles/Tasks.css";
import { useState, useEffect } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState(() => {
    let loadedTasks = localStorage.getItem("tasks");
    if (loadedTasks) {
      let parsedTasks = JSON.parse(loadedTasks);
      return parsedTasks;
    } else {
      return [];
    }
  });
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("None");
  const [taskCategory, setTaskCategory] = useState("Uncategorised");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskEstimatedTime, setTaskEstimatedTime] = useState("");
  const [taskEditingId, setTaskEditingId] = useState(null);

  function handleTaskFormSubmit(event) {
    event.preventDefault();

    let taskData = {
      description: taskDescription,
      priority: taskPriority,
      category: taskCategory,
      dueDate: taskDueDate,
      estimatedTime: taskEstimatedTime,
    };
    if (taskEditingId === null) {
      setTasks((prevTasks) => [...prevTasks, { id: crypto.randomUUID(), ...taskData, completed: false }]);
    } else if (taskEditingId !== null) {
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task.id === taskEditingId) {
            return { ...task, ...taskData };
          } else return task;
        });
      });
    }
    setTaskDescription("");
    setTaskPriority("None");
    setTaskCategory("Uncategorised");
    setTaskDueDate("");
    setTaskEstimatedTime("");
    setTaskEditingId(null);
  }

  function handleMoveUp(index) {
    if (index > 0) {
      let newTasks = [...tasks];
      [newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]];
      setTasks(newTasks);
    }
  }
  function handleMoveDown(index) {
    if (index < tasks.length - 1) {
      let newTasks = [...tasks];
      [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
      setTasks(newTasks);
    }
  }

  function handleMarkComplete(id) {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        return task.id === id ? { ...task, completed: !task.completed } : task;
      });
    });
  }

  function handleEdit(task) {
    setTaskEditingId(task.id);

    setTaskDescription(task.description);
    setTaskPriority(task.priority);
    setTaskCategory(task.category);
    setTaskDueDate(task.dueDate);
    setTaskEstimatedTime(task.estimatedTime);
  }

  function handleDelete(id) {
    if (id === taskEditingId) {
      setTaskDescription("");
      setTaskPriority("None");
      setTaskCategory("Uncategorised");
      setTaskDueDate("");
      setTaskEstimatedTime("");
      setTaskEditingId(null);
    }
    setTasks((prevTasks) => {
      return prevTasks.filter((task) => task.id !== id);
    });
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    window.dispatchEvent(new Event("focusflow-updated"));
  }, [tasks]);

  return (
    <div id="tasks-component">
      <h2>Add a task</h2>
      <form onSubmit={handleTaskFormSubmit} id="task-form">
        <label htmlFor="task-description-input">Task</label>
        <input type="text" value={taskDescription} onChange={(event) => setTaskDescription(event.target.value)} id="task-description-input" className="task-form-inputs" required />

        <label htmlFor="task-priority-input">Priority</label>
        <select name="Priority" value={taskPriority} onChange={(event) => setTaskPriority(event.target.value)} id="task-priority-input" className="task-form-inputs" required>
          <option value="None">None</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label htmlFor="task-category-input">Category</label>
        <select name="Category" value={taskCategory} onChange={(event) => setTaskCategory(event.target.value)} id="task-category-input" className="task-form-inputs" required>
          <option value="Uncategorised">Uncategorised</option>
          <option value="Development">Development</option>
          <option value="Learning">Learning</option>
          <option value="Work">Work</option>
          <option value="Health & Fitness">Health & Fitness</option>
          <option value="Personal">Personal</option>
          <option value="Social">Social</option>
        </select>

        <label htmlFor="task-due-date-input">Due Date</label>
        <input type="date" name="" value={taskDueDate} onChange={(event) => setTaskDueDate(event.target.value)} id="task-due-date-input" className="task-form-inputs" required />

        <label htmlFor="task-estimated-time-input">Estimated Time</label>
        <input type="text" value={taskEstimatedTime} onChange={(event) => setTaskEstimatedTime(event.target.value)} id="task-estimated-time-input" className="task-form-inputs" />

        <button type="submit" id="task-form-submit-button">
          {taskEditingId !== null ? "Save Changes" : "Add Task"}
        </button>
      </form>

      <div>
        {tasks.map((task, index) => (
          <div key={task.id} className={`rendered-task ${task.completed && "completed"}`}>
            <div className="moving-buttons">
              <button className="move-task-up-button" onClick={() => handleMoveUp(index)}>
                ⬆
              </button>
              <button className="move-task-down-button" onClick={() => handleMoveDown(index)}>
                ⬇
              </button>
            </div>
            <div className="task-data">
              <p>{task.description}</p>
              <p>
                Priority: {task.priority} | Category: {task.category}
              </p>
              <p>
                Due Date: {task.dueDate} {task.estimatedTime && `| Estimated Time: ${task.estimatedTime}`}
              </p>
            </div>
            <div className="action-buttons">
              <button className="mark-task-button" onClick={() => handleMarkComplete(task.id)}>
                ꪜ
              </button>
              <button className="edit-task-button" onClick={() => handleEdit(task)}>
                🖋
              </button>
              <button className="delete-task-button" onClick={() => handleDelete(task.id)}>
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
