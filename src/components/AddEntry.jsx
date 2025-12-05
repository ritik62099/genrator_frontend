import { useState } from "react";
import { calculateMinutes, formatDuration } from "../utils/timeUtils";

const API_BASE_URL = "https://genrator-api.onrender.com";

export default function AddEntry({ onAdd }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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

      // Backend se aaya entry (with _id)
      onAdd(data);
    } catch (err) {
      console.error(err);
      setError("Server se connect nahi ho paaya.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1>Daily Time Generator</h1>
      <p className="subtitle">
        Start & end time daalo, duration auto calculate hoga.
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
            Aaj ka time: <b>{formatDuration(totalMinutes)}</b>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Entry"}
        </button>
      </form>
    </div>
  );
}
