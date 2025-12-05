import { useEffect, useState } from "react";
import { calculateMinutes, formatDuration } from "../utils/timeUtils";

const API_BASE_URL = "https://genrator-api.onrender.com";

export default function AddEntry({ onAdd, onUpdate, editingEntry, clearEditing }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // jab bhi editingEntry change ho, form me values set karo
  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date);
      setStartTime(editingEntry.startTime);
      setEndTime(editingEntry.endTime);
    } else {
      // reset
      setDate(new Date().toISOString().slice(0, 10));
      setStartTime("09:00");
      setEndTime("18:00");
    }
  }, [editingEntry]);

  const totalMinutes = calculateMinutes(startTime, endTime);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!date || !startTime || !endTime) {
      setError("Saari fields bhar do.");
      return;
    }

    const mins = calculateMinutes(startTime, endTime);
    if (!mins) {
      setError("End time, start time se baad ka hona chahiye.");
      return;
    }

    try {
      setSaving(true);

      if (editingEntry) {
        // EDIT MODE → PUT
        const id = editingEntry._id || editingEntry.id;

        const res = await fetch(`${API_BASE_URL}/api/entries/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, startTime, endTime }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Update nahi ho paaya.");
          return;
        }

        onUpdate(data);
        clearEditing();
      } else {
        // CREATE MODE → POST
        const res = await fetch(`${API_BASE_URL}/api/entries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, startTime, endTime }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Save nahi ho paaya.");
          return;
        }

        onAdd(data);
      }
    } catch (err) {
      console.error(err);
      setError("Server se connect nahi ho paaya.");
    } finally {
      setSaving(false);
    }
  }

  const isEditing = !!editingEntry;

  return (
    <div>
      <h1>Daily Time Generator</h1>
      <p className="subtitle">
        {isEditing
          ? "Entry edit karo, time update ho jayega."
          : "Start & end time daalo, duration auto calculate hoga."}
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          Start Time
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>

        <label>
          End Time
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>

        {totalMinutes !== null && (
          <div style={{ fontSize: 13, marginTop: 4 }}>
            {isEditing ? "Updated time: " : "Aaj ka time: "}
            <b>{formatDuration(totalMinutes)}</b>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button type="submit" disabled={saving}>
            {saving
              ? isEditing
                ? "Updating..."
                : "Saving..."
              : isEditing
              ? "Update Entry"
              : "Add Entry"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={clearEditing}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
