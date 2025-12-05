import { formatDuration } from "../utils/timeUtils";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function EntriesList({ entries, onEdit, onDelete }) {
  // Month-wise grouping
  const groups = {};

  entries.forEach((entry) => {
    if (!entry.date) return;
    const [year, month] = entry.date.split("-");
    if (!year || !month) return;

    const key = `${year}-${month}`;
    if (!groups[key]) {
      const monthIndex = parseInt(month, 10) - 1;
      const label = `${monthNames[monthIndex]} ${year}`;
      groups[key] = { label, items: [] };
    }
    groups[key].items.push(entry);
  });

  const sortedKeys = Object.keys(groups).sort().reverse(); // latest month upar

  const hasEntries = entries.length > 0;

  return (
    <div>
      {!hasEntries ? (
        <p style={{ fontSize: 14, color: "#6b7280" }}>Koi entry nahi hai.</p>
      ) : (
        sortedKeys.map((key) => {
          const group = groups[key];
          return (
            <div key={key} style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 8 }}>{group.label}</h3>
              <div className="entry-list">
                {group.items.map((entry) => {
                  const id = entry._id || entry.id;
                  return (
                    <div key={id} className="entry-card">
                      <div className="entry-meta">
                        <div className="entry-meta-date">{entry.date}</div>
                        <div className="entry-time">
                          {entry.startTime} → {entry.endTime}
                        </div>
                        <div className="entry-duration">
                          {formatDuration(entry.totalMinutes)}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => onEdit(entry)}
                          style={{
                            padding: "6px 10px",
                            fontSize: 12,
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            cursor: "pointer",
                            background: "#ffffff",
                          }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(id)}
                          style={{
                            padding: "6px 10px",
                            fontSize: 12,
                            borderRadius: 8,
                            border: "none",
                            cursor: "pointer",
                            background: "#dc2626",
                            color: "#ffffff",
                          }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      <button
        onClick={() =>
          window.open(
            "https://genrator-api.onrender.com/api/entries/download/pdf"
          )
        }
        style={{
          marginTop: "20px",
          padding: "10px 15px",
          fontWeight: "bold",
          border: "none",
          background: "#2563eb",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        📄 Download PDF
      </button>
    </div>
  );
}
