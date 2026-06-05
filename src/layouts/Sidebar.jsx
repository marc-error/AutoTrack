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
          <div className="sidebar-card-group logo-card">
            <div className="sidebar-logo">
              <svg className="logo-icon" viewBox="0 0 511.825 512" fill="currentColor">
                <path d="M169.857 282.46l113.208-113.208 1.302-1.279c7.184-6.504 14.611-15.039 19.88-23.723 4.284-7.06 7.109-14.159 7.109-20.192 0-14.896-2.87-28.161.109-43.298l.039-.257c8.078-40.302 38.979-70.623 79.45-78.449 17.583-3.4 36.044-2.422 54.44 1.778 5.593 1.276 8.496 2.609 8.954 5.726.39 2.633-1.61 5.367-5.786 9.619l-.167.183-51.336 51.323c-4.673 4.663-7.065 7.05-7.851 9.585-2.342 7.534 3.084 21.713 6.133 28.536.87 1.947 1.7 3.802 2.375 5.48 1.677.676 3.532 1.505 5.481 2.376 6.826 3.049 20.998 8.473 28.536 6.133 2.536-.788 4.922-3.179 9.585-7.851 6.346-6.352 49.269-50.351 51.346-51.348 4.344-4.282 7.113-6.336 9.779-5.943 3.116.461 4.45 3.362 5.726 8.956 10.738 47.047-1.592 95.949-44.84 121.73-20.642 12.306-37.808 14.645-61.123 12.972-4.591-.328-9.265-.665-14.264-.665-6.033 0-13.133 2.826-20.192 7.109-8.332 5.056-16.613 12.017-22.918 19.003l-.896.992L228.38 343.304c-.252.252-.502.488-.747.723-7.185 6.506-14.612 15.039-19.881 23.724-4.283 7.06-7.109 14.159-7.109 20.192 0 31.883 5.39 45.701-12.307 75.387-14.587 24.471-39.385 41.219-67.29 46.615-17.583 3.401-36.044 2.423-54.44-1.776-5.593-1.276-8.495-2.61-8.956-5.726-.388-2.632 1.612-5.367 5.788-9.619l.167-.182c17.109-17.109 34.216-34.233 51.336-51.322 4.671-4.663 7.064-7.05 7.851-9.587 2.336-7.521-3.091-21.728-6.133-28.535-.871-1.949-1.7-3.804-2.375-5.482-1.677-.675-3.53-1.503-5.475-2.373-6.834-3.054-21.003-8.476-28.542-6.135-2.534.787-4.922 3.177-9.584 7.849-6.33 6.343-49.283 50.358-51.347 51.349-4.344 4.283-7.113 6.337-9.779 5.943-3.116-.459-4.45-3.361-5.726-8.955-4.199-18.396-5.177-36.857-1.777-54.441 5.396-27.902 22.147-52.704 46.617-67.289 29.645-17.674 44.81-12.308 75.387-12.308 6.033 0 13.132-2.825 20.191-7.108 8.604-5.221 17.062-12.56 23.543-19.682l2.065-2.106zm163.138-85.04L202.098 328.317c-12.181 12.181-30.595-6.234-18.414-18.414l130.897-130.897c12.18-12.18 30.593 6.233 18.414 18.414z"/>
              </svg>
              <span className="logo-full">
                <span className="logo-rest">AUTOTRACK</span>
              </span>
            </div>
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
              <button className="collapse-toggle" title="Collapse sidebar" onClick={() => {
                if (window.innerWidth <= 768) {
                  onCloseMobile()
                } else {
                  onToggleCollapse()
                }
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                <span className="collapse-toggle-label">Collapse</span>
              </button>
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

      </aside>

      {mobileOpen && <div className="sidebar-overlay show" onClick={onCloseMobile}></div>}

      <LoginModal isOpen={loginModalOpen} onClose={handleLoginClose} />
    </>
  )
}
