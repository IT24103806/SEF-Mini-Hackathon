import React, { useState } from "react";

const schedulesData = [
  { area: "Colombo", wasteType: "Household Waste", day: "Monday", time: "8:00 AM – 11:00 AM", location: "Colombo Municipal Area" },
  { area: "Colombo", wasteType: "Recyclable", day: "Wednesday", time: "9:00 AM – 12:00 PM", location: "Colombo North & Central" },
  { area: "Kandy", wasteType: "Household Waste", day: "Tuesday", time: "7:00 AM – 10:00 AM", location: "Kandy Town & Suburbs" },
  { area: "Kegalle", wasteType: "Household Waste", day: "Thursday", time: "8:00 AM – 11:00 AM", location: "Kegalle Main Road Areas" },
  { area: "Gampaha", wasteType: "Household Waste", day: "Friday", time: "8:00 AM – 11:00 AM", location: "Gampaha MC Limits" },
  { area: "Galle", wasteType: "Household Waste", day: "Saturday", time: "7:00 AM – 10:00 AM", location: "Galle Fort & Coastal Zone" }
];

export default function CollectionSchedule() {
  const [selectedArea, setSelectedArea] = useState("Colombo");
  const [selectedType, setSelectedType] = useState("Household Waste");
  const [result, setResult] = useState(schedulesData[0]);

  const handleCheck = () => {
    const found = schedulesData.find(
      (s) => s.area === selectedArea && s.wasteType === selectedType
    );
    setResult(found || null);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", padding: "16px", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
        🗓️ Waste Collection Schedule Lookup
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "10px", background: "#f3f4f6", padding: "16px", borderRadius: "8px" }}>
        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>Select Area</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option>Colombo</option>
            <option>Kandy</option>
            <option>Kegalle</option>
            <option>Gampaha</option>
            <option>Galle</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: "12px", fontWeight: "bold" }}>Waste Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option>Household Waste</option>
            <option>Recyclable</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={handleCheck}
            style={{ background: "#059669", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
          >
            Check
          </button>
        </div>
      </div>

      <div style={{ marginTop: "20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px" }}>
        {result ? (
          <div>
            <h3 style={{ margin: 0, color: "#065f46" }}>{result.area} — {result.wasteType}</h3>
            <p style={{ margin: "8px 0", fontSize: "15px" }}>📅 Next Collection: <strong>{result.day}</strong></p>
            <p style={{ margin: "4px 0", color: "#4b5563" }}>🕘 Time: <strong>{result.time}</strong></p>
            <p style={{ margin: "4px 0", color: "#6b7280", fontSize: "13px" }}>📍 Area Coverage: {result.location}</p>
          </div>
        ) : (
          <p style={{ color: "#9ca3af" }}>No routine schedule found for the selected options.</p>
        )}
      </div>
    </div>
  );
}