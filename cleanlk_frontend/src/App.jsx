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
        {currentPath === '/collection-schedules' || currentPath === '/collection-schedules/add' ? (
          /* Module 2: Collection Schedules CRUD */
          <CollectionSchedules
            key={currentPath}
            initialShowForm={currentPath === '/collection-schedules/add'}
          />
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
          <div className="cs-page-wrapper">
            {/* Hero Section Matching Screenshot 1 */}
            <section className="cs-hero-section">
              <div className="cs-hero-content">
                <div className="cs-hero-tag">
                  <span className="cs-tag-leaf">🍃</span> Cleaner Communities. Better Sri Lanka.
                </div>

                <h1 className="cs-hero-heading">
                  Keep Sri Lanka <br />
                  Clean, <br />
                  <span className="cs-hero-heading-highlight">One Report at a <br />Time.</span>
                </h1>

                <p className="cs-hero-subtext">
                  CleanLK makes it easier for Sri Lankan communities to report waste
                  problems, track local concerns and access useful waste-management information.
                </p>

                <div className="cs-hero-actions">
                  <button
                    type="button"
                    className="cs-hero-btn-primary"
                    onClick={() => navigate('/collection-schedules')}
                  >
                    Check Collection Schedules <span className="cs-btn-arrow">→</span>
                  </button>
                  <button
                    type="button"
                    className="cs-hero-btn-secondary"
                    onClick={() => navigate('/collection-schedules')}
                  >
                    View All Schedules
                  </button>
                </div>

                <div className="cs-hero-caption">
                  Simple • Community-driven • Built for Sri Lanka
                </div>
              </div>

              {/* Right Column: Hero Visual & Floating "Community Overview" Card (Screenshot 1) */}
              <div className="cs-hero-visual-col">
                <div className="cs-hero-banner-frame">
                  <div className="cs-hero-backdrop-visual">
                    <div className="cs-backdrop-overlay">
                      <div className="cs-backdrop-badge">
                        <span>🇱🇰</span> Smart Waste Platform
                      </div>
                    </div>
                  </div>

                  <div className="cs-floating-overview-card">
                    <div className="cs-floating-card-header">
                      <span className="cs-floating-card-title">Community Overview</span>
                      <div className="cs-floating-leaf-badge">
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="#166534"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                        </svg>
                      </div>
                    </div>

                    <div className="cs-floating-metrics-row">
                      <div className="cs-floating-metric">
                        <div className="cs-metric-value">{scheduleCount}</div>
                        <div className="cs-metric-label">Schedules Active</div>
                        <div className="cs-metric-bar cs-metric-bar--green"></div>
                      </div>

                      <div className="cs-floating-metric">
                        <div className="cs-metric-value">42</div>
                        <div className="cs-metric-label">In Progress</div>
                        <div className="cs-metric-bar cs-metric-bar--amber"></div>
                      </div>

                      <div className="cs-floating-metric">
                        <div className="cs-metric-value">86</div>
                        <div className="cs-metric-label">Resolved</div>
                        <div className="cs-metric-bar cs-metric-bar--emerald"></div>
                      </div>
                    </div>
                  </div>
                </div>
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
