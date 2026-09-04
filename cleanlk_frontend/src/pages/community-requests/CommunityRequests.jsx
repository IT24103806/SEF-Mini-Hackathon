import React, { useState, useEffect } from "react";
import { initialRequests } from "../../data/communityRequests";
import { getStoredRequests, saveRequests } from "../../utils/storage";
import { validateCommunityRequest } from "../../utils/validation";
import CommunityRequestForm from "./CommunityRequestForm";
import CommunityRequestDetails from "./CommunityRequestDetails";
import CollectionScheduleLookup from "../collection-schedules/CollectionScheduleLookup";

export default function CommunityRequests() {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    area: "Colombo",
    requestType: "New Waste Bin",
    priority: "Medium",
    description: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setRequests(getStoredRequests(initialRequests));
  }, []);

  const updateStateAndStorage = (updatedList) => {
    setRequests(updatedList);
    saveRequests(updatedList);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateCommunityRequest(formData);
    if (!validation.isValid) {
      setError(validation.errors.name || validation.errors.description);
      return;
    }

    if (editingId) {
      const updated = requests.map((item) =>
        item.id === editingId ? { ...item, ...formData } : item
      );
      updateStateAndStorage(updated);
      setSuccess("✅ Community request updated successfully!");
      setEditingId(null);
    } else {
      const newEntry = {
        id: Date.now(),
        ...formData,
        status: "Pending",
        createdAt: new Date().toISOString().split("T")[0]
      };
      updateStateAndStorage([newEntry, ...requests]);
      setSuccess("✅ Community request submitted successfully!");
    }

    setFormData({
      name: "",
      area: "Colombo",
      requestType: "New Waste Bin",
      priority: "Medium",
      description: ""
    });
    setError("");
    setTimeout(() => setSuccess(""), 3500);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      const updated = requests.filter((item) => item.id !== id);
      updateStateAndStorage(updated);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      area: item.area,
      requestType: item.requestType,
      priority: item.priority,
      description: item.description
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = requests.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    updateStateAndStorage(updated);
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "Pending").length,
    inReview: requests.filter((r) => r.status === "Under Review").length,
    approved: requests.filter((r) => r.status === "Approved").length,
    completed: requests.filter((r) => r.status === "Completed").length
  };

  const filteredRequests = requests.filter((item) => {
    const matchesArea = item.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;
    return matchesArea && matchesStatus && matchesPriority;
  });

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", padding: "16px", fontFamily: "system-ui, sans-serif" }}>
      {/* IN-APP PROBLEM & SOLUTION STATEMENT (Assignment Rubric Requirement 2) */}
      <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, color: "#065f46", fontSize: "16px", fontWeight: "bold" }}>🇱🇰 Solving Sri Lanka's Municipal Waste Crisis</h3>
        <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#047857", lineHeight: "1.4" }}>
          In many Sri Lankan councils, irregular garbage truck collection and severe public bin shortages lead to illegal roadside dumping. <strong>CleanLK Community Services (M4)</strong> bridges the citizen-authority gap by enabling direct requests for new bins, extra collections, and real-time municipal tracking.
        </p>
      </div>

      <header style={{ marginBottom: "20px", borderBottom: "2px solid #e5e7eb", paddingBottom: "12px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: 0 }}>
          📋 Community Requests & Services (M4)
        </h1>
        <p style={{ color: "#4b5563", marginTop: "6px", fontSize: "14px" }}>
          Citizen service requests, municipal tracking, and public waste schedules.
        </p>
      </header>

      {/* DASHBOARD STATS */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "24px" }}>
        <div style={{ background: "#f3f4f6", padding: "12px", borderRadius: "8px", textAlign: "center", border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: "12px", color: "#4b5563", fontWeight: "600" }}>Total Requests</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#111827" }}>{stats.total}</div>
        </div>
        <div style={{ background: "#fef3c7", padding: "12px", borderRadius: "8px", textAlign: "center", border: "1px solid #fde68a" }}>
          <div style={{ fontSize: "12px", color: "#92400e", fontWeight: "600" }}>Pending</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#b45309" }}>{stats.pending}</div>
        </div>
        <div style={{ background: "#e0e7ff", padding: "12px", borderRadius: "8px", textAlign: "center", border: "1px solid #c7d2fe" }}>
          <div style={{ fontSize: "12px", color: "#3730a3", fontWeight: "600" }}>Under Review</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#4338ca" }}>{stats.inReview}</div>
        </div>
        <div style={{ background: "#dbeafe", padding: "12px", borderRadius: "8px", textAlign: "center", border: "1px solid #bfdbfe" }}>
          <div style={{ fontSize: "12px", color: "#1e40af", fontWeight: "600" }}>Approved</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#1d4ed8" }}>{stats.approved}</div>
        </div>
        <div style={{ background: "#dcfce7", padding: "12px", borderRadius: "8px", textAlign: "center", border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: "12px", color: "#166534", fontWeight: "600" }}>Completed</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#15803d" }}>{stats.completed}</div>
        </div>
      </section>

      {/* SCHEDULE LOOKUP */}
      <CollectionScheduleLookup />

      {/* MODULAR FORM COMPONENT */}
      <CommunityRequestForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        editingId={editingId}
        onCancel={() => {
          setEditingId(null);
          setFormData({ name: "", area: "Colombo", requestType: "New Waste Bin", priority: "Medium", description: "" });
        }}
        error={error}
        success={success}
      />

      {/* FILTER & LIST */}
      <section>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="🔎 Search by area (e.g. Kegalle)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "5px" }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "5px" }}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          {filteredRequests.length === 0 ? (
            <p style={{ color: "#6b7280", textAlign: "center", padding: "20px", background: "#f9fafb", borderRadius: "6px" }}>
              No requests found matching criteria.
            </p>
          ) : (
            filteredRequests.map((item) => (
              <div
                key={item.id}
                style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ background: "#ecfdf5", color: "#065f46", fontSize: "12px", fontWeight: "600", padding: "3px 8px", borderRadius: "4px" }}>
                    {item.requestType}
                  </span>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>{item.createdAt}</span>
                </div>

                <h3 style={{ fontSize: "16px", margin: "8px 0 4px 0", color: "#111827" }}>📍 {item.area}</h3>
                <p style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 10px 0" }}>{item.description}</p>

                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "12px" }}>
                  <span>Requested By: <strong>{item.name}</strong></span> | <span>Priority: <strong>{item.priority}</strong></span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f3f4f6", paddingTop: "10px" }}>
                  <div>
                    <label style={{ fontSize: "12px", marginRight: "6px", color: "#374151" }}>Status:</label>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      style={{ fontSize: "12px", padding: "4px 8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setSelectedRequest(item)}
                      style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{ background: "#f59e0b", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ background: "#ef4444", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODULAR DETAILS MODAL */}
      <CommunityRequestDetails
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
}