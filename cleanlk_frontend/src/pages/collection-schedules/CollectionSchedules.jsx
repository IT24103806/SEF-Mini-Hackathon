/**
 * CleanLK — Collection Schedules Module (M2)
 * Complete functional CRUD with Public Lookup, Search, Multi-Filter,
 * Form Validation, Confirmation Modal, Details View, and LocalStorage Persistence.
 */

import { useState, useEffect, useMemo } from 'react'
import Button from '../../components/Button.jsx'
import Modal from '../../components/Modal.jsx'
import CollectionScheduleForm from './CollectionScheduleForm.jsx'
import CollectionScheduleDetails from './CollectionScheduleDetails.jsx'
import {
  loadCollectionSchedules,
  saveCollectionSchedules,
  resetCollectionSchedules,
} from '../../utils/storage.js'
import {
  WASTE_TYPES,
  COLLECTION_DAYS,
  SAMPLE_AREAS,
} from '../../data/collectionSchedules.js'
import './CollectionSchedules.css'

/**
 * Returns a waste type icon and CSS class for badges
 */
function getWasteBadge(wasteType) {
  switch (wasteType) {
    case 'Organic Waste':
      return { icon: '🍃', className: 'badge-organic' }
    case 'Recyclable Waste':
      return { icon: '♻️', className: 'badge-recyclable' }
    case 'Plastic Waste':
      return { icon: '🧴', className: 'badge-plastic' }
    case 'Glass Waste':
      return { icon: '🍾', className: 'badge-glass' }
    case 'E-Waste':
      return { icon: '🔋', className: 'badge-ewaste' }
    case 'Mixed Waste':
      return { icon: '🗑️', className: 'badge-mixed' }
    case 'Household Waste':
    default:
      return { icon: '🏠', className: 'badge-household' }
  }
}

