/**
 * CommunityRequestDetails.jsx
 * CleanLK — Community Request Details Modal Component
 * Displays complete info on a community request with full action controls.
 */

import Button from '../../components/Button.jsx';

function getRequestTypeBadge(requestType) {
  switch (requestType) {
    case 'New Waste Bin':
      return { icon: '🗑️', className: 'badge-bin' };
    case 'Extra Collection':
      return { icon: '🚛', className: 'badge-pickup' };
    case 'Cleanup Request':
      return { icon: '🧹', className: 'badge-cleanup' };
    case 'Missing Collection Point':
    default:
      return { icon: '📍', className: 'badge-missing' };
  }
}

function getPriorityClass(priority) {
  switch (priority) {
    case 'High':
      return 'priority-high';
    case 'Medium':
      return 'priority-medium';
    case 'Low':
    default:
      return 'priority-low';
  }
}

export default function CommunityRequestDetails({
  request,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!request) return null;

  const typeBadge = getRequestTypeBadge(request.requestType);
  const priorityClass = getPriorityClass(request.priority);

  return (
    <div className="cr-details">
      <div className="cr-details-hero">
        <div>
          <h4 className="cr-details-title">{request.requestType}</h4>
          <span className="cr-details-area">📍 {request.area} District</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className={`cr-badge ${typeBadge.className}`}>
            <span>{typeBadge.icon}</span>
            <span>{request.requestType}</span>
          </span>
          <span className={`cr-badge ${priorityClass}`}>
            {request.priority} Priority
          </span>
        </div>
      </div>

      <div className="cr-details-grid">
        <div className="cr-details-box">
          <span className="cr-details-label">👤 Requested By</span>
          <strong className="cr-details-value">{request.name}</strong>
        </div>
        <div className="cr-details-box">
          <span className="cr-details-label">📌 Current Status</span>
          <strong className="cr-details-value" style={{ color: '#059669' }}>
            {request.status || 'Pending'}
          </strong>
        </div>
        <div className="cr-details-box">
          <span className="cr-details-label">📅 Submitted Date</span>
          <strong className="cr-details-value">
            {request.createdAt || new Date().toISOString().split('T')[0]}
          </strong>
        </div>
        <div className="cr-details-box">
          <span className="cr-details-label">🆔 Reference Code</span>
          <strong className="cr-details-value">{request.id}</strong>
        </div>
      </div>

      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
        <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#374151', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          📝 Description & Justification
        </h5>
        <p style={{ fontSize: '14px', color: '#1f2937', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
          {request.description}
        </p>
      </div>

      <div className="cr-details-actions">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="danger" onClick={() => onDelete(request)} icon="🗑️">
            Delete
          </Button>
          <Button variant="primary" onClick={() => onEdit(request)} icon="✏️">
            Edit Request
          </Button>
        </div>
      </div>
    </div>
  );
}
