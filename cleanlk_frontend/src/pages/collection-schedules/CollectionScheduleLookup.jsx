import React, { useState } from "react";

const publicSchedules = [
  { area: "Colombo", wasteType: "Household Waste", day: "Monday", time: "8:00 AM – 11:00 AM", location: "Colombo Municipal Area" },
  { area: "Colombo", wasteType: "Recyclable", day: "Wednesday", time: "9:00 AM – 12:00 PM", location: "Colombo North & Central" },
  { area: "Kandy", wasteType: "Household Waste", day: "Tuesday", time: "7:00 AM – 10:00 AM", location: "Kandy Town & Suburbs" },
  { area: "Kegalle", wasteType: "Household Waste", day: "Thursday", time: "8:00 AM – 11:00 AM", location: "Kegalle Town Limits" },
  { area: "Gampaha", wasteType: "Household Waste", day: "Friday", time: "8:00 AM – 11:00 AM", location: "Gampaha MC Area" },
  { area: "Galle", wasteType: "Household Waste", day: "Saturday", time: "7:00 AM – 10:00 AM", location: "Galle Coastal & Fort Area" }
];

export default function CollectionScheduleLookup() {
  const [selectedArea, setSelectedArea] = useState("Colombo");
  const [selectedType, setSelectedType] = useState("Household Waste");
  const [result, setResult] = useState(publicSchedules[0]);

  const handleLookup = () => {
    const matched = publicSchedules.find(
      (s) => s.area === selectedArea && s.wasteType === selectedType
    );
    setResult(matched || null);
  };

  return (
    <div style={{ background: "#ffffff", border: "1px solid #d1d5db", borderRadius: "8px", padding: "20px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#065f46", marginTop: 0 }}>
        🗓️ Public Waste Collection Schedule Lookup
      </h2>
      <p style={{ fontSize: "13px", color: "#4b5563", marginBottom: "14px" }}>
        Find your local municipal garbage collection times across Sri Lanka.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "10px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Select Area</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option>Colombo</option>
            <option>Kandy</option>
            <option>Kegalle</option>
            <option>Gampaha</option>
            <option>Galle</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Waste Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option>Household Waste</option>
            <option>Recyclable</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={handleLookup}
            style={{ background: "#059669", color: "#fff", border: "none", padding: "9px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
          >
            Check Schedule
          </button>
        </div>
      </div>

      <div style={{ marginTop: "14px", padding: "12px", background: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
        {result ? (
          <div>
            <span style={{ fontSize: "15px", fontWeight: "bold", color: "#065f46" }}>{result.area} — {result.wasteType}</span>
            <div style={{ fontSize: "13px", color: "#374151", marginTop: "4px" }}>
              <span>📅 Day: <strong>{result.day}</strong></span> | <span>🕘 Time: <strong>{result.time}</strong></span>
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>📍 {result.location}</div>
          </div>
        ) : (
          <div style={{ color: "#6b7280", fontSize: "13px" }}>No schedule found for this combination.</div>
        )}
      </div>
    </div>
  );
}