import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLE_LABELS } from '../utils/roles'
import LoginModal from '../components/LoginModal'
import ConfirmModal from '../components/ConfirmModal'
import TabsCard from '../components/account-tabs/TabsCard'
import NotesTab from '../components/account-tabs/NotesTab'
import CalculatorTab from '../components/account-tabs/CalculatorTab'
import EditProfileTab from '../components/account-tabs/EditProfileTab'

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

  const initials = staffProfile?.displayName
    ? staffProfile.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const joinedDate = staffProfile?.createdAt
    ? new Date(staffProfile.createdAt.seconds ? staffProfile.createdAt.seconds * 1000 : staffProfile.createdAt).toLocaleDateString()
    : null

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
      <div className="account-card">
        <div className="account-card-left">
          <div className="account-avatar">
            {(user?.photoURL || staffProfile?.photoURL) ? (
              <>
                <img src={user?.photoURL || staffProfile?.photoURL} alt={staffProfile?.displayName} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                <span className="account-avatar-initials" style={{ display: 'none' }}>{initials}</span>
              </>
            ) : (
              <span className="account-avatar-initials">{initials}</span>
            )}
          </div>
        </div>

        <div className="account-card-center">
          <div className="account-name-row">
            <h2>{staffProfile?.displayName}</h2>
          </div>
          <div className="account-info-row">
            {staffProfile?.age && (
              <span>Age {staffProfile.age}</span>
            )}
            {staffProfile?.sex && (
              <>
                {staffProfile?.age && <span className="meta-sep">&middot;</span>}
                <span>{staffProfile.sex.charAt(0).toUpperCase() + staffProfile.sex.slice(1)}</span>
              </>
            )}
            {staffProfile?.birthday && (
              <>
                {(staffProfile?.age || staffProfile?.sex) && <span className="meta-sep">&middot;</span>}
                <span>{staffProfile.birthday}</span>
              </>
            )}
            {(staffProfile?.age || staffProfile?.sex || staffProfile?.birthday) && <span className="meta-sep">&middot;</span>}
            <span>{ROLE_LABELS[staffProfile?.role] || staffProfile?.role}</span>
          </div>
          <div className="account-status-row">
            {joinedDate && (
              <span className="account-status-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Arrived {joinedDate}</span>
              </span>
            )}
            <span className="account-status-divider"></span>
            <span className="account-status-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
              <span>Status</span>
              <span className={`status-dot ${staffProfile?.isActive !== false ? 'active' : 'inactive'}`}></span>
              <span>{staffProfile?.isActive !== false ? 'Active' : 'Inactive'}</span>
            </span>
          </div>
        </div>

        <div className="account-card-right">
          <div className="account-contact-chips">
            {user?.email && (
              <div className="contact-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 4l-10 8L2 4"/>
                </svg>
                <span>{user.email}</span>
              </div>
            )}
          </div>
          <div className="account-actions">
            <button className="account-action-btn" onClick={() => setLoginModalOpen(true)} title="Switch Account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 1l4 4-4 4"/>
                <path d="M3 11V9a4 4 0 014-4h14"/>
                <path d="M7 23l-4-4 4-4"/>
                <path d="M21 13v2a4 4 0 01-4 4H3"/>
              </svg>
              <span>Switch</span>
            </button>
            <button className="account-action-btn action-danger" onClick={() => setLogoutConfirmOpen(true)} title="Sign Out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <TabsCard
        tabs={[
          { id: 'notes', label: 'Notes', content: <NotesTab uid={user?.uid} /> },
          { id: 'calculator', label: 'Calculator', content: <CalculatorTab uid={user?.uid} /> },
          { id: 'editprofile', label: 'Edit Profile', content: <EditProfileTab /> }
        ]}
      />

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
