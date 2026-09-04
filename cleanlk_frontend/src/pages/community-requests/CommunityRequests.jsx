import React, { useState, useEffect } from "react";

// Initial Demo Data
const initialRequests = [
  {
    id: 1,
    name: "Kasun Perera",
    area: "Kegalle",
    requestType: "New Waste Bin",
    priority: "High",
    status: "Pending",
    description: "Requesting a public bin near the central bus stand.",
    createdAt: "2026-09-01"
  },
  {
    id: 2,
    name: "Nimali Silva",
    area: "Colombo",
    requestType: "Extra Collection",
    priority: "Medium",
    status: "Approved",
    description: "Need an additional recycling pickup on weekend.",
    createdAt: "2026-09-02"
  },
  {
    id: 3,
    name: "Sunil Shantha",
    area: "Galle",
    requestType: "Cleanup Request",
    priority: "Low",
    status: "Completed",
    description: "Beach side cleanup drive support needed.",
    createdAt: "2026-09-03"
  }
];

const STORAGE_KEY = "cleanlk_community_requests";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load Initial Data from LocalStorage
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRequests));
      setRequests(initialRequests);
    } else {
      try {
        setRequests(JSON.parse(data));
      } catch {
        setRequests(initialRequests);
      }
    }
  }, []);

  const updateStateAndStorage = (updatedList) => {
    setRequests(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("⚠️ Please enter your name.");
      return;
    }
    if (formData.description.trim().length < 10) {
      setError("⚠️ Description must be at least 10 characters long.");
      return;
    }

    if (editingId) {
      const updated = requests.map((item) =>
        item.id === editingId ? { ...item, ...formData } : item
      );
      updateStateAndStorage(updated);
      setSuccess("✅ Request updated successfully!");
      setEditingId(null);
    } else {
      const newEntry = {
        id: Date.now(),
        ...formData,
        status: "Pending",
        createdAt: new Date().toISOString().split("T")[0]
      };
      updateStateAndStorage([newEntry, ...requests]);
      setSuccess("✅ Request submitted successfully!");
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

  const filteredRequests = requests.filter((item) => {
    const matchesArea = item.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesArea && matchesStatus;
  });

  return (
    <div style={{ maxWidth: "860px", margin: "20px auto", padding: "16px", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ marginBottom: "24px", borderBottom: "2px solid #e5e7eb", paddingBottom: "12px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#1f2937", margin: 0 }}>
          📋 Community Requests & Complaints
        </h1>
        <p style={{ color: "#6b7280", margin: "6px 0 0 0", fontSize: "14px" }}>
          Module M4: Request bins, cleanup drives, or report community needs.
        </p>
      </header>

      {/* FORM */}
      <section style={{ background: "#ffffff", border: "1px solid #d1d5db", borderRadius: "8px", padding: "20px", marginBottom: "30px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#065f46", marginTop: 0 }}>
          {editingId ? "✏️ Edit Community Request" : "➕ Submit a Community Request"}
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
                placeholder="e.g. Kasun"
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
              placeholder="Describe what is needed (at least 10 characters)..."
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              style={{ background: "#059669", color: "#fff", border: "none", padding: "9px 18px", borderRadius: "5px", cursor: "pointer", fontWeight: "600" }}
            >
              {editingId ? "Update Request" : "Submit Request"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: "", area: "Colombo", requestType: "New Waste Bin", priority: "Medium", description: "" });
                }}
                style={{ background: "#6b7280", color: "#fff", border: "none", padding: "9px 14px", borderRadius: "5px", cursor: "pointer" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* SEARCH, FILTER & LIST */}
      <section>
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="🔎 Search by area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 2, padding: "8px 12px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "5px" }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          {filteredRequests.length === 0 ? (
            <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>No requests found matching your filter.</p>
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
    </div>
  );
}