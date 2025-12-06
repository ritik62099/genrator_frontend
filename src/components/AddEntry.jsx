

// // frontend/src/components/AddEntry.jsx
// import { useEffect, useState } from "react";
// import { calculateGeneratorDiff } from "../utils/timeUtils";

// const API_BASE_URL = "https://genrator-api.onrender.com";

// export default function AddEntry({ onAdd, onUpdate, editingEntry, clearEditing }) {
//   const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

//   const [startHour, setStartHour] = useState("");
//   const [startMinute, setStartMinute] = useState("");
//   const [endHour, setEndHour] = useState("");
//   const [endMinute, setEndMinute] = useState("");

//   const [closed, setClosed] = useState(false);  // 🔥 new field
//   const [error, setError] = useState("");
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (editingEntry) {
//       setDate(editingEntry.date);
//       setStartHour(editingEntry.startHour ?? "");
//       setStartMinute(editingEntry.startMinute ?? "");
//       setEndHour(editingEntry.endHour ?? "");
//       setEndMinute(editingEntry.endMinute ?? "");
//       setClosed(editingEntry.closed || false);
//     } else {
//       setDate(new Date().toISOString().slice(0, 10));
//       setStartHour("");
//       setStartMinute("");
//       setEndHour("");
//       setEndMinute("");
//       setClosed(false);
//     }
//   }, [editingEntry]);

//   const diff = !closed ? calculateGeneratorDiff(startHour, startMinute, endHour, endMinute) : null;

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");

//     // 🔥 Closed Entry — no start/end needed
//     if (closed) {
//       return saveEntry({
//         date,
//         startHour: 0,
//         startMinute: 0,
//         endHour: 0,
//         endMinute: 0,
//         totalMinutes: 0,
//         closed: true
//       });
//     }

//     if (!date || !startHour || !startMinute || !endHour || !endMinute) {
//       setError("Fields bharo ya Close button use karo.");
//       return;
//     }

//     if (!diff) {
//       setError("End reading, start se bada hona chahiye.");
//       return;
//     }

//     saveEntry({
//       date,
//       startHour: Number(startHour),
//       startMinute: Number(startMinute),
//       endHour: Number(endHour),
//       endMinute: Number(endMinute),
//       closed: false
//     });
//   }

//   async function saveEntry(payload) {
//     try {
//       setSaving(true);

//       const id = editingEntry?._id || editingEntry?.id;
//       const method = editingEntry ? "PUT" : "POST";
//       const url = editingEntry ? `${API_BASE_URL}/api/entries/${id}` : `${API_BASE_URL}/api/entries`;

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (!res.ok) return setError(data.error || "Failed!");

//       editingEntry ? onUpdate(data) : onAdd(data);
//       clearEditing();

//     } catch (err) {
//       setError("Server error.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div style={{ maxWidth: 600, margin: "0 auto 24px", padding: 16, borderRadius: 12,
//                   background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
      
//       <h1 style={{ textAlign:"center", marginBottom:8 }}>Generator Time Calculator</h1>

//       {/* 🔥 Close Toggle */}
//       <label style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
//         <input type="checkbox" checked={closed} onChange={(e) => setClosed(e.target.checked)} />
//         <b>Generator OFF / CLOSED (In this day not running)</b>
//       </label>

//       <form onSubmit={handleSubmit} style={{ display:"grid", gap:12 }}>
        
//         <label>
//           <span>Date</span>
//           <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
//         </label>

//         {/* Disable fields if closed */}
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
//           <input disabled={closed} type="number" placeholder="Start H"
//             value={startHour} onChange={e=>setStartHour(e.target.value)} />
//           <input disabled={closed} type="number" placeholder="Start M"
//             value={startMinute} onChange={e=>setStartMinute(e.target.value)} />

//           <input disabled={closed} type="number" placeholder="End H"
//             value={endHour} onChange={e=>setEndHour(e.target.value)} />
//           <input disabled={closed} type="number" placeholder="End M"
//             value={endMinute} onChange={e=>setEndMinute(e.target.value)} />
//         </div>

//         {diff && !closed && (
//           <div style={{ padding:8, background:"#e3ffe8", borderRadius:6 }}>
//             <b>Total: {diff.hours} H {diff.minutes} M ({diff.totalMinutes} Min)</b>
//           </div>
//         )}

//         {closed && (
//           <div style={{ padding:8, background:"#ffe3e3", borderRadius:6 }}>
//             <b>Generator Closed — Total = 0 Min</b>
//           </div>
//         )}

//         <button type="submit" style={{ padding:"10px", fontWeight:600 }}>
//           {saving ? "Saving..." :
//            editingEntry ? "Update Entry" :
//            closed ? "Save as Closed" : "Add Entry"}
//         </button>

//         {editingEntry && <button onClick={clearEditing}>Cancel</button>}
//       </form>
//     </div>
//   );
// }

// frontend/src/components/AddEntry.jsx
import { useEffect, useState } from "react";
import { calculateGeneratorDiff } from "../utils/timeUtils";

const API_BASE_URL = "https://genrator-api.onrender.com";

export default function AddEntry({ onAdd, onUpdate, editingEntry, clearEditing }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");

  const [closed, setClosed] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date);
      setStartHour(editingEntry.startHour ?? "");
      setStartMinute(editingEntry.startMinute ?? "");
      setEndHour(editingEntry.endHour ?? "");
      setEndMinute(editingEntry.endMinute ?? "");
      setClosed(editingEntry.closed || false);
    } else {
      setDate(new Date().toISOString().slice(0, 10));
      setStartHour("");
      setStartMinute("");
      setEndHour("");
      setEndMinute("");
      setClosed(false);
    }
  }, [editingEntry]);

  const diff = !closed ? calculateGeneratorDiff(startHour, startMinute, endHour, endMinute) : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (closed) {
      return saveEntry({
        date,
        startHour: 0,
        startMinute: 0,
        endHour: 0,
        endMinute: 0,
        totalMinutes: 0,
        closed: true
      });
    }

    if (!startHour || !startMinute || !endHour || !endMinute) {
      return setError("Fields bharo ya Closed select karo.");
    }

    if (!diff) return setError("End reading start se bada hona chahiye.");

    saveEntry({
      date,
      startHour: Number(startHour),
      startMinute: Number(startMinute),
      endHour: Number(endHour),
      endMinute: Number(endMinute),
      closed: false
    });
  }

  async function saveEntry(payload) {
    try {
      setSaving(true);

      const id = editingEntry?._id;
      const method = editingEntry ? "PUT" : "POST";
      const url = editingEntry ? `${API_BASE_URL}/api/entries/${id}` : `${API_BASE_URL}/api/entries`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed!");

      editingEntry ? onUpdate(data) : onAdd(data);
      clearEditing();

    } catch {
      setError("Server Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      maxWidth: 650,
      width: "95%",
      margin: "20px auto",
      padding: 20,
      borderRadius: 12,
      background: "#fff",
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
    }}>

      <h1 style={{ textAlign:"center", fontSize:22, marginBottom:10 }}>Generator Time Calculator</h1>

      {/* Closed Toggle */}
      <label style={{
        display:"flex",
        alignItems:"center",
        gap:10,
        fontWeight:600,
        fontSize:14,
        marginBottom:14
      }}>
        <input type="checkbox" checked={closed} onChange={e=>setClosed(e.target.checked)} />
        Generator OFF / CLOSED (Today Not Running)
      </label>

      <form onSubmit={handleSubmit}>

        <label style={{ display:"flex", flexDirection:"column", fontWeight:600, fontSize:14 }}>
          Date:
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            style={{ padding:8, marginTop:4, borderRadius:6, border:"1px solid #ccc" }} />
        </label>

        {/* 🔥 Responsive Input Grid */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(130px,1fr))",
          gap:12,
          marginTop:15
        }}>
          <input disabled={closed} type="number" placeholder="Start Hour"
            value={startHour} onChange={e=>setStartHour(e.target.value)}
            style={inputBox} />

          <input disabled={closed} type="number" placeholder="Start Min"
            value={startMinute} onChange={e=>setStartMinute(e.target.value)}
            style={inputBox} />

          <input disabled={closed} type="number" placeholder="End Hour"
            value={endHour} onChange={e=>setEndHour(e.target.value)}
            style={inputBox} />

          <input disabled={closed} type="number" placeholder="End Min"
            value={endMinute} onChange={e=>setEndMinute(e.target.value)}
            style={inputBox} />
        </div>

        {/* Output Display */}
        {diff && !closed && (
          <div style={boxGreen}>Total: <b>{diff.hours}H {diff.minutes}M ({diff.totalMinutes} Min)</b></div>
        )}

        {closed && <div style={boxRed}><b>Generator Closed — Total = 0</b></div>}

        {error && <p style={{ color:"red", marginTop:10 }}>{error}</p>}

        <button type="submit" style={mainBtn}>
          {saving ? "Saving..." : editingEntry ? "Update Entry" : closed ? "Mark Closed" : "Add Entry"}
        </button>

        {editingEntry && <button onClick={clearEditing} style={cancelBtn}>Cancel</button>}
      </form>
    </div>
  );
}


/* 🔥 Reusable Styles */
const inputBox = {
  padding:"10px",
  borderRadius:"6px",
  border:"1px solid #ccc"
};

const boxGreen = {
  marginTop:12,
  padding:10,
  borderRadius:6,
  background:"#d9ffdc",
  border:"1px solid #8cf799"
};

const boxRed = {
  marginTop:12,
  padding:10,
  borderRadius:6,
  background:"#ffd8d8",
  border:"1px solid #ff8a8a"
};

const mainBtn = {
  width:"100%",
  padding:"12px",
  marginTop:14,
  background:"#2563eb",
  color:"#fff",
  border:"none",
  fontSize:16,
  fontWeight:600,
  borderRadius:8,
  cursor:"pointer"
};

const cancelBtn = {
  width:"100%",
  padding:"10px",
  marginTop:8,
  background:"#fff",
  border:"1px solid #bbb",
  borderRadius:8,
  fontWeight:600,
  cursor:"pointer"
};
