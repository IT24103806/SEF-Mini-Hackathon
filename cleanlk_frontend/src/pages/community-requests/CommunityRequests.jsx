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
      const res = await communityRequestsApi.getAll({
        area: searchTerm ? undefined : undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
        priority: priorityFilter !== "All" ? priorityFilter : undefined,
      });

      if (res && res.success && Array.isArray(res.data)) {
        setRequests(res.data);
        saveRequests(res.data);
        setIsBackendConnected(true);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("Backend unavailable, loading cached/local data:", err.message);
      setIsBackendConnected(false);
      const localData = getStoredRequests(initialRequests);
      setRequests(localData);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("⚠️ Please enter your name.");
      return;
    }
    if (formData.description.trim().length < 10) {
      setError("⚠️ Description must be at least 10 characters long.");
      return;
    }

    try {
      if (editingId) {
        // Edit flow
        if (isBackendConnected) {
          const res = await communityRequestsApi.update(editingId, formData);
          setRequests((prev) =>
            prev.map((item) => (item.id === editingId ? res.data : item))
          );
        } else {
          const updated = requests.map((item) =>
            item.id === editingId ? { ...item, ...formData } : item
          );
          setRequests(updated);
          saveRequests(updated);
        }
        setSuccess("✅ Request updated successfully in database!");
        setEditingId(null);
      } else {
        // Create flow
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
          const updated = [newEntry, ...requests];
          setRequests(updated);
          saveRequests(updated);
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
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(`⚠️ ${err.message || "Failed to submit request"}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this community request?")) {
      return;
    }

    try {
      if (isBackendConnected) {
        await communityRequestsApi.delete(id);
      }
      const updated = requests.filter((item) => item.id !== id);
      setRequests(updated);
      saveRequests(updated);
      setSuccess("🗑️ Request deleted successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`⚠️ ${err.message || "Failed to delete request"}`);
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
        setRequests(updated);
        saveRequests(updated);
      }
      setSuccess(`✅ Status updated to '${newStatus}'!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`⚠️ ${err.message || "Failed to update status"}`);
    }
  };

  // Client-side filtering for fast interactive search
  const filteredRequests = requests.filter((item) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.area?.toLowerCase().includes(query) ||
      item.name?.toLowerCase().includes(query) ||
      item.requestType?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityBadgeStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return { background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca" };
      case "medium":
        return { background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" };
      case "low":
      default:
        return { background: "#e0f2fe", color: "#075985", border: "1px solid #bae6fd" };
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return { background: "#d1fae5", color: "#065f46" };
      case "approved":
        return { background: "#dbeafe", color: "#1e40af" };
      case "under review":
        return { background: "#fef3c7", color: "#92400e" };
      case "pending":
      default:
        return { background: "#f3f4f6", color: "#374151" };
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "24px auto", padding: "16px 20px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <header style={{ marginBottom: "24px", borderBottom: "2px solid #e5e7eb", paddingBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#111827", margin: 0 }}>
              📋 Community Requests & Complaints
            </h1>
            <p style={{ color: "#4b5563", margin: "6px 0 0 0", fontSize: "14px" }}>
              Request new bins, extra pickups, and organize local community cleanups across Sri Lanka.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", background: isBackendConnected ? "#ecfdf5" : "#fef3c7", color: isBackendConnected ? "#065f46" : "#92400e", padding: "6px 12px", borderRadius: "9999px", border: `1px solid ${isBackendConnected ? '#a7f3d0' : '#fde68a'}` }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isBackendConnected ? "#10b981" : "#f59e0b", display: "inline-block" }}></span>
            <strong>{isBackendConnected ? "Neon DB Connected" : "Local Mode"}</strong>
          </div>
        </div>
      </header>

      {/* Global Alerts */}
      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{error}</span>
          <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "#991b1b", cursor: "pointer", fontWeight: "bold" }}>✕</button>
        </div>
      )}

      {success && (
        <div style={{ background: "#d1fae5", border: "1px solid #6ee7b7", color: "#065f46", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{success}</span>
          <button onClick={() => setSuccess("")} style={{ background: "none", border: "none", color: "#065f46", cursor: "pointer", fontWeight: "bold" }}>✕</button>
        </div>
      )}

      {/* FORM SECTION */}
      <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", marginBottom: "32px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "19px", fontWeight: "700", color: "#065f46", marginTop: 0, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          {editingId ? "✏️ Edit Community Request" : "➕ Submit a Community Request"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Full Name <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Kasun Perera"
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Area <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", background: "#fff" }}
              >
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Kegalle">Kegalle</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Galle">Galle</option>
                <option value="Kurunegala">Kurunegala</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Request Type <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", background: "#fff" }}
              >
                <option value="New Waste Bin">New Waste Bin</option>
                <option value="Extra Collection">Extra Collection</option>
                <option value="Cleanup Request">Cleanup Request</option>
                <option value="Missing Collection Point">Missing Collection Point</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Priority Level <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", background: "#fff" }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Description <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what is needed in your area (at least 10 characters)..."
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
            <button
              type="submit"
              style={{
                background: "#059669",
                color: "#ffffff",
                border: "none",
                padding: "11px 24px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
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
                style={{
                  background: "#4b5563",
                  color: "#ffffff",
                  border: "none",
                  padding: "11px 18px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* SEARCH, FILTER & LIST SECTION */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: 0 }}>
            Active Community Requests ({filteredRequests.length})
          </h2>
          <button
            onClick={fetchRequests}
            style={{ background: "#f3f4f6", border: "1px solid #d1d5db", padding: "6px 12px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", color: "#374151" }}
          >
            🔄 Refresh List
          </button>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="🔎 Search by area, name, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px" }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", background: "#fff" }}
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
            style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "14px", background: "#fff" }}
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        {/* List Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            <p>Loading community requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", background: "#f9fafb", borderRadius: "8px", border: "1px dashed #d1d5db", color: "#6b7280" }}>
            <p style={{ margin: 0, fontSize: "15px" }}>No community requests found matching your filters.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {filteredRequests.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "18px 20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "box-shadow 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ background: "#ecfdf5", color: "#065f46", fontSize: "12px", fontWeight: "700", padding: "4px 10px", borderRadius: "6px" }}>
                      {item.requestType}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "4px", ...getPriorityBadgeStyle(item.priority) }}>
                      {item.priority} Priority
                    </span>
                  </div>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                    {item.createdAt ? `Date: ${item.createdAt}` : ""}
                  </span>
                </div>

                <h3 style={{ fontSize: "17px", margin: "10px 0 6px 0", color: "#111827", fontWeight: "600" }}>
                  📍 {item.area}
                </h3>
                <p style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 12px 0", lineHeight: "1.5" }}>
                  {item.description}
                </p>

                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "14px" }}>
                  <span>Requested By: <strong style={{ color: "#374151" }}>{item.name}</strong></span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f3f4f6", paddingTop: "12px", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Status:</label>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        padding: "5px 10px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        cursor: "pointer",
                        ...getStatusBadgeStyle(item.status),
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        background: "#f59e0b",
                        color: "#ffffff",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: "5px",
                        fontSize: "13px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        background: "#ef4444",
                        color: "#ffffff",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: "5px",
                        fontSize: "13px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}