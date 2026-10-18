import { useState } from "react";
import "./page_styles/Settings.css";

export default function Settings() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  function handleDeleteAllData() {
    try {
      const keys = ["tasks", "habits", "focusSessions"];

      keys.forEach((key) => localStorage.removeItem(key));

      window.dispatchEvent(new Event("focusflow-updated"));

      setShowConfirmation(false);
      setDeleteError("");
      window.location.reload();
    } catch {
      setDeleteError("Unable to delete all data. Please try again.");
    }
  }

  return (
    <main id="settings-page">
      <section className="settings-section">
        <div className="settings-section-heading">
          <div>
            <h2>Data Management</h2>
            <p>Manage your saved productivity data.</p>
          </div>
        </div>

        <div className="settings-danger-card">
          <div>
            <h3>Delete all data</h3>
            <p>Permanently remove your saved tasks, habits, and focus sessions from this browser. This action cannot be undone.</p>
          </div>

          <button
            className="settings-delete-button"
            onClick={() => {
              setDeleteError("");
              setShowConfirmation(true);
            }}
          >
            Delete all data
          </button>
        </div>

        {deleteError && (
          <p className="settings-error" role="alert">
            {deleteError}
          </p>
        )}
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <div>
            <h2>About</h2>
            <p>Everything you need to know about this app.</p>
          </div>
        </div>

        <div className="settings-about-card">
          <div className="settings-about-icon">FF</div>

          <div className="settings-about-content">
            <h3>My Focus Flow</h3>
            <span className="settings-version">Version 1.0</span>
            <p>A personal productivity dashboard for managing tasks, building habits, and tracking focused work sessions.</p>
          </div>
        </div>

        <div className="settings-info-list">
          <div>
            <span>Built with</span>
            <strong>React · Vite · CSS</strong>
          </div>

          <div>
            <span>Data storage</span>
            <strong>Browser LocalStorage</strong>
          </div>

          <div>
            <span>Privacy</span>
            <strong>Data stays in this browser</strong>
          </div>
        </div>

        <p className="settings-privacy-note">Your saved data is stored locally in your browser and does not automatically sync across devices.</p>
      </section>

      {showConfirmation && (
        <div
          className="settings-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowConfirmation(false);
            }
          }}
        >
          <section className="settings-confirmation-modal" role="alertdialog" aria-modal="true" aria-labelledby="settings-confirm-title" aria-describedby="settings-confirm-description">
            <div className="settings-modal-icon">
              <span>!</span>
            </div>

            <h2 id="settings-confirm-title">Delete all data?</h2>

            <p id="settings-confirm-description">This permanently deletes all saved tasks, habits, and focus sessions from this browser. You cannot undo this action.</p>

            <div className="settings-modal-actions">
              <button className="settings-cancel-button" onClick={() => setShowConfirmation(false)}>
                Cancel
              </button>

              <button className="settings-confirm-delete-button" onClick={handleDeleteAllData}>
                Yes, delete everything
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
