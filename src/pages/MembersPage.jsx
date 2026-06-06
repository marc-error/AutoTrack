import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { ROLE_LABELS } from '../utils/roles'
import StaffFormModal from '../components/StaffFormModal'
import ConfirmModal from '../components/ConfirmModal'

const roleBadgeClass = (role) => {
  switch (role) {
    case 'admin': return 'role-badge role-admin'
    case 'manager': return 'role-badge role-manager'
    default: return 'role-badge role-staff'
  }
}

export default function MembersPage() {
  const { user } = useAuth()
  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const [editingStaff, setEditingStaff] = useState(null)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingStaff, setDeletingStaff] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const getToken = useCallback(async () => {
    return user.getIdToken()
  }, [user])

  const apiRequest = useCallback(async (url, options = {}) => {
    const token = await getToken()
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers
      }
    })
    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.error || 'Request failed.')
    }
    return json
  }, [getToken])

  const fetchStaff = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const json = await apiRequest('/api/staff')
      setStaffList(json.data || [])
    } catch (err) {
      console.error('Error fetching staff:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [apiRequest])

  useEffect(() => {
    fetchStaff()
  }, [fetchStaff])

  const handleAdd = () => {
    setEditingStaff(null)
  }

  const handleEdit = (member) => {
    setEditingStaff(member)
  }

  const handleFormSubmit = async (data) => {
    let result
    if (editingStaff) {
      result = await apiRequest(`/api/staff/${editingStaff.id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    } else {
      result = await apiRequest('/api/staff', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    }
    await fetchStaff()
    return result
  }

  const handleDeleteClick = (member) => {
    setDeletingStaff(member)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingStaff) return
    setIsDeleting(true)
    try {
      await apiRequest(`/api/staff/${deletingStaff.id}`, { method: 'DELETE' })
      setShowDeleteConfirm(false)
      setDeletingStaff(null)
      await fetchStaff()
    } catch (err) {
      console.error('Error deleting staff:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredList = staffList.filter((member) => {
    const matchesSearch =
      !searchTerm ||
      (member.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="members-page">
        <div className="members-body">
          <div className="members-content">
            <div className="members-loading">
              <div className="login-spinner" style={{ width: 32, height: 32 }}></div>
              <p>Loading staff members...</p>
            </div>
          </div>
          <div className="members-form-panel open">
            <div className="members-loading" style={{ paddingTop: '400px' }}>
              <div className="login-spinner" style={{ width: 32, height: 32 }}></div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="members-page">
        <div className="members-body">
          <div className="members-content">
            <div className="members-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="members-retry-btn" onClick={fetchStaff}>Retry</button>
            </div>
          </div>
          <div className="members-form-panel open">
            <div className="members-loading" style={{ paddingTop: '400px' }}>
              <p>Please retry to continue</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="members-page">
      <div className="members-body">
        <div className="members-content">
          <div className="members-header">
            <div className="members-count">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              <span>{staffList.length} Staff</span>
            </div>
            <div className="members-filters">
              <input
                type="text"
                className="form-input members-search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="form-input form-select members-role-filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>
          <div className="members-table-wrapper">
            <table className="members-table">
              <thead>
                <tr>
                  <th className="col-name">Name</th>
                  <th className="col-contact">Contact</th>
                  <th className="col-role">Role</th>
                  <th className="col-status">Status</th>
                  <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <div className="members-empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                        <path d="M16 3.13a4 4 0 010 7.75"/>
                      </svg>
                      <h3>No staff members found</h3>
                      <p>{staffList.length === 0
                        ? 'Add staff members to get started.'
                        : 'No results match your search.'
                      }</p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredList.map((member) => (
                  <tr key={member.id}>
                    <td className="col-name">
                      <div className="members-name-cell">
                        <div className="members-avatar">
                          {member.photoURL ? (
                            <img src={member.photoURL} alt={member.displayName} />
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="8" r="4"/>
                              <path d="M4 21v-1a6 6 0 0112 0v1"/>
                            </svg>
                          )}
                        </div>
                        <div className="members-name-info">
                          <span className="members-name-text">{member.displayName || 'Unnamed'}</span>
                          <span className="members-name-role">{ROLE_LABELS[member.role] || member.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="col-contact">
                      <span className="members-email-text">{member.email}</span>
                    </td>
                    <td className="col-role">
                      <span className={roleBadgeClass(member.role)}>
                        {ROLE_LABELS[member.role] || member.role}
                      </span>
                    </td>
                    <td className="col-status">
                      <span className={`members-status-indicator ${member.isActive ? 'status-active' : 'status-inactive'}`}>
                        <span className="members-status-dot"></span>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="col-actions">
                      <div className="members-actions">
                        <button
                          className="members-action-btn"
                          title="Edit"
                          onClick={() => handleEdit(member)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          className="members-action-btn danger"
                          title="Delete"
                          onClick={() => handleDeleteClick(member)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        </div>

        <div className="members-form-panel open">
          <StaffFormModal
            isOpen={true}
            onClose={() => setEditingStaff(null)}
            onSubmit={handleFormSubmit}
            staff={editingStaff}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setDeletingStaff(null) }}
        onConfirm={handleDeleteConfirm}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${deletingStaff?.displayName || 'this member'}? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        danger
      />
    </div>
  )
}
