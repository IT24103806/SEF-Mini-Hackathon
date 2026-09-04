/**
 * WasteReportModalDetails.jsx
 * CleanLK — Waste Report Details Modal Component
 */

import Button from '../../components/Button.jsx';

function getIssueBadge(issueType) {
  switch (issueType) {
    case 'Overflowing Bin':
      return { icon: '⚠️', className: 'badge-overflow' };
    case 'Illegal Dumping':
      return { icon: '🚫', className: 'badge-dumping' };
    case 'Hazardous Waste':
      return { icon: '☣️', className: 'badge-hazard' };
    case 'Drain Clog':
      return { icon: '🌊', className: 'badge-drain' };
    case 'Uncollected Garbage':
    default:
      return { icon: '🗑️', className: 'badge-general' };
  }
}

function getSeverityClass(severity) {
  switch (severity) {
    case 'Critical':
      return 'severity-critical';
    case 'High':
      return 'severity-high';
    case 'Medium':
      return 'severity-medium';
    case 'Low':
    default:
      return 'severity-low';
  }
}

export default function WasteReportModalDetails({
  report,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!report) return null;

  const issueBadge = getIssueBadge(report.issueType);
  const severityClass = getSeverityClass(report.severity);

  return (
    <div className="wr-details">
      <div className="wr-details-hero">
        <div>
          <h4 className="wr-details-title">{report.issueType}</h4>
          <span className="wr-details-area">📍 {report.area} District</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className={`wr-badge ${issueBadge.className}`}>
            <span>{issueBadge.icon}</span>
            <span>{report.issueType}</span>
          </span>
          <span className={`wr-badge ${severityClass}`}>
            {report.severity} Severity
          </span>
        </div>
      </div>

      <div className="wr-details-grid">
        <div className="wr-details-box">
          <span className="wr-details-label">👤 Reported By</span>
          <strong className="wr-details-value">{report.fullName || report.name || 'Anonymous Resident'}</strong>
        </div>
        <div className="wr-details-box">
          <span className="wr-details-label">📌 Current Status</span>
          <strong className="wr-details-value" style={{ color: '#059669' }}>
            {report.status || 'Reported'}
          </strong>
        </div>
        <div className="wr-details-box">
          <span className="wr-details-label">📅 Date Reported</span>
          <strong className="wr-details-value">
            {report.createdAt || report.date || new Date().toISOString().split('T')[0]}
          </strong>
        </div>
        <div className="wr-details-box">
          <span className="wr-details-label">🆔 Incident Reference</span>
          <strong className="wr-details-value">{report.id}</strong>
        </div>
      </div>

      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
        <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#374151', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          📝 Incident Description & Location Notes
        </h5>
        <p style={{ fontSize: '14px', color: '#1f2937', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
          {report.description}
        </p>
      </div>

      <div className="wr-details-actions">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="danger" onClick={() => onDelete(report)} icon="🗑️">
            Delete
          </Button>
          <Button variant="primary" onClick={() => onEdit(report)} icon="✏️">
            Edit Report
          </Button>
        </div>
      </div>
    </div>
  );
}
