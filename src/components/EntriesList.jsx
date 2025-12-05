import { formatDuration } from "../utils/timeUtils";

export default function EntriesList({ entries }) {
  return (
    <div>
      {/* h2 App se aa raha hai to ye optional hai, chaho to hata do */}
      {/* <h2>Saved Entries</h2> */}

      {entries.length === 0 ? (
        <p style={{ fontSize: 14, color: "#6b7280" }}>Koi entry nahi hai.</p>
      ) : (
        <div className="entry-list">
          {entries.map((entry) => (
            <div key={entry._id || entry.id} className="entry-card">
              <div className="entry-meta">
                <div className="entry-meta-date">{entry.date}</div>
                <div className="entry-time">
                  {entry.startTime} → {entry.endTime}
                </div>
              </div>
              <div className="entry-duration">
                {formatDuration(entry.totalMinutes)}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
  onClick={() => window.open("https://genrator-api.onrender.com/api/entries/download/pdf")}
  style={{
    marginTop:"20px",
    padding:"10px 15px",
    fontWeight:"bold",
    border:"none",
    background:"#2563eb",
    color:"white",
    borderRadius:"8px",
    cursor:"pointer"
  }}
>
  📄 Download PDF
</button>
    </div>
  );
}
