import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requiredRole, requiredPermission }) => {
  const { isAuthenticated, loading, staffProfile, hasMinRole } = useAuth()

  if (!isAuthenticated && loading) {
    return (
      <div className="page-placeholder" style={{ display: 'flex' }}>
        <div className="login-spinner" style={{ width: 32, height: 32 }}></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  if (requiredRole && staffProfile && !hasMinRole(requiredRole)) {
    return (
      <div className="page-placeholder" style={{ display: 'flex' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48, color: '#ef4444' }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