export default function CollectionSchedules() {
  // 1. Data state initialized lazily from localStorage / sample data
  const [schedules, setSchedules] = useState(() => loadCollectionSchedules())

  // 2. Search and Multi-filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedWasteType, setSelectedWasteType] = useState('')
  const [selectedDay, setSelectedDay] = useState('')

  // 3. Modal / Dialog states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [viewingSchedule, setViewingSchedule] = useState(null)
  const [deletingSchedule, setDeletingSchedule] = useState(null)

  // 4. Toast notification state
  const [toast, setToast] = useState(null)

  // Helper to display auto-dismissing toast notifications
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
    }, 3500)
    return () => clearTimeout(timer)
  }, [toast])

  // Persist whenever schedules list changes
  const persistSchedules = (newList) => {
    setSchedules(newList)
    saveCollectionSchedules(newList)
  }

  // Derive all unique area options (combining sample areas + any new user-entered areas)
  const availableAreas = useMemo(() => {
    const areaSet = new Set(SAMPLE_AREAS)
    schedules.forEach((item) => {
      if (item.area && item.area.trim()) {
        areaSet.add(item.area.trim())
      }
    })
    return Array.from(areaSet).sort()
  }, [schedules])

  // Multi-filter and search logic
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      // 1. Search query across Area, Waste Type, and Collection Day (case-insensitive)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const areaMatch = (schedule.area || '').toLowerCase().includes(query)
        const typeMatch = (schedule.wasteType || '').toLowerCase().includes(query)
        const dayMatch = (schedule.collectionDay || '').toLowerCase().includes(query)
        const notesMatch = (schedule.notes || '').toLowerCase().includes(query)

        if (!areaMatch && !typeMatch && !dayMatch && !notesMatch) {
          return false
        }
      }

      // 2. Area filter
      if (selectedArea && schedule.area.toLowerCase() !== selectedArea.toLowerCase()) {
        return false
      }

      // 3. Waste Type filter
      if (selectedWasteType && schedule.wasteType !== selectedWasteType) {
        return false
      }

      // 4. Collection Day filter
      if (selectedDay && schedule.collectionDay !== selectedDay) {
        return false
      }

      return true
    })
  }, [schedules, searchQuery, selectedArea, selectedWasteType, selectedDay])

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedArea || selectedWasteType || selectedDay
  )

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedArea('')
    setSelectedWasteType('')
    setSelectedDay('')
  }

  // =========================================================================
  // CRUD Actions
  // =========================================================================

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingSchedule(null)
    setIsFormModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (schedule) => {
    setViewingSchedule(null)
    setEditingSchedule(schedule)
    setIsFormModalOpen(true)
  }

  // Save (Create or Update)
  const handleSaveSchedule = (formData) => {
    if (editingSchedule && editingSchedule.id) {
      // Update existing
      const updatedList = schedules.map((item) =>
        item.id === editingSchedule.id ? { ...formData, id: editingSchedule.id } : item
      )
      persistSchedules(updatedList)
      showToast(`Collection schedule for ${formData.area} updated successfully!`, 'success')
    } else {
      // Create new record with unique ID
      const newId = schedules.length > 0 ? Math.max(...schedules.map((s) => Number(s.id) || 0)) + 1 : 1
      const newRecord = {
        ...formData,
        id: newId,
      }
      const updatedList = [newRecord, ...schedules]
      persistSchedules(updatedList)
      showToast(`New collection schedule for ${formData.area} added successfully!`, 'success')
    }

    setIsFormModalOpen(false)
    setEditingSchedule(null)
  }

  // Open Delete Confirmation
  const handleRequestDelete = (schedule) => {
    setViewingSchedule(null)
    setDeletingSchedule(schedule)
  }

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deletingSchedule) return

    const updatedList = schedules.filter((item) => item.id !== deletingSchedule.id)
    persistSchedules(updatedList)
    showToast(
      `Deleted collection schedule for ${deletingSchedule.area} (${deletingSchedule.wasteType}).`,
      'danger'
    )
    setDeletingSchedule(null)
  }

  // Restore Sample Data
  const handleRestoreSampleData = () => {
    const sample = resetCollectionSchedules()
    setSchedules(sample)
    clearFilters()
    showToast('Reset to original Sri Lankan prototype sample schedules.', 'success')
  }

  return (
    <div className="cs-page-wrapper">
      {/* Auto-Dismiss Toast Notification */}
      {toast && (
        <div className={`cs-toast cs-toast--${toast.type}`} role="status">
          <span>{toast.type === 'danger' ? '🗑️' : '✅'}</span>
          <span>{toast.message}</span>
          <button
            type="button"
            className="cs-toast-close"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Public Schedule Lookup Hero Banner */}
      <section className="cs-hero" aria-labelledby="cs-main-heading">
        <div className="cs-hero-top">
          <div className="cs-hero-titles">
            <div className="cs-prototype-tag">
              <span>🇱🇰</span> Prototype Sample Data
            </div>
            <h1 id="cs-main-heading">Check Waste Collection Schedule</h1>
            <p className="cs-hero-subtitle">
              Find out when waste is collected in your area or schedule new community pickups.
            </p>
          </div>

          <div className="cs-hero-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={handleOpenCreate}
              icon="➕"
            >
              Add Collection Schedule
            </Button>
          </div>
        </div>
      </section>

      {/* Search & Multi-Filter Controls */}
      <div className="cs-controls-card">
        {/* Search Bar */}
        <div className="cs-search-row">
          <div className="cs-search-input-wrapper">
            <span className="cs-search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              className="cs-search-input"
              placeholder="Search by area (e.g. Kegalle), waste type (e.g. Household), or day (e.g. Monday)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search collection schedules"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="cs-filters-row">
          {/* Area Filter */}
          <div className="cs-filter-group">
            <label htmlFor="area-filter-select" className="cs-filter-label">
              Area:
            </label>
            <select
              id="area-filter-select"
              className="cs-filter-select"
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

          {/* Waste Type Filter */}
          <div className="cs-filter-group">
            <label htmlFor="waste-type-filter-select" className="cs-filter-label">
              Waste Type:
            </label>
            <select
              id="waste-type-filter-select"
              className="cs-filter-select"
              value={selectedWasteType}
              onChange={(e) => setSelectedWasteType(e.target.value)}
            >
              <option value="">All Waste Types</option>
              {WASTE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Collection Day Filter */}
          <div className="cs-filter-group">
            <label htmlFor="day-filter-select" className="cs-filter-label">
              Day:
            </label>
            <select
              id="day-filter-select"
              className="cs-filter-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">All Days</option>
              {COLLECTION_DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="cs-clear-filters-btn"
              icon="🔄"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Status Bar */}
      <div className="cs-status-bar">
        <div className="cs-results-count">
          Showing <strong>{filteredSchedules.length}</strong> of{' '}
          <strong>{schedules.length}</strong> collection schedules
        </div>

        {hasActiveFilters && (
          <div className="cs-active-filter-pills">
            {searchQuery.trim() && (
              <span className="cs-pill">
                Keyword: &ldquo;{searchQuery.trim()}&rdquo;
              </span>
            )}
            {selectedArea && <span className="cs-pill">Area: {selectedArea}</span>}
            {selectedWasteType && (
              <span className="cs-pill">Type: {selectedWasteType}</span>
            )}
            {selectedDay && <span className="cs-pill">Day: {selectedDay}</span>}
          </div>
        )}
      </div>

      {/* Schedule Listing / Empty States */}
      {schedules.length === 0 ? (
        /* Empty State: No schedules at all in database */
        <div className="cs-empty-state">
          <div className="cs-empty-icon">📅</div>
          <h3 className="cs-empty-title">No collection schedules found.</h3>
          <p className="cs-empty-desc">
            There are currently no community waste collection schedules in the system. You can add a
            new schedule or restore the default Sri Lankan prototype data.
          </p>
          <div className="cs-empty-actions">
            <Button
              variant="primary"
              onClick={handleOpenCreate}
              icon="➕"
            >
              Add Collection Schedule
            </Button>
            <Button
              variant="outline"
              onClick={handleRestoreSampleData}
              icon="🔄"
            >
              Restore Sample Data
            </Button>
          </div>
        </div>
      ) : filteredSchedules.length === 0 ? (
        /* Empty State: No search / filter results matching query */
        <div className="cs-empty-state">
          <div className="cs-empty-icon">🔍</div>
          <h3 className="cs-empty-title">No collection schedules match your search.</h3>
          <p className="cs-empty-desc">
            We couldn&apos;t find any schedules matching your criteria. Try adjusting your search term
            or resetting the active filters.
          </p>
          <div className="cs-empty-actions">
            <Button
              variant="primary"
              onClick={clearFilters}
              icon="🔄"
            >
              Clear Filters
            </Button>
            <Button
              variant="outline"
              onClick={handleOpenCreate}
              icon="➕"
            >
              Add New Schedule
            </Button>
          </div>
        </div>
      ) : (
        /* Schedule Cards Grid */
        <div className="cs-grid">
          {filteredSchedules.map((schedule) => {
            const badge = getWasteBadge(schedule.wasteType)

            return (
              <article key={schedule.id} className="cs-card">
                {/* Header */}
                <div className="cs-card-header">
                  <div className="cs-card-area-group">
                    <span className="cs-card-pin" aria-hidden="true">
                      📍
                    </span>
                    <h3 className="cs-card-area">{schedule.area}</h3>
                  </div>
                  <span className={`cs-badge ${badge.className}`}>
                    <span>{badge.icon}</span>
                    <span>{schedule.wasteType}</span>
                  </span>
                </div>

                {/* Body */}
                <div className="cs-card-body">
                  <div className="cs-card-timing-box">
                    <div className="cs-card-timing-col">
                      <span className="cs-card-timing-icon" aria-hidden="true">
                        📅
                      </span>
                      <span className="cs-card-timing-text">{schedule.collectionDay}</span>
                    </div>
                    <span className="cs-card-timing-divider" aria-hidden="true">
                      •
                    </span>
                    <div className="cs-card-timing-col">
                      <span className="cs-card-timing-icon" aria-hidden="true">
                        ⏰
                      </span>
                      <span className="cs-card-timing-text">{schedule.collectionTime}</span>
                    </div>
                  </div>

                  {schedule.notes && (
                    <p className="cs-card-notes" title={schedule.notes}>
                      {schedule.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="cs-card-footer">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingSchedule(schedule)}
                    icon="👁️"
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(schedule)}
                    icon="✏️"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRequestDelete(schedule)}
                    icon="🗑️"
                  >
                    Delete
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Create / Edit Schedule Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setEditingSchedule(null)
        }}
        title={editingSchedule ? 'Edit Collection Schedule' : 'Add Collection Schedule'}
        size="md"
      >
        <CollectionScheduleForm
          key={editingSchedule ? editingSchedule.id : 'new'}
          initialData={editingSchedule}
          onSubmit={handleSaveSchedule}
          onCancel={() => {
            setIsFormModalOpen(false)
            setEditingSchedule(null)
          }}
        />
      </Modal>

      {/* View Schedule Details Modal */}
      <Modal
        isOpen={Boolean(viewingSchedule)}
        onClose={() => setViewingSchedule(null)}
        title="Collection Schedule Details"
        size="md"
      >
        <CollectionScheduleDetails
          schedule={viewingSchedule}
          onClose={() => setViewingSchedule(null)}
          onEdit={(sch) => handleOpenEdit(sch)}
          onDelete={(sch) => handleRequestDelete(sch)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingSchedule)}
        onClose={() => setDeletingSchedule(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="cs-delete-dialog">
          <div className="cs-delete-warning-box">
            <span className="cs-delete-warning-icon">⚠️</span>
            <p className="cs-delete-text">
              Are you sure you want to delete this collection schedule?
            </p>
          </div>

          {deletingSchedule && (
            <div className="cs-delete-item-preview">
              <strong>{deletingSchedule.area}</strong> — {deletingSchedule.wasteType}
              <br />
              {deletingSchedule.collectionDay} at {deletingSchedule.collectionTime}
            </div>
          )}

          <div className="cs-delete-actions">
            <Button
              variant="outline"
              onClick={() => setDeletingSchedule(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              icon="🗑️"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
