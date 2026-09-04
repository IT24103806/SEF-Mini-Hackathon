import React from "react";

export default function CommunityRequestAnalytics({ requests }) {
  const total = requests.length;
  if (total === 0) return null;

  // Area-wise breakdown calculation
  const areaCounts = requests.reduce((acc, curr) => {
    acc[curr.area] = (acc[curr.area] || 0) + 1;
    return acc;
  }, {});

  // High priority count
  const highPriorityCount = requests.filter((r) => r.priority === "High").length;
  const highPercentage = Math.round((highPriorityCount / total) * 100);

  // Find top area
  let topArea = "None";
  let maxCount = 0;
  Object.entries(areaCounts).forEach(([area, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topArea = area;
    }
  });

  return (
    <div style={{
      background: "#f8fafc",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      padding: "16px 20px",
      marginBottom: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
    }}>
      <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: "0 0 12px 0" }}>
        📊 Municipal Resource Insights & Analytics
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Top Demanded Area Card */}
        <div style={{ background: "#fff", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Highest Activity Area</div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginTop: "4px" }}>
            📍 {topArea} <span style={{ fontSize: "13px", color: "#059669", fontWeight: "normal" }}>({maxCount} requests)</span>
          </div>
        </div>

        {/* High Priority Urgency Ratio */}
        <div style={{ background: "#fff", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>High Priority Urgency Rate</div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#dc2626", marginTop: "4px" }}>
            🚨 {highPercentage}% <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "normal" }}>of total workload</span>
          </div>
        </div>
      </div>
    </div>
  );
}