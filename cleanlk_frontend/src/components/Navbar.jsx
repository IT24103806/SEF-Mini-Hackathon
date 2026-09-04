/**
 * CleanLK — Responsive Navigation Bar Component
 */

import { useState } from 'react'

export default function Navbar({ currentPath = '/collection-schedules', onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Waste Reports', path: '/waste-reports' },
    { label: 'Collection Schedules', path: '/collection-schedules' },
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
        {/* Brand */}
        <a
          href="/"
          className="clk-navbar-brand"
          onClick={(e) => handleLinkClick(e, '/')}
        >
          <span className="clk-brand-icon">🌱</span>
          <span className="clk-brand-name">
            Clean<span className="clk-brand-highlight">LK</span>
          </span>
          <span className="clk-brand-badge">Sri Lanka</span>
        </a>

        {/* Desktop Nav Links */}
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

        {/* Mobile Toggle Button */}
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

      {/* Mobile Drawer */}
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
        </div>
      )}
    </header>
  )
}
