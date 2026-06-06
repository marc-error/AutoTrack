import { useState, useEffect } from 'react'

export default function StaffFormModal({ isOpen, onClose, onSubmit, staff = null }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [tempPassword, setTempPassword] = useState(null)

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('staff')
  const [photoURL, setPhotoURL] = useState('')
  const [isActive, setIsActive] = useState(true)

  const isEditing = !!staff

  useEffect(() => {
    if (isOpen && staff) {
      setDisplayName(staff.displayName || '')
      setEmail(staff.email || '')
      setRole(staff.role || 'staff')
      setPhotoURL(staff.photoURL || '')
      setIsActive(staff.isActive !== false)
      setError(null)
      setTempPassword(null)
    } else if (isOpen) {
      setDisplayName('')
      setEmail('')
      setRole('staff')
      setPhotoURL('')
      setIsActive(true)
      setError(null)
      setTempPassword(null)
    }
  }, [isOpen, staff])

  if (!isOpen) return null

  const handleClose = () => {
    setError(null)
    setTempPassword(null)
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!displayName.trim()) {
      setError('Display name is required.')
      return
    }
    if (!isEditing && !email.trim()) {
      setError('Email is required.')
      return
    }
    if (!isEditing && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await onSubmit({
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        role,
        photoURL: photoURL.trim() || null,
        isActive
      })
      if (result?.data?.tempPassword) {
        setTempPassword(result.data.tempPassword)
      } else {
        handleClose()
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="staff-form-panel-inner">
      <div className="staff-form-header">
        <h3>{tempPassword ? 'Staff Created Successfully' : isEditing ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
      </div>

      {tempPassword ? (
        <div className="staff-form-body">
          <div className="staff-form-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p>An account has been created for <strong>{displayName}</strong>.</p>
          </div>

          <div className="staff-form-password-box">
            <label>Temporary Password</label>
            <div className="staff-form-password-row">
              <code className="staff-form-password-value">{tempPassword}</code>
              <button
                type="button"
                className="staff-form-copy-btn"
                onClick={() => navigator.clipboard.writeText(tempPassword)}
              >
                Copy
              </button>
            </div>
            <span className="form-hint">Share this password with the staff member. They should change it after first login.</span>
          </div>

          <div className="staff-form-actions">
            <button type="button" className="staff-form-submit" onClick={handleClose}>
              Done
            </button>
          </div>
        </div>
      ) : (
        <form className="staff-form-body" onSubmit={handleSubmit}>
          {error && (
            <div className="staff-form-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="staff-displayName">Display Name</label>
            <input
              id="staff-displayName"
              type="text"
              className="form-input"
              placeholder="Enter full name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isSubmitting}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="staff-email">Email</label>
            <input
              id="staff-email"
              type="email"
              className="form-input"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isEditing}
              required={!isEditing}
            />
            {isEditing && <span className="form-hint">Email cannot be changed after creation.</span>}
          </div>

          <div className="form-group">
            <label htmlFor="staff-role">Role</label>
            <select
              id="staff-role"
              className="form-input form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="staff-photoURL">Photo URL (optional)</label>
            <input
              id="staff-photoURL"
              type="url"
              className="form-input"
              placeholder="https://example.com/photo.jpg"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <div className="form-row form-row-between">
              <label htmlFor="staff-active">Active</label>
              <label className="toggle-switch">
                <input
                  id="staff-active"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={isSubmitting}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="staff-form-actions">
            <button type="button" className="btn-edit" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="staff-form-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Staff'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
