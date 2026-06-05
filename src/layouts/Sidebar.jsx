import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import LoginModal from '../components/LoginModal'
import { ROLE_LABELS } from '../utils/roles'

const THEME_KEY = 'autotrack_theme'

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark')
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, staffProfile, hasMinRole } = useAuth()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (window.innerWidth <= 768) onCloseMobile()
  }, [location, onCloseMobile])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleLoginClick = () => {
    setLoginModalOpen(true)
  }

  const handleLoginClose = () => {
    setLoginModalOpen(false)
  }

  const navClass = ({ isActive }) => `nav-item${isActive ? ' active' : ''}`

  return (
    <>
      <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-full">
              <span className="logo-a">A</span>
              <span className="logo-rest">UTOTRACK</span>
            </span>
          </div>
        </div>

        <div className="sidebar-static">
          <div className="sidebar-card-group">
            <NavLink to="/home" className={navClass}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10.5L12 3l9 7.5"/>
                <path d="M5 9.5V19a1 1 0 001 1h12a1 1 0 001-1V9.5"/>
              </svg>
              <span>Home</span>
            </NavLink>
            <NavLink to="/search" className={navClass}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"/>
                <path d="M16 16l4.5 4.5"/>
              </svg>
              <span>Search</span>
            </NavLink>
            <NavLink to="/browse" className={navClass}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
              </svg>
              <span>Browse</span>
            </NavLink>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-card-group menu-card">
            <div className="menu-card-items">
              {isAuthenticated && (
                <>
                  <div className="sidebar-label">MENU</div>
                  <NavLink to="/inventory" className={navClass}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
                    </svg>
                    <span>Inventory</span>
                  </NavLink>
                  <NavLink to="/vehicle" className={navClass}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a2 2 0 100 4 2 2 0 000-4zM19 17a2 2 0 100 4 2 2 0 000-4z"/>
                    </svg>
                    <span>Vehicle</span>
                  </NavLink>
                  <NavLink to="/billing" className={navClass}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2"/>
                      <path d="M1 10h22"/>
                    </svg>
                    <span>Billing</span>
                  </NavLink>
                  <NavLink to="/notification" className={navClass}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 01-3.46 0"/>
                    </svg>
                    <span>Notification</span>
                  </NavLink>
                  <NavLink to="/history" className={navClass}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    <span>History</span>
                  </NavLink>
                  {hasMinRole('manager') && (
                    <NavLink to="/reports" className={navClass}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 20V10M12 20V4M6 20v-6"/>
                      </svg>
                      <span>Reports</span>
                    </NavLink>
                  )}
                  {hasMinRole('admin') && (
                    <NavLink to="/members" className={navClass}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                        <path d="M16 3.13a4 4 0 010 7.75"/>
                      </svg>
                      <span>Members</span>
                    </NavLink>
                  )}
                </>
              )}
            </div>
            <div className="menu-card-bottom">
              <button className="theme-toggle" title="Toggle theme" onClick={toggleTheme}>
                <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
                <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
                <span className="theme-toggle-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>

          <div className="sidebar-card-group profile-card">
            {isAuthenticated ? (
              <NavLink to="/account" className={({ isActive }) => `nav-item profile-item${isActive ? ' active' : ''}`}>
                <div className="profile-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 21v-1a6 6 0 0112 0v1"/>
                  </svg>
                </div>
                <div className="profile-info">
                    <span className="profile-name">{staffProfile?.displayName ? staffProfile.displayName.charAt(0).toUpperCase() + staffProfile.displayName.slice(1) : 'Staff'}</span>
                </div>
              </NavLink>
            ) : (
              <button className="nav-item profile-item login-btn" onClick={handleLoginClick}>
                <div className="profile-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <div className="profile-info">
                  <span className="profile-name">Staff Login</span>
                </div>
              </button>
            )}
          </div>
        </nav>

        <button className="sidebar-toggle" title="Collapse sidebar" onClick={onToggleCollapse}>
          <i className="fas fa-chevron-left"></i>
        </button>
      </aside>

      {mobileOpen && <div className="sidebar-overlay show" onClick={onCloseMobile}></div>}

      <LoginModal isOpen={loginModalOpen} onClose={handleLoginClose} />
    </>
  )
}
