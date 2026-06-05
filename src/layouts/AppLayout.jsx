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
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')
  const [mobileOpen, setMobileOpen] = useState(false)

  const pageId = location.pathname.replace('/', '') || 'home'
  const pageTitle = titles[pageId] || 'Home'

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
  }, [collapsed])

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
          <div id="page-container">
            <Outlet />
          </div>
        </div>
      </main>
    </AuthProvider>
  )
}
