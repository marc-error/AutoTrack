import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLE_LABELS } from '../utils/roles'
import LoginModal from '../components/LoginModal'
import ConfirmModal from '../components/ConfirmModal'

export default function AccountPage() {
  const { isAuthenticated, staffProfile, user, loading, logout } = useAuth()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setLogoutConfirmOpen(false)
    await logout()
    navigate('/home')
  }

  if (loading) {
    return (
      <div className="account-page">
        <div className="members-loading">
          <div className="login-spinner" style={{ width: 32, height: 32 }}></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="account-page">
        <div className="account-login-alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <p>Please click <strong>Staff Login</strong> in the sidebar to access your account.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="account-page">
      <div className="account-header">
        <div className="account-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 21v-1a6 6 0 0112 0v1"/>
          </svg>
        </div>
        <div className="account-header-info">
          <h2>{staffProfile?.displayName}</h2>
          <p>{staffProfile?.email || user?.email}</p>
          <span className="account-role">{ROLE_LABELS[staffProfile?.role] || staffProfile?.role}</span>
        </div>
        <div className="account-header-actions">
          <button className="account-switch-btn" onClick={() => setLoginModalOpen(true)}>
            Switch Account
          </button>
          <button className="account-logout-btn" onClick={() => setLogoutConfirmOpen(true)} title="Sign Out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="account-section">
        <h3>Account Details</h3>
        <div className="account-details">
          <div className="account-detail-row">
            <span className="detail-label">Display Name</span>
            <span className="detail-value">{staffProfile?.displayName}</span>
          </div>
          <div className="account-detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{staffProfile?.email || user?.email}</span>
          </div>
          <div className="account-detail-row">
            <span className="detail-label">Role</span>
            <span className="detail-value">{ROLE_LABELS[staffProfile?.role]} ({staffProfile?.role})</span>
          </div>
          <div className="account-detail-row">
            <span className="detail-label">Status</span>
            <span className="detail-value account-status-active">Active</span>
          </div>
        </div>
      </div>

      <div className="account-section">
        <h3>Debug Info</h3>
        <div className="account-details">
          <div className="account-detail-row">
            <span className="detail-label">Auth UID</span>
            <span className="detail-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{user?.uid}</span>
          </div>
          <div className="account-detail-row">
            <span className="detail-label">Profile Doc ID</span>
            <span className="detail-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{staffProfile?.id}</span>
          </div>
          <div className="account-detail-row">
            <span className="detail-label">Role Value</span>
            <span className="detail-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{staffProfile?.role}</span>
          </div>
        </div>
      </div>

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <ConfirmModal
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        danger
      />
    </div>
  )
}
