// * Route guard — checks auth state and role before rendering children.
// * Shows spinner while loading, redirects to /home if not authenticated,
// * shows AccountPending if no staff profile, or AccessDenied if role is insufficient.
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AccessDenied from '../components/AccessDenied'
import AccountPending from '../components/AccountPending'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, staffProfile, hasMinRole } = useAuth()

  if (loading) {
    return (
      <div className="status-page">
        <div className="status-card">
          <div className="login-spinner spinner-centered"></div>
          <p style={{ color: 'var(--text-secondary)', marginTop: 16 }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  if (!staffProfile) {
    return <AccountPending />
  }

  if (requiredRole && !hasMinRole(requiredRole)) {
    return <AccessDenied />
  }

  return children
}

export default ProtectedRoute
