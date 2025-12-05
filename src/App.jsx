import { useEffect, useState } from "react";
import AddEntry from "./components/AddEntry";
import EntriesList from "./components/EntriesList";

const API_BASE_URL = "https://genrator-api.onrender.com";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  // First render par backend se entries lo
  useEffect(() => {
    async function fetchEntries() {
      try {
        setLoading(true);
        setLoadError("");

        const res = await fetch(`${API_BASE_URL}/api/entries`);
        const data = await res.json();

        if (!res.ok) {
          setLoadError(data.error || "Entries load nahi ho paayi.");
          return;
        }

        setEntries(data); // Mongo se aayi list
      } catch (err) {
        console.error(err);
        setLoadError("Backend se connect nahi ho paaya.");
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, []);

  // AddEntry se naya entry aayega
  function addEntry(newEntry) {
    // naya upar
    setEntries((prev) => [newEntry, ...prev]);
  }

  return (
    <div className="app-container">
      <AddEntry onAdd={addEntry} />

      <h2>Saved Entries (MongoDB)</h2>

      {loading ? (
        <p>Loading entries...</p>
      ) : loadError ? (
        <p style={{ color: "red", fontSize: 13 }}>{loadError}</p>
      ) : (
        <EntriesList entries={entries} />
      )}
    </div>
  );
}
