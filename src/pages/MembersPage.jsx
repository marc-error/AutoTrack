import { useCollection } from '../hooks/useFirestore'
import { ROLE_LABELS } from '../utils/roles'
import { useAuth } from '../context/AuthContext'

const roleBadgeClass = (role) => {
  switch (role) {
    case 'admin': return 'role-badge role-admin'
    case 'manager': return 'role-badge role-manager'
    default: return 'role-badge role-staff'
  }
}

export default function MembersPage() {
  const { data: rawStaffList, loading, error } = useCollection('staff')
  const staffList = [...rawStaffList].sort((a, b) =>
    (a.displayName || '').localeCompare(b.displayName || '')
  )
  const { staffProfile } = useAuth()

  if (loading) {
    return (
      <div className="members-page">
        <div className="members-loading">
          <div className="login-spinner" style={{ width: 32, height: 32 }}></div>
          <p>Loading staff members...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="members-page">
        <div className="members-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3>Something went wrong</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="members-page">
      <div className="members-header">
        <div className="members-header-info">
          <h2>Staff Members</h2>
          <p>{staffList.length} team member{staffList.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {staffList.length === 0 ? (
        <div className="members-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/>
            <path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <h3>No staff members found</h3>
          <p>Add staff members in the Firebase Console under the "staff" collection.</p>
        </div>
      ) : (
        <div className="members-grid">
          {staffList.map(member => (
            <div key={member.id} className="member-card">
              <div className="member-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 21v-1a6 6 0 0112 0v1"/>
                </svg>
              </div>
              <div className="member-info">
                <h3 className="member-name">{member.displayName || 'Unnamed'}</h3>
                <p className="member-email">{member.email}</p>
                <div className="member-meta">
                  <span className={roleBadgeClass(member.role)}>
                    {ROLE_LABELS[member.role] || member.role}
                  </span>
                  <span className={`member-status ${member.isActive ? 'status-active' : 'status-inactive'}`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
