// frontend/src/components/AddEntry.jsx
import { useEffect, useState } from "react";
import { calculateGeneratorDiff } from "../utils/timeUtils";

const API_BASE_URL = "https://genrator-api.onrender.com";

export default function AddEntry({
  onAdd,
  onUpdate,
  editingEntry,
  clearEditing,
}) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // jab bhi editingEntry change ho, form me values set karo
  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date);
      setStartHour(editingEntry.startHour);
      setStartMinute(editingEntry.startMinute);
      setEndHour(editingEntry.endHour);
      setEndMinute(editingEntry.endMinute);
    } else {
      setDate(new Date().toISOString().slice(0, 10));
      setStartHour("");
      setStartMinute("");
      setEndHour("");
      setEndMinute("");
    }
  }, [editingEntry]);

  const diff = calculateGeneratorDiff(
    startHour,
    startMinute,
    endHour,
    endMinute
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !date ||
      startHour === "" ||
      startMinute === "" ||
      endHour === "" ||
      endMinute === ""
    ) {
      setError("Saari fields bhar do.");
      return;
    }

    const calc = calculateGeneratorDiff(
      startHour,
      startMinute,
      endHour,
      endMinute
    );
    if (!calc) {
      setError("End reading, start reading se bada hona chahiye.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        date,
        startHour: Number(startHour),
        startMinute: Number(startMinute),
        endHour: Number(endHour),
        endMinute: Number(endMinute),
      };

      if (editingEntry) {
        // EDIT MODE → PUT
        const id = editingEntry._id || editingEntry.id;

        const res = await fetch(`${API_BASE_URL}/api/entries/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
          body: JSON.stringify(payload),
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
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto 24px",
        padding: 16,
        borderRadius: 12,
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 4, textAlign: "center" }}>
        Generator Time Calculator
      </h1>
      <p
        className="subtitle"
        style={{ textAlign: "center", marginBottom: 16, fontSize: 14 }}
      >
        {isEditing
          ? "Entry edit karo, reading update ho jayegi."
          : "Start / End meter reading daalo, total time mil jayega."}
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        {/* Responsive grid for 4 inputs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 10,
            marginTop: 4,
            marginBottom: 4,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <small>Start Hour</small>
            <input
              type="number"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              placeholder="3323"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <small>Start Min</small>
            <input
              type="number"
              value={startMinute}
              onChange={(e) => setStartMinute(e.target.value)}
              placeholder="14"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <small>End Hour</small>
            <input
              type="number"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              placeholder="3324"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <small>End Min</small>
            <input
              type="number"
              value={endMinute}
              onChange={(e) => setEndMinute(e.target.value)}
              placeholder="30"
            />
          </div>
        </div>

        {diff && (
          <div
            style={{
              fontSize: 13,
              marginTop: 4,
              padding: 8,
              borderRadius: 8,
              background: "#ecfdf3",
              border: "1px solid #bbf7d0",
            }}
          >
            Total:{" "}
            <b>
              {diff.hours} H {diff.minutes} M ({diff.totalMinutes} Min)
            </b>
          </div>
        )}

        {error && (
          <div
            className="error"
            style={{ color: "#dc2626", fontSize: 13, marginTop: 4 }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 8,
            flexWrap: "wrap",
            justifyContent: "flex-start",
          }}
        >
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
