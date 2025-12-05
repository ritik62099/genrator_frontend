// frontend/src/components/EntriesList.jsx
import { calculateGeneratorDiff } from "../utils/timeUtils";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
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

  const sortedKeys = Object.keys(groups).sort().reverse();
  const hasEntries = entries.length > 0;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {!hasEntries ? (
        <p style={{ fontSize: 14, color: "#6b7280" }}>Koi entry nahi hai.</p>
      ) : (
        sortedKeys.map((key) => {
          const group = groups[key];
          return (
            <section key={key} style={{ marginBottom: 24 }}>
              <h3
                style={{
                  marginBottom: 8,
                  fontSize: 18,
                  fontWeight: 600,
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: 4,
                }}
              >
                {group.label}
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 12,
                }}
              >
                {group.items.map((entry) => {
                  const id = entry._id || entry.id;

                  // diff agar backend se aaya ho to use karo, warna front-end se calculate
                  const diff =
                    entry.diffHours != null && entry.diffMinutes != null
                      ? {
                          hours: entry.diffHours,
                          minutes: entry.diffMinutes,
                          totalMinutes: entry.totalMinutes ?? 0,
                        }
                      : calculateGeneratorDiff(
                          entry.startHour,
                          entry.startMinute,
                          entry.endHour,
                          entry.endMinute
                        );

                  const totalText = diff
                    ? `${diff.hours} H ${diff.minutes} M (${diff.totalMinutes} Min)`
                    : "N/A";

                  return (
                    <div
                      key={id}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        padding: 12,
                        background: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <div style={{ fontSize: 13 }}>
                        <div
                          style={{ fontWeight: 600, marginBottom: 4 }}
                        >
                          {entry.date}
                        </div>

                        <div>
                          <b>Start:</b>{" "}
                          {entry.startHour} H {entry.startMinute} M
                        </div>
                        <div>
                          <b>End:</b>{" "}
                          {entry.endHour} H {entry.endMinute} M
                        </div>

                        <div
                          style={{
                            marginTop: 6,
                            padding: 6,
                            borderRadius: 8,
                            background: "#ecfdf3",
                            border: "1px solid #bbf7d0",
                            fontWeight: 600,
                          }}
                        >
                          Total: {totalText}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 6,
                          flexWrap: "wrap",
                        }}
                      >
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
            </section>
          );
        })
      )}

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button
          onClick={() =>
            window.open(
              "https://genrator-api.onrender.com/api/entries/download/pdf"
            )
          }
          style={{
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
    </div>
  );
}
