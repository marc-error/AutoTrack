// * Main application shell — manages sidebar collapse state (desktop) and
// * mobile slide-out menu. Wraps all page content via React Router's <Outlet>.
import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { AuthProvider } from '../context/AuthContext'
import Sidebar from './Sidebar'

const STORAGE_KEY = 'autoparts_sidebar'

const titles = {
  home: 'Home',
  search: 'Search',
  browse: 'Browse',
  inventory: 'Inventory',
  vehicle: 'Vehicle',
  billing: 'Billing',
  reports: 'Reports',
  notification: 'Notification',
  members: 'Members',
  history: 'History',
  account: 'Account',
}

export default function AppLayout() {
  const location = useLocation()
  // ! Persist sidebar collapsed state to localStorage so it survives page reloads
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')
  // Mobile sidebar open/close (only used on screens <= 768px)
  const [mobileOpen, setMobileOpen] = useState(false)

  const pageId = location.pathname.replace('/', '') || 'home'
  const pageTitle = titles[pageId] || 'Home'

  // Sync collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
  }, [collapsed])

  // ! Auto-close mobile sidebar on route change (prevents stale open state)
  useEffect(() => {
    if (window.innerWidth <= 768) setMobileOpen(false)
  }, [location])

  const toggleCollapse = () => setCollapsed(prev => !prev)
  const toggleMobile = () => setMobileOpen(prev => !prev)
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <AuthProvider>
      <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} mobileOpen={mobileOpen} onCloseMobile={closeMobile} />
      <main className={`main-content${collapsed ? ' collapsed-parent' : ''}`}>
        <header className="content-header">
          <button className="mobile-toggle" title="Toggle menu" onClick={toggleMobile}>
            <i className="fas fa-bars"></i>
          </button>
          <h1>{pageTitle}</h1>
        </header>

        <div className="content-body">
          {/* Outlet renders the matched child route (e.g., HomePage, SearchPage) */}
          <div id="page-container">
            <Outlet />
          </div>
        </div>
      </main>
    </AuthProvider>
  )
}
