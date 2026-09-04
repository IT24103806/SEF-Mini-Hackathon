/**
 * CleanLK — Responsive Navigation Bar Component
 * Styled to visually match Member 1's reference design.
 */

import { useState } from 'react'

export default function Navbar({ currentPath = '/collection-schedules', onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Waste Reports', path: '/waste-reports' },
    { label: 'Collection Schedule', path: '/collection-schedules' },
    { label: 'Waste Locations', path: '/waste-locations' },
    { label: 'Community Requests', path: '/community-requests' },
  ]

  const handleLinkClick = (e, path) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (onNavigate) {
      onNavigate(path)
    }
  }

  return (
    <header className="clk-navbar">
      <div className="clk-navbar-container">
        {/* Brand with green leaf icon badge */}
        <a
          href="/"
          className="clk-navbar-brand"
          onClick={(e) => handleLinkClick(e, '/')}
        >
          <div className="clk-brand-icon-box">
            <svg
              className="clk-leaf-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <span className="clk-brand-name">CleanLK</span>
        </a>

        {/* Center Nav Links */}
        <nav className="clk-navbar-nav" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentPath === item.path
            return (
              <a
                key={item.path}
                href={item.path}
                className={`clk-nav-link ${isActive ? 'is-active' : ''}`}
                onClick={(e) => handleLinkClick(e, item.path)}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* Right Action Button */}
        <div className="clk-navbar-actions">
          <button
            type="button"
            className="clk-nav-cta-btn"
            onClick={(e) => handleLinkClick(e, '/collection-schedules/add')}
          >
            + Add Schedule
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="clk-mobile-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="clk-hamburger-bar"></span>
          <span className="clk-hamburger-bar"></span>
          <span className="clk-hamburger-bar"></span>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="clk-mobile-nav">
          {navItems.map((item) => {
            const isActive = currentPath === item.path
            return (
              <a
                key={item.path}
                href={item.path}
                className={`clk-mobile-nav-link ${isActive ? 'is-active' : ''}`}
                onClick={(e) => handleLinkClick(e, item.path)}
              >
                {item.label}
              </a>
            )
          })}
          <button
            type="button"
            className="clk-nav-cta-btn"
            style={{ marginTop: '0.5rem', width: '100%', textAlign: 'center' }}
            onClick={(e) => handleLinkClick(e, '/collection-schedules/add')}
          >
            + Add Schedule
          </button>
        </div>
      )}
    </header>
  )
}
