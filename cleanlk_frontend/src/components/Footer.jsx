/**
 * CleanLK — Footer Component
 */

export default function Footer({ onNavigate }) {
  const handleNav = (e, path) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(path)
    }
  }

  return (
    <footer className="clk-footer">
      <div className="clk-footer-container">
        <div className="clk-footer-col">
          <div className="clk-footer-brand">
            <span className="clk-brand-icon">🌱</span>
            <span className="clk-brand-name">CleanLK</span>
          </div>
          <p className="clk-footer-tagline">
            Smart Community Waste Management Platform for Sri Lankan Municipalities & Residents.
          </p>
          <div className="clk-footer-badge">
            🇱🇰 Empowering Cleaner, Greener Neighborhoods
          </div>
        </div>

        <div className="clk-footer-col">
          <h4 className="clk-footer-heading">Platform Modules</h4>
          <ul className="clk-footer-links">
            <li>
              <a href="/waste-reports" onClick={(e) => handleNav(e, '/waste-reports')}>
                Waste Reports (M1)
              </a>
            </li>
            <li>
              <a href="/collection-schedules" onClick={(e) => handleNav(e, '/collection-schedules')}>
                Collection Schedules (M2)
              </a>
            </li>
            <li>
              <a href="/waste-locations" onClick={(e) => handleNav(e, '/waste-locations')}>
                Waste Locations (M3)
              </a>
            </li>
            <li>
              <a href="/community-requests" onClick={(e) => handleNav(e, '/community-requests')}>
                Community Requests (M4)
              </a>
            </li>
          </ul>
        </div>

        <div className="clk-footer-col">
          <h4 className="clk-footer-heading">Prototype Notice</h4>
          <p className="clk-footer-disclaimer">
            This application is an engineering MVP prototype for demonstration purposes. Schedules
            and locations reflect sample test data.
          </p>
          <p className="clk-footer-copy">
            &copy; {new Date().getFullYear()} CleanLK Project. Built with React &amp; Vite.
          </p>
        </div>
      </div>
    </footer>
  )
}
