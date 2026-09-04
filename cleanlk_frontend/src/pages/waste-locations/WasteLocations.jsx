/**
 * WasteLocations.jsx
 * CleanLK — Waste Disposal & Recycling Locations Module (M3)
 * Full CRUD connected with Neon Database Backend & LocalStorage Fallback.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import Button from '../../components/Button.jsx';
import Modal from '../../components/Modal.jsx';
import WasteLocationForm from './WasteLocationForm.jsx';
import WasteLocationDetails from './WasteLocationDetails.jsx';
import { wasteLocationsApi } from '../../utils/api.js';
import {
  loadWasteLocations,
  saveWasteLocations,
  resetWasteLocations,
} from '../../utils/storage.js';
import {
  LOCATION_CATEGORIES,
} from '../../data/wasteLocations.js';
import { SAMPLE_AREAS } from '../../data/collectionSchedules.js';
import './WasteLocations.css';

function getLocationBadge(category) {
  switch (category) {
    case 'Recycling Center':
      return { icon: '♻️', className: 'badge-recycling' };
    case 'Public Drop-off Bin':
      return { icon: '🗑️', className: 'badge-dropoff' };
    case 'Compost Facility':
      return { icon: '🍃', className: 'badge-compost' };
    case 'E-Waste Center':
      return { icon: '🔋', className: 'badge-ewaste' };
    case 'Transfer Station':
    default:
      return { icon: '🚛', className: 'badge-transfer' };
  }
}

export default function WasteLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [viewingLocation, setViewingLocation] = useState(null);
  const [deletingLocation, setDeletingLocation] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch locations from backend API with fallback
  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await wasteLocationsApi.getAll();
      if (res && res.success && Array.isArray(res.data)) {
        setLocations(res.data);
        saveWasteLocations(res.data);
        setIsBackendConnected(true);
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.warn('Backend unavailable, loading local storage cache:', err.message);
      setIsBackendConnected(false);
      const local = loadWasteLocations();
      setLocations(local);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const persistLocations = (newList) => {
    setLocations(newList);
    saveWasteLocations(newList);
  };

  const availableAreas = useMemo(() => {
    const areaSet = new Set(SAMPLE_AREAS);
    locations.forEach((item) => {
      if (item.area && item.area.trim()) {
        areaSet.add(item.area.trim());
      }
    });
    return Array.from(areaSet).sort();
  }, [locations]);

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const nameMatch = (loc.name || '').toLowerCase().includes(query);
        const areaMatch = (loc.area || '').toLowerCase().includes(query);
        const catMatch = (loc.category || '').toLowerCase().includes(query);
        const addrMatch = (loc.address || '').toLowerCase().includes(query);
        const wasteMatch = (loc.acceptedWaste || []).some((w) =>
          w.toLowerCase().includes(query)
        );

        if (!nameMatch && !areaMatch && !catMatch && !addrMatch && !wasteMatch) {
          return false;
        }
      }

      if (selectedArea && loc.area.toLowerCase() !== selectedArea.toLowerCase()) {
        return false;
      }

      if (selectedCategory && loc.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [locations, searchQuery, selectedArea, selectedCategory]);

  const hasActiveFilters = Boolean(searchQuery.trim() || selectedArea || selectedCategory);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedArea('');
    setSelectedCategory('');
  };

  const stats = useMemo(() => {
    const total = locations.length;
    const recyclingCenters = locations.filter(
      (l) => l.category === 'Recycling Center' || l.category === 'E-Waste Center'
    ).length;
    const dropPoints = locations.filter(
      (l) => l.category === 'Public Drop-off Bin' || l.category === 'Compost Facility'
    ).length;
    return { total, recyclingCenters, dropPoints };
  }, [locations]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingLocation(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (location) => {
    setViewingLocation(null);
    setEditingLocation(location);
    setIsFormModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveLocation = async (formData) => {
    try {
      if (editingLocation && editingLocation.id) {
        if (isBackendConnected) {
          const res = await wasteLocationsApi.update(editingLocation.id, formData);
          const updatedList = locations.map((item) =>
            item.id === editingLocation.id ? res.data : item
          );
          persistLocations(updatedList);
        } else {
          const updatedList = locations.map((item) =>
            item.id === editingLocation.id ? { ...formData, id: editingLocation.id } : item
          );
          persistLocations(updatedList);
        }
        showToast(`Location "${formData.name}" updated successfully!`, 'success');
      } else {
        if (isBackendConnected) {
          const res = await wasteLocationsApi.create(formData);
          const updatedList = [res.data, ...locations];
          persistLocations(updatedList);
        } else {
          const newId =
            locations.length > 0
              ? Math.max(...locations.map((l) => Number(l.id) || 0)) + 1
              : 1;
          const newRecord = {
            ...formData,
            id: newId,
          };
          const updatedList = [newRecord, ...locations];
          persistLocations(updatedList);
        }
        showToast(`New waste location "${formData.name}" added successfully!`, 'success');
      }

      setIsFormModalOpen(false);
      setEditingLocation(null);
    } catch (err) {
      showToast(`Error: ${err.message || 'Failed to save location'}`, 'danger');
    }
  };

  const handleRequestDelete = (location) => {
    setViewingLocation(null);
    setDeletingLocation(location);
  };

  const handleConfirmDelete = async () => {
    if (!deletingLocation) return;
    try {
      if (isBackendConnected) {
        await wasteLocationsApi.delete(deletingLocation.id);
      }
      const updatedList = locations.filter((item) => item.id !== deletingLocation.id);
      persistLocations(updatedList);
      showToast(`Deleted waste location "${deletingLocation.name}".`, 'danger');
    } catch (err) {
      showToast(`Error: ${err.message || 'Failed to delete location'}`, 'danger');
    } finally {
      setDeletingLocation(null);
    }
  };

  const handleRestoreSampleData = () => {
    const sample = resetWasteLocations();
    setLocations(sample);
    clearFilters();
    showToast('Reset to default Sri Lankan waste disposal locations.', 'success');
  };

  return (
    <div className="wl-page-wrapper">
      {/* Toast */}
      {toast && (
        <div className={`wl-toast wl-toast--${toast.type}`} role="status">
          <span>{toast.type === 'danger' ? '🗑️' : '✅'}</span>
          <span>{toast.message}</span>
          <button
            type="button"
            className="wl-toast-close"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="wl-hero-section">
        <div className="cs-hero-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <div className="wl-hero-tag" style={{ margin: 0 }}>
              <span>📍</span> Drop-off Points &amp; Sorting Facilities
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: isBackendConnected ? '#ecfdf5' : '#fef3c7', color: isBackendConnected ? '#065f46' : '#92400e', padding: '4px 10px', borderRadius: '9999px', border: `1px solid ${isBackendConnected ? '#a7f3d0' : '#fde68a'}` }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isBackendConnected ? '#10b981' : '#f59e0b', display: 'inline-block' }}></span>
              <strong>{isBackendConnected ? 'Online' : 'Offline'}</strong>
            </div>
          </div>

          <h1 className="wl-hero-heading">
            Find Nearby <br />
            Disposal Centers &amp; <br />
            <span className="wl-hero-heading-highlight">Recycling Drop Points.</span>
          </h1>

          <p className="wl-hero-subtext">
            Easily locate public recycling bins, municipal composting yards, and authorized electronic waste drop facilities across Sri Lanka.
          </p>

          <div className="wl-hero-actions">
            <button
              type="button"
              className="wl-hero-btn-primary"
              onClick={handleOpenCreate}
            >
              Add New Location <span className="cs-btn-arrow">→</span>
            </button>
            <a
              href="#locations-directory"
              className="wl-hero-btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('locations-directory');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Centers
            </a>
          </div>

          <div className="wl-hero-caption">
            Integrated with municipal collection schedules across Sri Lanka
          </div>
        </div>

        {/* Hero Floating Card */}
        <div className="wl-hero-visual-col">
          <div className="wl-hero-banner-frame">
            <div className="wl-hero-backdrop-visual">
              <div className="cs-backdrop-overlay">
                <div className="wl-backdrop-badge">
                  <span>🇱🇰</span> Sri Lanka Waste Facilities Directory
                </div>
              </div>
            </div>

            <div className="wl-floating-overview-card">
              <div className="wl-floating-card-header">
                <span className="wl-floating-card-title">Facilities Overview</span>
                <div className="wl-floating-leaf-badge">
                  <span>♻️</span>
                </div>
              </div>

              <div className="wl-floating-metrics-row">
                <div className="wl-floating-metric">
                  <div className="wl-metric-value">{stats.total}</div>
                  <div className="wl-metric-label">Total Sites</div>
                  <div className="wl-metric-bar wl-metric-bar--green"></div>
                </div>

                <div className="wl-floating-metric">
                  <div className="wl-metric-value">{stats.recyclingCenters}</div>
                  <div className="wl-metric-label">Recycling &amp; E-Waste</div>
                  <div className="wl-metric-bar wl-metric-bar--blue"></div>
                </div>

                <div className="wl-floating-metric">
                  <div className="wl-metric-value">{stats.dropPoints}</div>
                  <div className="wl-metric-label">Drop Bins &amp; Compost</div>
                  <div className="wl-metric-bar wl-metric-bar--emerald"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section id="locations-directory" className="wl-controls-card">
        <div className="wl-controls-header">
          <div>
            <h2 className="wl-controls-title">Browse Waste Locations &amp; Drop Points</h2>
            <p className="wl-controls-subtitle">
              Search by facility name, municipality, street address, or accepted waste types.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={fetchLocations}
              style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#374151' }}
            >
              🔄 Refresh
            </button>
            <button
              type="button"
              className="wl-add-location-btn"
              onClick={handleOpenCreate}
            >
              + Add Facility Location
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="wl-search-row">
          <div className="wl-search-wrapper">
            <span className="wl-search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              className="wl-search-input"
              placeholder="Search by center name, area (e.g. Colombo), or accepted waste (e.g. Plastic, E-Waste)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search waste locations"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="wl-filters-row">
          <div className="wl-filter-group">
            <label htmlFor="loc-area-select" className="wl-filter-label">
              Area:
            </label>
            <select
              id="loc-area-select"
              className="wl-filter-select"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="">All Areas</option>
              {availableAreas.map((areaName) => (
                <option key={areaName} value={areaName}>
                  {areaName}
                </option>
              ))}
            </select>
          </div>

          <div className="wl-filter-group">
            <label htmlFor="loc-cat-select" className="wl-filter-label">
              Facility Category:
            </label>
            <select
              id="loc-cat-select"
              className="wl-filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {LOCATION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              icon="🔄"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </section>

      {/* Status Bar */}
      <div className="wl-status-bar">
        <div>
          Showing <strong>{filteredLocations.length}</strong> of{' '}
          <strong>{locations.length}</strong> facilities
        </div>

        {hasActiveFilters && (
          <div className="wl-active-filter-pills">
            {searchQuery.trim() && (
              <span className="wl-pill">Search: &ldquo;{searchQuery.trim()}&rdquo;</span>
            )}
            {selectedArea && <span className="wl-pill">Area: {selectedArea}</span>}
            {selectedCategory && <span className="wl-pill">Category: {selectedCategory}</span>}
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <p>Loading waste locations from database...</p>
        </div>
      ) : locations.length === 0 ? (
        <div className="cs-empty-state">
          <div className="cs-empty-icon">📍</div>
          <h3 className="cs-empty-title">No waste locations recorded yet.</h3>
          <p className="cs-empty-desc">
            You can add new municipal recycling drop-off centers or restore sample demo locations.
          </p>
          <div className="cs-empty-actions">
            <button
              type="button"
              className="wl-hero-btn-primary"
              onClick={handleOpenCreate}
            >
              + Add Waste Location
            </button>
            <Button variant="outline" onClick={handleRestoreSampleData} icon="🔄">
              Restore Sample Locations
            </Button>
          </div>
        </div>
      ) : filteredLocations.length === 0 ? (
        <div className="cs-empty-state">
          <div className="cs-empty-icon">🔍</div>
          <h3 className="cs-empty-title">No facilities matched your search criteria.</h3>
          <p className="cs-empty-desc">
            Try adjusting your search terms or clearing your selected filters.
          </p>
          <div className="cs-empty-actions">
            <Button variant="primary" onClick={clearFilters} icon="🔄">
              Clear Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="wl-grid">
          {filteredLocations.map((loc) => {
            const badge = getLocationBadge(loc.category);

            return (
              <article key={loc.id} className="wl-card">
                <div className="wl-card-header">
                  <div>
                    <h3 className="wl-card-title">{loc.name}</h3>
                    <span style={{ fontSize: '13px', color: '#065f46', fontWeight: '600' }}>
                      📍 {loc.area}
                    </span>
                  </div>
                  <span className={`wl-badge ${badge.className}`}>
                    <span>{badge.icon}</span>
                    <span>{loc.category}</span>
                  </span>
                </div>

                <div className="wl-card-body">
                  <div className="wl-card-info-item">
                    <span>🏢</span>
                    <span>{loc.address}</span>
                  </div>
                  <div className="wl-card-info-item">
                    <span>⏰</span>
                    <span>{loc.openHours}</span>
                  </div>
                  {loc.contact && (
                    <div className="wl-card-info-item">
                      <span>📞</span>
                      <span>{loc.contact}</span>
                    </div>
                  )}

                  {loc.acceptedWaste && loc.acceptedWaste.length > 0 && (
                    <div className="wl-card-tags">
                      {loc.acceptedWaste.map((type) => (
                        <span key={type} className="wl-mini-tag">
                          {type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="wl-card-footer">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingLocation(loc)}
                    icon="👁️"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(loc)}
                    icon="✏️"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRequestDelete(loc)}
                    icon="🗑️"
                  >
                    Delete
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingLocation(null);
        }}
        title={editingLocation ? 'Edit Disposal Location' : 'Add Disposal Location'}
        size="md"
      >
        <WasteLocationForm
          key={editingLocation ? editingLocation.id : 'new'}
          initialData={editingLocation}
          onSubmit={handleSaveLocation}
          onCancel={() => {
            setIsFormModalOpen(false);
            setEditingLocation(null);
          }}
        />
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={Boolean(viewingLocation)}
        onClose={() => setViewingLocation(null)}
        title="Disposal Center & Drop-off Details"
        size="md"
      >
        <WasteLocationDetails
          location={viewingLocation}
          onClose={() => setViewingLocation(null)}
          onEdit={(loc) => handleOpenEdit(loc)}
          onDelete={(loc) => handleRequestDelete(loc)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingLocation)}
        onClose={() => setDeletingLocation(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="cs-delete-dialog">
          <div className="cs-delete-warning-box">
            <span className="cs-delete-warning-icon">⚠️</span>
            <p className="cs-delete-text">
              Are you sure you want to delete this facility location?
            </p>
          </div>

          {deletingLocation && (
            <div className="cs-delete-item-preview">
              <strong>{deletingLocation.name}</strong> ({deletingLocation.category})
              <br />
              {deletingLocation.address}, {deletingLocation.area}
            </div>
          )}

          <div className="cs-delete-actions">
            <Button variant="outline" onClick={() => setDeletingLocation(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} icon="🗑️">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
