/**
 * CleanLK — Main Application Shell
 * Configured for multi-branch university hackathon collaboration.
 * Contains lightweight client-side routing, Navbar, Footer, and M2 Collection Schedules integration.
 */

import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import StatCard from './components/StatCard.jsx'
import Button from './components/Button.jsx'
import CollectionSchedules from './pages/collection-schedules/CollectionSchedules.jsx'
import { getCollectionScheduleCount } from './data/collectionSchedules.js'

export default function App() {
  // Sync router with browser location pathname
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname || '/'
  )

  // Listen for browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Navigation handler using HTML5 history pushState
  const navigate = (path) => {
    if (path !== currentPath) {
      window.history.pushState(null, '', path)
      setCurrentPath(path)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Live count for Collection Schedules (Module 2)
  const scheduleCount = getCollectionScheduleCount()

  return (
    <div className="clk-app-root">
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      <main className="clk-main-content">
        {currentPath === '/collection-schedules' ? (
          /* Module 2: Collection Schedules CRUD */
          <CollectionSchedules />
        ) : currentPath === '/waste-reports' ? (
          /* Module 1 Placeholder (for Member 1 branch merge) */
          <div className="cs-page-wrapper">
            <div className="cs-empty-state">
              <div className="cs-empty-icon">📢</div>
              <h2 className="cs-empty-title">Waste Reports (M1)</h2>
              <p className="cs-empty-desc">
                This module handles reporting uncollected waste, illegal dumping, and overflowing
                bins. Developed on branch <code>waste-reports</code>.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/collection-schedules')}
                icon="📅"
              >
                Go to Collection Schedules (M2)
              </Button>
            </div>
          </div>
        ) : currentPath === '/waste-locations' ? (
          /* Module 3 Placeholder (for Member 3 branch merge) */
          <div className="cs-page-wrapper">
            <div className="cs-empty-state">
              <div className="cs-empty-icon">📍</div>
              <h2 className="cs-empty-title">Waste Locations (M3)</h2>
              <p className="cs-empty-desc">
                This module handles public recycling centers, drop-off bins, and municipal disposal
                points. Developed on branch <code>waste-locations</code>.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/collection-schedules')}
                icon="📅"
              >
                Go to Collection Schedules (M2)
              </Button>
            </div>
          </div>
        ) : currentPath === '/community-requests' ? (
          /* Module 4 Placeholder (for Member 4 branch merge) */
          <div className="cs-page-wrapper">
            <div className="cs-empty-state">
              <div className="cs-empty-icon">🤝</div>
              <h2 className="cs-empty-title">Community Requests (M4)</h2>
              <p className="cs-empty-desc">
                This module handles special community clean-up drives, bulk waste requests, and
                neighborhood events. Developed on branch <code>community-requests</code>.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/collection-schedules')}
                icon="📅"
              >
                Go to Collection Schedules (M2)
              </Button>
            </div>
          </div>
        ) : (
          /* Default: CleanLK Home Overview Page */
          <div className="clk-home-page">
            {/* Hero Section */}
            <section className="clk-home-hero">
              <div className="cs-prototype-tag" style={{ marginBottom: '0.75rem' }}>
                🇱🇰 Smart Community Waste Management Platform
              </div>
              <h1>CleanLK — For a Cleaner Sri Lanka</h1>
              <p className="clk-home-hero-sub">
                Empowering Sri Lankan communities with scheduled waste pickups, issue reporting,
                recycling points, and community clean-up requests.
              </p>
              <div className="clk-home-hero-actions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/collection-schedules')}
                  icon="📅"
                >
                  Check Collection Schedules
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/collection-schedules')}
                  icon="🔍"
                >
                  Lookup Pickup by Area
                </Button>
              </div>
            </section>

            {/* Platform Stats Grid */}
            <div className="clk-stats-grid">
              <StatCard
                title="Active Collection Schedules"
                value={scheduleCount}
                icon="📅"
                badge="M2 Live"
                description="Regular community pickup timings across Sri Lanka"
                onClick={() => navigate('/collection-schedules')}
              />
              <StatCard
                title="Waste Reports"
                value="—"
                icon="📢"
                badge="M1 In Progress"
                description="Community reported waste issues and overflow spots"
                onClick={() => navigate('/waste-reports')}
              />
              <StatCard
                title="Waste Locations"
                value="—"
                icon="📍"
                badge="M3 In Progress"
                description="Designated public disposal and recycling drop-offs"
                onClick={() => navigate('/waste-locations')}
              />
              <StatCard
                title="Community Requests"
                value="—"
                icon="🤝"
                badge="M4 In Progress"
                description="Special bulk waste pickups and clean-up campaigns"
                onClick={() => navigate('/community-requests')}
              />
            </div>

            {/* Modules Overview */}
            <section className="clk-modules-section">
              <h2 className="clk-section-heading">Platform Modules</h2>
              <p className="clk-section-sub">
                Developed cooperatively for the University Software Engineering Hackathon.
              </p>

              <div className="clk-module-cards-grid">
                {/* M2 (Active) */}
                <div className="clk-module-card is-active-module">
                  <div className="clk-module-card-icon">📅</div>
                  <h3 className="clk-module-card-title">Collection Schedules</h3>
                  <span className="clk-module-tag clk-module-tag--ready">
                    ✅ M2 — Ready &amp; Functional
                  </span>
                  <p className="clk-module-card-desc">
                    Find out when waste is collected in Kegalle, Colombo, Kandy, and other areas.
                    Full CRUD with search, multi-filter, and validation.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/collection-schedules')}
                    icon="👉"
                  >
                    Open Schedules
                  </Button>
                </div>

                {/* M1 */}
                <div className="clk-module-card">
                  <div className="clk-module-card-icon">📢</div>
                  <h3 className="clk-module-card-title">Waste Reports</h3>
                  <span className="clk-module-tag clk-module-tag--pending">
                    ⏳ M1 — Teammate Branch
                  </span>
                  <p className="clk-module-card-desc">
                    Report uncollected garbage, illegal dump sites, and overflowing bins directly to
                    local authorities.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/waste-reports')}
                  >
                    View Status
                  </Button>
                </div>

                {/* M3 */}
                <div className="clk-module-card">
                  <div className="clk-module-card-icon">📍</div>
                  <h3 className="clk-module-card-title">Waste Locations</h3>
                  <span className="clk-module-tag clk-module-tag--pending">
                    ⏳ M3 — Teammate Branch
                  </span>
                  <p className="clk-module-card-desc">
                    Locate official recycling hubs, glass deposit bins, and municipal compost
                    centers on an interactive map.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/waste-locations')}
                  >
                    View Status
                  </Button>
                </div>

                {/* M4 */}
                <div className="clk-module-card">
                  <div className="clk-module-card-icon">🤝</div>
                  <h3 className="clk-module-card-title">Community Requests</h3>
                  <span className="clk-module-tag clk-module-tag--pending">
                    ⏳ M4 — Teammate Branch
                  </span>
                  <p className="clk-module-card-desc">
                    Submit requests for neighborhood clean-up drives, bulk item collections, and
                    e-waste drives.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/community-requests')}
                  >
                    View Status
                  </Button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  )
}
