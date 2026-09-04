import React, { useState, useEffect, useCallback } from "react";
import { communityRequestsApi } from "../../utils/api";
import { initialRequests } from "../../data/communityRequests";
import { getStoredRequests, saveRequests } from "../../utils/storage";

export default function CommunityRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    area: "Colombo",
    requestType: "New Waste Bin",
    priority: "Medium",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Fetch Requests from Backend (with fallback to storage)
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await communityRequestsApi.getAll();
      if (res && res.success && Array.isArray(res.data)) {
        setRequests(res.data);
        saveRequests(res.data);
        setIsBackendConnected(true);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("Backend unavailable, loading local storage fallback:", err.message);
      setIsBackendConnected(false);
      const localData = getStoredRequests(initialRequests);
      setRequests(localData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateStateAndStorage = (updatedList) => {
    setRequests(updatedList);
    saveRequests(updatedList);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("⚠️ Please enter your full name.");
      return;
    }
    if (formData.description.trim().length < 10) {
      setError("⚠️ Description must be at least 10 characters long.");
      return;
    }

    try {
      if (editingId) {
        if (isBackendConnected) {
          const res = await communityRequestsApi.update(editingId, formData);
          setRequests((prev) =>
            prev.map((item) => (item.id === editingId ? res.data : item))
          );
        } else {
          const updated = requests.map((item) =>
            item.id === editingId ? { ...item, ...formData } : item
          );
          updateStateAndStorage(updated);
        }
        setSuccess("✅ Community request updated successfully!");
        setEditingId(null);
      } else {
        if (isBackendConnected) {
          const res = await communityRequestsApi.create(formData);
          setRequests((prev) => [res.data, ...prev]);
        } else {
          const newEntry = {
            id: `CR-${Date.now().toString().slice(-4)}`,
            ...formData,
            status: "Pending",
            createdAt: new Date().toISOString().split("T")[0],
          };
          updateStateAndStorage([newEntry, ...requests]);
        }
        setSuccess("✅ Community request submitted successfully!");
      }

      setFormData({
        name: "",
        area: "Colombo",
        requestType: "New Waste Bin",
        priority: "Medium",
        description: "",
      });
      setTimeout(() => setSuccess(""), 3500);
    } catch (err) {
      setError(`⚠️ ${err.message || "Failed to submit request"}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this community request?")) {
      try {
        if (isBackendConnected) {
          await communityRequestsApi.delete(id);
        }
        const updated = requests.filter((item) => item.id !== id);
        updateStateAndStorage(updated);
        setSuccess("🗑️ Community request deleted successfully.");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(`⚠️ ${err.message || "Failed to delete request"}`);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      area: item.area,
      requestType: item.requestType,
      priority: item.priority,
      description: item.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (isBackendConnected) {
        const res = await communityRequestsApi.updateStatus(id, newStatus);
        setRequests((prev) =>
          prev.map((item) => (item.id === id ? res.data : item))
        );
      } else {
        const updated = requests.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        updateStateAndStorage(updated);
      }
      setSuccess(`✅ Status updated to '${newStatus}'!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`⚠️ ${err.message || "Failed to update status"}`);
    }
  };

  // Dashboard Stats
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "Pending").length,
    inReview: requests.filter((r) => r.status === "Under Review").length,
    approved: requests.filter((r) => r.status === "Approved").length,
    completed: requests.filter((r) => r.status === "Completed").length,
  };

  // Search & Filters
  const filteredRequests = requests.filter((item) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesArea =
      !query ||
      item.area?.toLowerCase().includes(query) ||
      item.name?.toLowerCase().includes(query) ||
      item.requestType?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;

    return matchesArea && matchesStatus && matchesPriority;
  });

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", padding: "16px", fontFamily: "system-ui, sans-serif" }}>
      {/* HEADER */}
      <header style={{ marginBottom: "20px", borderBottom: "2px solid #e5e7eb", paddingBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", margin: 0 }}>
              📋 Community Requests & Services (M4)
            </h1>
            <p style={{ color: "#4b5563", marginTop: "6px", fontSize: "14px" }}>
              Request bins, extra collections, or cleanup drives across Sri Lankan municipal areas.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", background: isBackendConnected ? "#ecfdf5" : "#fef3c7", color: isBackendConnected ? "#065f46" : "#92400e", padding: "5px 12px", borderRadius: "9999px", border: `1px solid ${isBackendConnected ? '#a7f3d0' : '#fde68a'}` }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isBackendConnected ? "#10b981" : "#f59e0b", display: "inline-block" }}></span>
            <strong>{isBackendConnected ? "Neon DB Connected" : "Local Mode"}</strong>
          </div>
        </div>
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

      {/* CREATE & EDIT FORM */}
      <section style={{ background: "#ffffff", border: "1px solid #d1d5db", borderRadius: "8px", padding: "20px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#065f46", marginTop: 0 }}>
          {editingId ? "✏️ Edit Request" : "➕ Submit New Community Request"}
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
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", background: "#fff" }}
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
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", background: "#fff" }}
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
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", background: "#fff" }}
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
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: "", area: "Colombo", requestType: "New Waste Bin", priority: "Medium", description: "" });
                }}
                style={{ background: "#6b7280", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "5px", cursor: "pointer" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* SEARCH, FILTER & LIST */}
      <section>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="🔎 Search by area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "5px", background: "#fff" }}
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
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "5px", background: "#fff" }}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {loading ? (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>Loading requests...</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {filteredRequests.length === 0 ? (
              <p style={{ color: "#6b7280", textAlign: "center", padding: "20px", background: "#f9fafb", borderRadius: "6px" }}>
                No community requests found matching criteria.
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
                        style={{ fontSize: "12px", padding: "4px 8px", borderRadius: "4px", border: "1px solid #d1d5db", background: "#fff" }}
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
        )}
      </section>
    </div>
  );
}