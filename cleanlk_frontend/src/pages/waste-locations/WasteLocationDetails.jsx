/**
 * WasteLocationDetails.jsx
 * CleanLK — Waste Location / Disposal Facility Details
 */

import Button from '../../components/Button.jsx';

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

export default function WasteLocationDetails({
  location,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!location) return null;

  const badge = getLocationBadge(location.category);

  return (
    <div className="wl-details">
      <div className="wl-details-hero">
        <div>
          <h4 className="wl-details-title">{location.name}</h4>
          <span className="wl-details-area">📍 {location.area} District</span>
        </div>
        <span className={`wl-badge ${badge.className}`}>
          <span>{badge.icon}</span>
          <span>{location.category}</span>
        </span>
      </div>

      <div className="wl-details-grid">
        <div className="wl-details-box">
          <span className="wl-details-label">📍 Street Address</span>
          <strong className="wl-details-value">{location.address}</strong>
        </div>
        <div className="wl-details-box">
          <span className="wl-details-label">⏰ Operational Hours</span>
          <strong className="wl-details-value">{location.openHours}</strong>
        </div>
        <div className="wl-details-box">
          <span className="wl-details-label">📞 Contact Phone</span>
          <strong className="wl-details-value">{location.contact || 'Municipal Hotline'}</strong>
        </div>
        <div className="wl-details-box">
          <span className="wl-details-label">🗺️ GPS Coordinates</span>
          <strong className="wl-details-value">{location.coordinates || 'Available on request'}</strong>
        </div>
      </div>

      {location.acceptedWaste && location.acceptedWaste.length > 0 && (
        <div className="cs-details-notes-card">
          <h5 className="cs-details-notes-title">
            <span>♻️</span> Accepted Waste Categories
          </h5>
          <div className="wl-card-tags">
            {location.acceptedWaste.map((type) => (
              <span key={type} className="wl-mini-tag">
                ✓ {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {location.notes && (
        <div className="cs-details-notes-card">
          <h5 className="cs-details-notes-title">
            <span>📋</span> Resident Instructions
          </h5>
          <p className="cs-details-notes-body">{location.notes}</p>
        </div>
      )}

      <div className="wl-details-actions">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="danger" onClick={() => onDelete(location)} icon="🗑️">
            Delete
          </Button>
          <Button variant="primary" onClick={() => onEdit(location)} icon="✏️">
            Edit Location
          </Button>
        </div>
      </div>
    </div>
  );
}
