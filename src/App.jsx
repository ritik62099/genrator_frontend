import { useEffect, useState } from "react";
import AddEntry from "./components/AddEntry";
import EntriesList from "./components/EntriesList";

const API_BASE_URL = "https://genrator-api.onrender.com";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);

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
    setEntries((prev) => [newEntry, ...prev]);
  }

  // Edit button click
  function handleEdit(entry) {
    setEditingEntry(entry);
  }

  // AddEntry me update hone ke baad
  function handleUpdate(updatedEntry) {
    setEntries((prev) =>
      prev.map((e) =>
        (e._id || e.id) === (updatedEntry._id || updatedEntry.id)
          ? updatedEntry
          : e
      )
    );
  }

  function clearEditing() {
    setEditingEntry(null);
  }

  // Delete
  async function handleDelete(id) {
    const confirmed = window.confirm("Pakka delete karna chahte ho?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/entries/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Delete nahi ho paaya.");
        return;
      }

      setEntries((prev) => prev.filter((e) => (e._id || e.id) !== id));

      if (editingEntry && (editingEntry._id || editingEntry.id) === id) {
        setEditingEntry(null);
      }
    } catch (err) {
      console.error(err);
      alert("Backend se connect nahi ho paaya.");
    }
  }

  return (
    <div className="app-container">
      <AddEntry
        onAdd={addEntry}
        onUpdate={handleUpdate}
        editingEntry={editingEntry}
        clearEditing={clearEditing}
      />

      <h2>Saved Entries (MongoDB)</h2>

      {loading ? (
        <p>Loading entries...</p>
      ) : loadError ? (
        <p style={{ color: "red", fontSize: 13 }}>{loadError}</p>
      ) : (
        <EntriesList
          entries={entries}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
