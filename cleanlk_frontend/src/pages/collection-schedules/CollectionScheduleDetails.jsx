/**
 * CollectionScheduleDetails.jsx
 * CleanLK — Collection Schedule Details Component
 * Displays a single collection schedule's full details clearly for residents and administrators.
 */

import Button from '../../components/Button.jsx'

/**
 * Returns a waste type icon and color accent
 */
function getWasteBadgeInfo(wasteType) {
  switch (wasteType) {
    case 'Organic Waste':
      return { icon: '🍃', colorClass: 'badge-organic' }
    case 'Recyclable Waste':
      return { icon: '♻️', colorClass: 'badge-recyclable' }
    case 'Plastic Waste':
      return { icon: '🧴', colorClass: 'badge-plastic' }
    case 'Glass Waste':
      return { icon: '🍾', colorClass: 'badge-glass' }
    case 'E-Waste':
      return { icon: '🔋', colorClass: 'badge-ewaste' }
    case 'Mixed Waste':
      return { icon: '🗑️', colorClass: 'badge-mixed' }
    case 'Household Waste':
    default:
      return { icon: '🏠', colorClass: 'badge-household' }
  }
}

export default function CollectionScheduleDetails({
  schedule,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!schedule) return null

  const badgeInfo = getWasteBadgeInfo(schedule.wasteType)

  return (
    <div className="cs-details">
      {/* Header Banner */}
      <div className="cs-details-hero">
        <div className="cs-details-area">
          <span className="cs-details-pin">📍</span>
          <div>
            <h4 className="cs-details-area-name">{schedule.area}</h4>
            <span className="cs-details-region">Sri Lanka Waste Collection Service</span>
          </div>
        </div>
        <div className={`cs-badge ${badgeInfo.colorClass}`}>
          <span>{badgeInfo.icon}</span>
          <span>{schedule.wasteType}</span>
        </div>
      </div>

      {/* Grid of Key Info */}
      <div className="cs-details-grid">
        <div className="cs-details-info-box">
          <div className="cs-details-info-icon">📅</div>
          <div>
            <span className="cs-details-info-label">Collection Day</span>
            <strong className="cs-details-info-value">{schedule.collectionDay}</strong>
          </div>
        </div>

        <div className="cs-details-info-box">
          <div className="cs-details-info-icon">⏰</div>
          <div>
            <span className="cs-details-info-label">Collection Time</span>
            <strong className="cs-details-info-value">{schedule.collectionTime}</strong>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="cs-details-notes-card">
        <h5 className="cs-details-notes-title">
          <span>📋</span> Collection Guidelines &amp; Notes
        </h5>
        <p className="cs-details-notes-body">
          {schedule.notes && schedule.notes.trim()
            ? schedule.notes
            : 'Standard municipal guidelines apply. Please place waste curbside before collection time in sealed bags.'}
        </p>
      </div>

      {/* Prototype tag */}
      <div className="cs-details-prototype-alert">
        <span>ℹ️</span> Sample schedule for university MVP demonstration.
      </div>

      {/* Actions */}
      <div className="cs-details-actions">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <div className="cs-details-actions-right">
          <Button
            variant="danger"
            onClick={() => onDelete(schedule)}
            icon="🗑️"
          >
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={() => onEdit(schedule)}
            icon="✏️"
          >
            Edit Schedule
          </Button>
        </div>
      </div>
    </div>
  )
}
