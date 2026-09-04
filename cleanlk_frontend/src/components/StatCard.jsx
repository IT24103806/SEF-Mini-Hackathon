/**
 * CleanLK — Reusable StatCard Component
 * Displays key metrics on dashboards or Home page.
 */

export default function StatCard({
  title,
  value,
  icon,
  description,
  badge,
  className = '',
  onClick,
}) {
  return (
    <div
      className={`clk-stat-card ${onClick ? 'is-clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="clk-stat-card-header">
        <span className="clk-stat-card-title">{title}</span>
        {icon && <span className="clk-stat-card-icon">{icon}</span>}
      </div>
      <div className="clk-stat-card-value-row">
        <div className="clk-stat-card-value">{value}</div>
        {badge && <span className="clk-stat-card-badge">{badge}</span>}
      </div>
      {description && <p className="clk-stat-card-desc">{description}</p>}
    </div>
  )
}
