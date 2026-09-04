import React from "react";

export default function CommunityRequestDetails({ request, onClose }) {
  if (!request) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "500px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, color: "#111827" }}>
            📋 Request Details #{request.id.toString().slice(-4)}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#6b7280" }}
          >
            ✕
          </button>
        </div>

        <div style={{ margin: "16px 0", display: "grid", gap: "10px", fontSize: "14px" }}>
          <p><strong>Resident Name:</strong> {request.name}</p>
          <p><strong>Area:</strong> 📍 {request.area}</p>
          <p><strong>Request Type:</strong> {request.requestType}</p>
          <p><strong>Priority:</strong> {request.priority}</p>
          <p><strong>Current Status:</strong> <span style={{ padding: "2px 8px", background: "#d1fae5", color: "#065f46", borderRadius: "4px", fontWeight: "600" }}>{request.status}</span></p>
          <p><strong>Date Submitted:</strong> {request.createdAt}</p>
          <div style={{ background: "#f9fafb", padding: "10px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
            <strong>Description:</strong>
            <p style={{ margin: "6px 0 0 0", color: "#4b5563" }}>{request.description}</p>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{ background: "#059669", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}