import React from "react";

export default function CommunityRequestForm({
  formData,
  handleInputChange,
  handleSubmit,
  editingId,
  onCancel,
  error,
  success
}) {
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
            placeholder="Detail your request (minimum 10 characters)..."
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
          />
        </div>

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