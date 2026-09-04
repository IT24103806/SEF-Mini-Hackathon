/**
 * CommunityRequests.jsx
 * CleanLK — Community Requests & Services Module (M4)
 * Full CRUD connected with Neon Database Backend & LocalStorage Fallback.
 * Built with popup form modal, filters, stats overview, and clean emerald theme.
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";
import CommunityRequestForm from "./CommunityRequestForm.jsx";
import CommunityRequestDetails from "./CommunityRequestDetails.jsx";
import { communityRequestsApi } from "../../utils/api.js";
import { initialRequests, SAMPLE_AREAS, REQUEST_TYPES, PRIORITIES, STATUS_OPTIONS } from "../../data/communityRequests.js";
import { getStoredRequests, saveRequests } from "../../utils/storage.js";
import "./CommunityRequests.css";

function getRequestTypeBadge(requestType) {
  switch (requestType) {
    case "New Waste Bin":
      return { icon: "🗑️", className: "badge-bin" };
    case "Extra Collection":
      return { icon: "🚛", className: "badge-pickup" };
    case "Cleanup Request":
      return { icon: "🧹", className: "badge-cleanup" };
    case "Missing Collection Point":
    default:
      return { icon: "📍", className: "badge-missing" };
  }
}

function getPriorityClass(priority) {
  switch (priority) {
    case "High":
      return "priority-high";
    case "Medium":
      return "priority-medium";
    case "Low":
    default:
      return "priority-low";
  }
}

export default function CommunityRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  // Modal Dialog states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [deletingRequest, setDeletingRequest] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch Requests from Backend (with local storage fallback)
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

  // Derive unique areas list
  const availableAreas = useMemo(() => {
    const areaSet = new Set(SAMPLE_AREAS);
    requests.forEach((item) => {
      if (item.area && item.area.trim()) {
        areaSet.add(item.area.trim());
      }
    });
    return Array.from(areaSet).sort();
  }, [requests]);

  // Filtered requests computation
  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const areaMatch = (item.area || "").toLowerCase().includes(query);
        const nameMatch = (item.name || "").toLowerCase().includes(query);
        const typeMatch = (item.requestType || "").toLowerCase().includes(query);
        const descMatch = (item.description || "").toLowerCase().includes(query);

        if (!areaMatch && !nameMatch && !typeMatch && !descMatch) {
          return false;
        }
      }

      if (selectedArea && item.area.toLowerCase() !== selectedArea.toLowerCase()) {
        return false;
      }

      if (selectedStatus && item.status !== selectedStatus) {
        return false;
      }

      if (selectedPriority && item.priority !== selectedPriority) {
        return false;
      }

      return true;
    });
  }, [requests, searchQuery, selectedArea, selectedStatus, selectedPriority]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedArea || selectedStatus || selectedPriority
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedArea("");
    setSelectedStatus("");
    setSelectedPriority("");
  };

  // Stats computation
  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "Pending").length,
      inReview: requests.filter((r) => r.status === "Under Review").length,
      approved: requests.filter((r) => r.status === "Approved").length,
      completed: requests.filter((r) => r.status === "Completed").length,
    };
  }, [requests]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingRequest(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (request) => {
    setEditingRequest(request);
    if (viewingRequest) setViewingRequest(null);
    setIsFormModalOpen(true);
  };

  // Close Form Modal
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingRequest(null);
  };

  // Handle Form Submit (Create & Update)
  const handleFormSubmit = async (formData) => {
    try {
      if (editingRequest) {
        if (isBackendConnected) {
          const res = await communityRequestsApi.update(editingRequest.id, formData);
          setRequests((prev) =>
            prev.map((item) => (item.id === editingRequest.id ? res.data : item))
          );
        } else {
          const updated = requests.map((item) =>
            item.id === editingRequest.id ? { ...item, ...formData } : item
          );
          updateStateAndStorage(updated);
        }
        showToast("Community request updated successfully!", "success");
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
        showToast("New community request submitted successfully!", "success");
      }
      handleCloseFormModal();
    } catch (err) {
      showToast(`Submission failed: ${err.message}`, "danger");
    }
  };

  // Handle Status Update
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
      showToast(`Status updated to "${newStatus}"!`, "success");
    } catch (err) {
      showToast(`Failed to update status: ${err.message}`, "danger");
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingRequest) return;
    try {
      if (isBackendConnected) {
        await communityRequestsApi.delete(deletingRequest.id);
      }
      const updated = requests.filter((item) => item.id !== deletingRequest.id);
      updateStateAndStorage(updated);
      showToast("Community request deleted successfully.", "success");
      setDeletingRequest(null);
      if (viewingRequest) setViewingRequest(null);
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, "danger");
    }
  };

  return (
    <div className="cr-page-wrapper">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`cr-toast cr-toast--${toast.type}`}
          role="alert"
          aria-live="polite"
        >
          <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
          <span>{toast.message}</span>
          <button
            type="button"
            className="cr-toast-close"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="cr-hero-section">
        <div className="cr-hero-content">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
            <div className="cr-hero-tag" style={{ margin: 0 }}>
              <span>📢</span> Empowering Cleaner Neighborhoods
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                background: isBackendConnected ? "#ecfdf5" : "#fef3c7",
                color: isBackendConnected ? "#065f46" : "#92400e",
                padding: "4px 10px",
                borderRadius: "9999px",
                border: `1px solid ${isBackendConnected ? "#a7f3d0" : "#fde68a"}`,
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: isBackendConnected ? "#10b981" : "#f59e0b",
                  display: "inline-block",
                }}
              ></span>
              <strong>{isBackendConnected ? "Online" : "Offline"}</strong>
            </div>
          </div>

          <h1 className="cr-hero-heading">
            Request Waste Services <br />
            For Your <span className="cr-hero-heading-highlight">Community.</span>
          </h1>

          <p className="cr-hero-subtext">
            Need an extra waste bin, additional recycling pickup, or a community cleanup event?
            Submit your municipal request and track its progress from review to completion.
          </p>

          <div className="cr-hero-actions">
            <button
              type="button"
              className="cr-hero-btn-primary"
              onClick={handleOpenCreate}
            >
              + Submit Community Request
            </button>
            <a
              href="#requests-directory"
              className="cr-hero-btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("requests-directory");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Requests
            </a>
          </div>

          <div className="cr-hero-caption">
            Transparent • Civic-Minded • Built for Sri Lanka
          </div>
        </div>

        {/* Right Floating Card */}
        <div className="cr-hero-visual-col">
          <div className="cr-hero-banner-frame">
            <div className="cr-hero-backdrop-visual">
              <div className="cr-backdrop-badge">
                <span>🇱🇰</span> Civic Action Hub
              </div>
            </div>

            <div className="cr-floating-overview-card">
              <div className="cr-floating-card-header">
                <span className="cr-floating-card-title">Live Request Pulse</span>
                <div className="cr-floating-leaf-badge">
                  <span style={{ fontSize: "14px" }}>🌱</span>
                </div>
              </div>

              <div className="cr-floating-metrics-row">
                <div className="cr-floating-metric">
                  <div className="cr-metric-value">{stats.total}</div>
                  <div className="cr-metric-label">Total</div>
                  <div className="cr-metric-bar cr-metric-bar--green"></div>
                </div>

                <div className="cr-floating-metric">
                  <div className="cr-metric-value">{stats.pending}</div>
                  <div className="cr-metric-label">Pending</div>
                  <div className="cr-metric-bar cr-metric-bar--amber"></div>
                </div>

                <div className="cr-floating-metric">
                  <div className="cr-metric-value">{stats.approved}</div>
                  <div className="cr-metric-label">Approved</div>
                  <div className="cr-metric-bar cr-metric-bar--blue"></div>
                </div>

                <div className="cr-floating-metric">
                  <div className="cr-metric-value">{stats.completed}</div>
                  <div className="cr-metric-label">Done</div>
                  <div className="cr-metric-bar cr-metric-bar--emerald"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory & Controls Section */}
      <div id="requests-directory">
        <div className="cr-controls-card">
          <div className="cr-controls-header">
            <div>
              <h2 className="cr-controls-title">Community Requests Directory</h2>
              <p className="cr-controls-subtitle">
                Search, filter by municipal region, priority, or track request fulfillment status.
              </p>
            </div>
            <button
              type="button"
              className="cr-add-request-btn"
              onClick={handleOpenCreate}
            >
              + Submit Request
            </button>
          </div>

          {/* Search Row */}
          <div className="cr-search-row">
            <div className="cr-search-wrapper">
              <span className="cr-search-icon">🔍</span>
              <input
                type="text"
                className="cr-search-input"
                placeholder="Search by area, requester name, request type, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="cr-filters-row">
            <div className="cr-filter-group">
              <label className="cr-filter-label">Municipal Area</label>
              <select
                className="cr-filter-select"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">All Municipal Areas</option>
                {availableAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="cr-filter-group">
              <label className="cr-filter-label">Status</label>
              <select
                className="cr-filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="cr-filter-group">
              <label className="cr-filter-label">Priority</label>
              <select
                className="cr-filter-select"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                {PRIORITIES.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr} Priority
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <div style={{ paddingBottom: "2px" }}>
                <Button variant="ghost" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="cr-status-bar">
          <div>
            Showing <strong>{filteredRequests.length}</strong> of{" "}
            <strong>{requests.length}</strong> requests
          </div>

          {hasActiveFilters && (
            <div className="cr-active-filter-pills">
              {searchQuery && <span className="cr-pill">Query: "{searchQuery}"</span>}
              {selectedArea && <span className="cr-pill">Area: {selectedArea}</span>}
              {selectedStatus && <span className="cr-pill">Status: {selectedStatus}</span>}
              {selectedPriority && <span className="cr-pill">Priority: {selectedPriority}</span>}
            </div>
          )}
        </div>

        {/* Request Cards Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#6b7280" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>⏳</div>
            <p>Loading community requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📋</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>
              No Community Requests Found
            </h3>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 18px 0" }}>
              {hasActiveFilters
                ? "No requests matched your search criteria. Try adjusting your filters."
                : "No community requests have been submitted yet. Be the first to request a service!"}
            </p>
            {hasActiveFilters ? (
              <Button variant="secondary" onClick={clearFilters}>
                Reset Filters
              </Button>
            ) : (
              <Button variant="primary" onClick={handleOpenCreate}>
                + Submit New Request
              </Button>
            )}
          </div>
        ) : (
          <div className="cr-grid">
            {filteredRequests.map((item) => {
              const typeBadge = getRequestTypeBadge(item.requestType);
              const priorityClass = getPriorityClass(item.priority);

              return (
                <div key={item.id} className="cr-card">
                  <div className="cr-card-header">
                    <div className="cr-card-badges">
                      <span className={`cr-badge ${typeBadge.className}`}>
                        <span>{typeBadge.icon}</span>
                        <span>{item.requestType}</span>
                      </span>
                      <span className={`cr-badge ${priorityClass}`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>

                  <div className="cr-card-body">
                    <h3 className="cr-card-area">📍 {item.area}</h3>
                    <p className="cr-card-desc">{item.description}</p>
                    <div className="cr-card-meta">
                      <span>👤 {item.name}</span> • <span>📅 {item.createdAt || "Recent"}</span>
                    </div>
                  </div>

                  <div className="cr-card-footer">
                    <div>
                      <select
                        className="cr-status-select"
                        value={item.status || "Pending"}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        style={{
                          background:
                            item.status === "Completed"
                              ? "#dcfce7"
                              : item.status === "Approved"
                              ? "#dbeafe"
                              : item.status === "Under Review"
                              ? "#e0e7ff"
                              : "#fef3c7",
                          color:
                            item.status === "Completed"
                              ? "#166534"
                              : item.status === "Approved"
                              ? "#1e40af"
                              : item.status === "Under Review"
                              ? "#3730a3"
                              : "#92400e",
                          borderColor:
                            item.status === "Completed"
                              ? "#86efac"
                              : item.status === "Approved"
                              ? "#93c5fd"
                              : item.status === "Under Review"
                              ? "#a5b4fc"
                              : "#fde68a",
                        }}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingRequest(item)}
                      >
                        Details
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeletingRequest(item)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: Form Modal (Popup Create / Edit) */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editingRequest ? "Edit Community Request" : "Submit Community Request"}
        size="md"
      >
        <CommunityRequestForm
          initialData={editingRequest}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseFormModal}
          showTitle={false}
        />
      </Modal>

      {/* MODAL 2: Details Modal */}
      <Modal
        isOpen={Boolean(viewingRequest)}
        onClose={() => setViewingRequest(null)}
        title="Community Request Details"
        size="md"
      >
        <CommunityRequestDetails
          request={viewingRequest}
          onClose={() => setViewingRequest(null)}
          onEdit={handleOpenEdit}
          onDelete={(req) => {
            setDeletingRequest(req);
            setViewingRequest(null);
          }}
        />
      </Modal>

      {/* MODAL 3: Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingRequest)}
        onClose={() => setDeletingRequest(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div style={{ padding: "8px 0" }}>
          <p style={{ color: "#374151", fontSize: "14px", lineHeight: "1.5", margin: "0 0 16px 0" }}>
            Are you sure you want to delete this community request from{" "}
            <strong>{deletingRequest?.area}</strong> by{" "}
            <strong>{deletingRequest?.name}</strong>?
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button variant="ghost" onClick={() => setDeletingRequest(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}