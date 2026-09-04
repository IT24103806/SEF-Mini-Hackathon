import React, { useMemo } from "react";

export default function CommunityRequestForm({
  formData,
  handleInputChange,
  handleSubmit,
  editingId,
  onCancel,
  error,
  success
}) {
  const smartAnalysis = useMemo(() => {
    const text = (formData.description || "").toLowerCase();

    if (
      text.includes("hospital") ||
      text.includes("school") ||
      text.includes("drain") ||
      text.includes("severe") ||
      text.includes("disease") ||
      text.includes("overflowing") ||
      text.includes("smell") ||
      text.includes("danger")
    ) {
      return {
        suggestedPriority: "High",
        badgeColor: "#fee2e2",
        textColor: "#991b1b",
        borderColor: "#f87171",
        reason: "🚨 Critical health hazard or sensitive public location (school/hospital) detected.",
        sla: "Immediate Municipal Action Required (24 Hours)"
      };
    }

    if (
      text.includes("bin") ||
      text.includes("market") ||
      text.includes("weekly") ||
      text.includes("extra") ||
      text.includes("collection")
    ) {
      return {
        suggestedPriority: "Medium",
        badgeColor: "#fef3c7",
        textColor: "#92400e",
        borderColor: "#f6ad55",
        reason: "⚠️ Standard community service or bin collection requirement.",
        sla: "Scheduled Pickup within 48–72 Hours"
      };
    }

    return {
      suggestedPriority: "Low",
      badgeColor: "#e0e7ff",
      textColor: "#3730a3",
      borderColor: "#818cf8",
      reason: "ℹ️ General community cleanup drive or non-urgent inquiry.",
      sla: "Routine Municipal Scheduling"
    };
  }, [formData.description]);

  return (
    <section style={{ background: "#ffffff", border: "1px solid #d1d5db", borderRadius: "8px", padding: "20px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#065f46", marginTop: 0 }}>
        {editingId ? "✏️ Edit Community Request" : "➕ Submit New Community Request"}
      </h2>

      {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px", borderRadius: "6px", marginBottom: "12px", fontSize: "14px" }}>{error}</div>}
      {success && <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px", borderRadius: "6px", marginBottom: "12px", fontSize: "14px" }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Dinelka Perera"
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Area *</label>
            <select
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
            >
              <option>Colombo</option>
              <option>Kandy</option>
              <option>Kegalle</option>
              <option>Gampaha</option>
              <option>Galle</option>
              <option>Kurunegala</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Request Type *</label>
            <select
              name="requestType"
              value={formData.requestType}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
            >
              <option>New Waste Bin</option>
              <option>Extra Collection</option>
              <option>Cleanup Request</option>
              <option>Missing Collection Point</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Priority *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Description *</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Detail your request (e.g. Severe odor and overflowing bins near school premises)..."
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
          />
        </div>

        {formData.description.trim().length >= 5 && (
          <div style={{ background: "#f8fafc", border: `1px dashed ${smartAnalysis.borderColor}`, borderRadius: "6px", padding: "12px 14px", fontSize: "13px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "600", color: "#334155" }}>🤖 Smart AI Urgency Analyzer:</span>
              <span style={{ background: smartAnalysis.badgeColor, color: smartAnalysis.textColor, padding: "3px 10px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px" }}>
                {smartAnalysis.suggestedPriority} Urgency Detected
              </span>
            </div>
            <p style={{ margin: "6px 0 2px 0", color: "#475569", fontSize: "12px" }}>
              {smartAnalysis.reason}
            </p>
            <p style={{ margin: 0, color: "#059669", fontSize: "11px", fontWeight: "600" }}>
              ⏱️ Expected SLA: {smartAnalysis.sla}
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{ background: "#059669", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "5px", cursor: "pointer", fontWeight: "600" }}
          >
            {editingId ? "Update Request" : "Submit Request"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              style={{ background: "#6b7280", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "5px", cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}