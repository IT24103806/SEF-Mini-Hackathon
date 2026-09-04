/**
 * WasteReports.jsx
 * CleanLK — Community Waste Reports Module (M1)
 * Full CRUD connected with Neon Database Backend & LocalStorage Fallback.
 * Built with popup form modal, filters, stats overview, and unified emerald theme.
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal.jsx";
import WasteReportModalForm from "./WasteReportModalForm.jsx";
import WasteReportModalDetails from "./WasteReportModalDetails.jsx";
import { wasteReportsApi } from "../../utils/api.js";
import sampleReports from "../../data/wasteReports.js";
import { AREAS, ISSUE_TYPES, SEVERITIES, STATUSES, STORAGE_KEY } from "./constants.js";
import { loadFromStorage, saveToStorage } from "../../utils/storage.js";
import "./WasteReports.css";

function getIssueBadge(issueType) {
  switch (issueType) {
    case "Overflowing Bin":
      return { icon: "⚠️", className: "badge-overflow" };
    case "Illegal Dumping":
      return { icon: "🚫", className: "badge-dumping" };
    case "Hazardous Waste":
      return { icon: "☣️", className: "badge-hazard" };
    case "Drain Clog":
      return { icon: "🌊", className: "badge-drain" };
    case "Uncollected Garbage":
    default:
      return { icon: "🗑️", className: "badge-general" };
  }
}

function getSeverityClass(severity) {
  switch (severity) {
    case "Critical":
      return "severity-critical";
    case "High":
      return "severity-high";
    case "Medium":
      return "severity-medium";
    case "Low":
    default:
      return "severity-low";
  }
}

export default function WasteReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Search and Multi-filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");

  // Modal / Dialog states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [deletingReport, setDeletingReport] = useState(null);

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

  // Fetch reports from backend API (with local fallback)
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await wasteReportsApi.getAll();
      if (res && res.success && Array.isArray(res.data)) {
        setReports(res.data);
        saveToStorage(STORAGE_KEY, res.data);
        setIsBackendConnected(true);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("Backend unavailable, loading local storage cache:", err.message);
      setIsBackendConnected(false);
      const local = loadFromStorage(STORAGE_KEY, sampleReports);
      setReports(local);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const updateStateAndStorage = (updatedList) => {
    setReports(updatedList);
    saveToStorage(STORAGE_KEY, updatedList);
  };

  // Derive unique areas list
  const availableAreas = useMemo(() => {
    const areaSet = new Set(AREAS);
    reports.forEach((item) => {
      if (item.area && item.area.trim()) {
        areaSet.add(item.area.trim());
      }
    });
    return Array.from(areaSet).sort();
  }, [reports]);

  // Multi-filter and search logic
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const areaMatch = (report.area || "").toLowerCase().includes(query);
        const nameMatch = (report.fullName || report.name || "").toLowerCase().includes(query);
        const issueMatch = (report.issueType || "").toLowerCase().includes(query);
        const descMatch = (report.description || "").toLowerCase().includes(query);

        if (!areaMatch && !nameMatch && !issueMatch && !descMatch) {
          return false;
        }
      }

      if (selectedArea && (report.area || "").toLowerCase() !== selectedArea.toLowerCase()) {
        return false;
      }

      if (selectedStatus && report.status !== selectedStatus) {
        return false;
      }

      if (selectedSeverity && report.severity !== selectedSeverity) {
        return false;
      }

      return true;
    });
  }, [reports, searchQuery, selectedArea, selectedStatus, selectedSeverity]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedArea || selectedStatus || selectedSeverity
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedArea("");
    setSelectedStatus("");
    setSelectedSeverity("");
  };

  // Dashboard Stats
  const stats = useMemo(() => {
    return {
      total: reports.length,
      reported: reports.filter((r) => r.status === "Reported" || r.status === "Pending").length,
      inProgress: reports.filter((r) => r.status === "In Progress").length,
      resolved: reports.filter((r) => r.status === "Resolved").length,
    };
  }, [reports]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingReport(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (report) => {
    setEditingReport(report);
    if (viewingReport) setViewingReport(null);
    setIsFormModalOpen(true);
  };

  // Close Form Modal
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingReport(null);
  };

  // Handle Form Submit (Create & Update)
  const handleFormSubmit = async (formData) => {
    try {
      if (editingReport) {
        if (isBackendConnected) {
          const res = await wasteReportsApi.update(editingReport.id, formData);
          setReports((prev) =>
            prev.map((item) => (item.id === editingReport.id ? res.data : item))
          );
        } else {
          const updated = reports.map((item) =>
            item.id === editingReport.id ? { ...item, ...formData } : item
          );
          updateStateAndStorage(updated);
        }
        showToast("Waste report updated successfully!", "success");
      } else {
        if (isBackendConnected) {
          const res = await wasteReportsApi.create(formData);
          setReports((prev) => [res.data, ...prev]);
        } else {
          const newEntry = {
            id: `REP-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`,
            ...formData,
            status: "Reported",
            createdAt: new Date().toISOString().split("T")[0],
          };
          updateStateAndStorage([newEntry, ...reports]);
        }
        showToast("New waste report submitted successfully!", "success");
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
        const res = await wasteReportsApi.updateStatus(id, newStatus);
        setReports((prev) =>
          prev.map((item) => (item.id === id ? res.data : item))
        );
      } else {
        const updated = reports.map((item) =>
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
    if (!deletingReport) return;
    try {
      if (isBackendConnected) {
        await wasteReportsApi.delete(deletingReport.id);
      }
      const updated = reports.filter((item) => item.id !== deletingReport.id);
      updateStateAndStorage(updated);
      showToast("Waste report deleted successfully.", "success");
      setDeletingReport(null);
      if (viewingReport) setViewingReport(null);
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, "danger");
    }
  };

  return (
    <div className="wr-page-wrapper">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`wr-toast wr-toast--${toast.type}`}
          role="alert"
          aria-live="polite"
        >
          <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
          <span>{toast.message}</span>
          <button
            type="button"
            className="wr-toast-close"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="wr-hero-section">
        <div className="wr-hero-content">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
            <div className="wr-hero-tag" style={{ margin: 0 }}>
              <span>🍃</span> Citizen Waste Watch • Cleaner Sri Lanka
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

          <h1 className="wr-hero-heading">
            Report Waste Issues, <br />
            Keep Sri Lanka <span className="wr-hero-heading-highlight">Pristine.</span>
          </h1>

          <p className="wr-hero-subtext">
            CleanLK empowers residents to report uncollected garbage, illegal dumping,
            and overflowing bins in real-time, connecting communities directly with municipal teams.
          </p>

          <div className="wr-hero-actions">
            <button
              type="button"
              className="wr-hero-btn-primary"
              onClick={handleOpenCreate}
            >
              + Report Waste Issue
            </button>
            <a
              href="#reports-directory"
              className="wr-hero-btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("reports-directory");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Reports
            </a>
          </div>

          <div className="wr-hero-caption">
            Transparent • Real-time • Verified by Community
          </div>
        </div>

        {/* Right Floating Card */}
        <div className="wr-hero-visual-col">
          <div className="wr-hero-banner-frame">
            <div className="wr-hero-backdrop-visual">
              <div className="wr-backdrop-badge">
                <span>🇱🇰</span> Live Civic Action Hub
              </div>
            </div>

            <div className="wr-floating-overview-card">
              <div className="wr-floating-card-header">
                <span className="wr-floating-card-title">Incident Tracker</span>
                <div className="wr-floating-leaf-badge">
                  <span style={{ fontSize: "14px" }}>🌱</span>
                </div>
              </div>

              <div className="wr-floating-metrics-row">
                <div className="wr-floating-metric">
                  <div className="wr-metric-value">{stats.total}</div>
                  <div className="wr-metric-label">Total</div>
                  <div className="wr-metric-bar wr-metric-bar--green"></div>
                </div>

                <div className="wr-floating-metric">
                  <div className="wr-metric-value">{stats.reported}</div>
                  <div className="wr-metric-label">Reported</div>
                  <div className="wr-metric-bar wr-metric-bar--amber"></div>
                </div>

                <div className="wr-floating-metric">
                  <div className="wr-metric-value">{stats.inProgress}</div>
                  <div className="wr-metric-label">In Progress</div>
                  <div className="wr-metric-bar wr-metric-bar--blue"></div>
                </div>

                <div className="wr-floating-metric">
                  <div className="wr-metric-value">{stats.resolved}</div>
                  <div className="wr-metric-label">Resolved</div>
                  <div className="wr-metric-bar wr-metric-bar--emerald"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory & Controls Section */}
      <div id="reports-directory">
        <div className="wr-controls-card">
          <div className="wr-controls-header">
            <div>
              <h2 className="wr-controls-title">Community Waste Reports Directory</h2>
              <p className="wr-controls-subtitle">
                Search, filter by municipal region, incident severity, or resolution status.
              </p>
            </div>
            <button
              type="button"
              className="wr-add-report-btn"
              onClick={handleOpenCreate}
            >
              + Report Issue
            </button>
          </div>

          {/* Search Row */}
          <div className="wr-search-row">
            <div className="wr-search-wrapper">
              <span className="wr-search-icon">🔍</span>
              <input
                type="text"
                className="wr-search-input"
                placeholder="Search by area, issue type, reporter name, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="wr-filters-row">
            <div className="wr-filter-group">
              <label className="wr-filter-label">Municipal Area</label>
              <select
                className="wr-filter-select"
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

            <div className="wr-filter-group">
              <label className="wr-filter-label">Status</label>
              <select
                className="wr-filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="wr-filter-group">
              <label className="wr-filter-label">Severity</label>
              <select
                className="wr-filter-select"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
              >
                <option value="">All Severities</option>
                {SEVERITIES.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev} Severity
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
        <div className="wr-status-bar">
          <div>
            Showing <strong>{filteredReports.length}</strong> of{" "}
            <strong>{reports.length}</strong> waste reports
          </div>

          {hasActiveFilters && (
            <div className="wr-active-filter-pills">
              {searchQuery && <span className="wr-pill">Query: "{searchQuery}"</span>}
              {selectedArea && <span className="wr-pill">Area: {selectedArea}</span>}
              {selectedStatus && <span className="wr-pill">Status: {selectedStatus}</span>}
              {selectedSeverity && <span className="wr-pill">Severity: {selectedSeverity}</span>}
            </div>
          )}
        </div>

        {/* Report Cards Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#6b7280" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>⏳</div>
            <p>Loading waste reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🗑️</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>
              No Waste Reports Found
            </h3>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 18px 0" }}>
              {hasActiveFilters
                ? "No reports matched your search criteria. Try adjusting your filters."
                : "No waste incident reports have been submitted yet. Keep Sri Lanka clean by reporting an issue!"}
            </p>
            {hasActiveFilters ? (
              <Button variant="secondary" onClick={clearFilters}>
                Reset Filters
              </Button>
            ) : (
              <Button variant="primary" onClick={handleOpenCreate}>
                + Report Waste Issue
              </Button>
            )}
          </div>
        ) : (
          <div className="wr-grid">
            {filteredReports.map((item) => {
              const issueBadge = getIssueBadge(item.issueType);
              const severityClass = getSeverityClass(item.severity);

              return (
                <div key={item.id} className="wr-card">
                  <div className="wr-card-header">
                    <div className="wr-card-badges">
                      <span className={`wr-badge ${issueBadge.className}`}>
                        <span>{issueBadge.icon}</span>
                        <span>{item.issueType}</span>
                      </span>
                      <span className={`wr-badge ${severityClass}`}>
                        {item.severity}
                      </span>
                    </div>
                  </div>

                  <div className="wr-card-body">
                    <h3 className="wr-card-area">📍 {item.area}</h3>
                    <p className="wr-card-desc">{item.description}</p>
                    <div className="wr-card-meta">
                      <span>👤 {item.fullName || item.name || "Resident"}</span> •{" "}
                      <span>📅 {item.createdAt ? item.createdAt.split("T")[0] : (item.date || "Recent")}</span>
                    </div>
                  </div>

                  <div className="wr-card-footer">
                    <div>
                      <select
                        className="wr-status-select"
                        value={item.status || "Reported"}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        style={{
                          background:
                            item.status === "Resolved"
                              ? "#dcfce7"
                              : item.status === "In Progress"
                              ? "#dbeafe"
                              : "#fef3c7",
                          color:
                            item.status === "Resolved"
                              ? "#166534"
                              : item.status === "In Progress"
                              ? "#1e40af"
                              : "#92400e",
                          borderColor:
                            item.status === "Resolved"
                              ? "#86efac"
                              : item.status === "In Progress"
                              ? "#93c5fd"
                              : "#fde68a",
                        }}
                      >
                        {STATUSES.map((st) => (
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
                        onClick={() => setViewingReport(item)}
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
                        onClick={() => setDeletingReport(item)}
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
        title={editingReport ? "Edit Waste Report" : "Report a Waste Issue"}
        size="md"
      >
        <WasteReportModalForm
          initialData={editingReport}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseFormModal}
          showTitle={false}
        />
      </Modal>

      {/* MODAL 2: Details Modal */}
      <Modal
        isOpen={Boolean(viewingReport)}
        onClose={() => setViewingReport(null)}
        title="Waste Incident Report Details"
        size="md"
      >
        <WasteReportModalDetails
          report={viewingReport}
          onClose={() => setViewingReport(null)}
          onEdit={handleOpenEdit}
          onDelete={(rep) => {
            setDeletingReport(rep);
            setViewingReport(null);
          }}
        />
      </Modal>

      {/* MODAL 3: Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingReport)}
        onClose={() => setDeletingReport(null)}
        title="Confirm Report Deletion"
        size="sm"
      >
        <div style={{ padding: "8px 0" }}>
          <p style={{ color: "#374151", fontSize: "14px", lineHeight: "1.5", margin: "0 0 16px 0" }}>
            Are you sure you want to delete this waste report from{" "}
            <strong>{deletingReport?.area}</strong> ({deletingReport?.issueType})?
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button variant="ghost" onClick={() => setDeletingReport(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
