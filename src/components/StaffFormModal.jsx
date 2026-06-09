import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function StaffFormModal({ isOpen, onClose, onSubmit, staff = null }) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [tempPassword, setTempPassword] = useState(null)
  const [showEmailChange, setShowEmailChange] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailChangeLoading, setEmailChangeLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('staff')
  const [age, setAge] = useState('')
  const [sex, setSex] = useState('')
  const [birthday, setBirthday] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [password, setPassword] = useState('')

  const isEditing = !!staff

  useEffect(() => {
    if (isOpen && staff) {
      setDisplayName(staff.displayName || '')
      setEmail(staff.email || '')
      setRole(staff.role || 'staff')
      setAge(staff.age || '')
      setSex(staff.sex || '')
      setBirthday(staff.birthday || '')
      setPhotoURL(staff.photoURL || '')
      setIsActive(staff.isActive !== false)
      setError(null)
      setTempPassword(null)
      setShowEmailChange(false)
      setNewEmail('')
      setEmailChangeLoading(false)
      setShowPassword(false)
      setPassword('')
    } else if (isOpen) {
      setDisplayName('')
      setEmail('')
      setRole('staff')
      setAge('')
      setSex('')
      setBirthday('')
      setPhotoURL('')
      setIsActive(true)
      setError(null)
      setTempPassword(null)
      setShowEmailChange(false)
      setNewEmail('')
      setEmailChangeLoading(false)
      setShowPassword(false)
      setPassword('')
    }
  }, [isOpen, staff])

  if (!isOpen) return null

  const handleClose = () => {
    setError(null)
    setTempPassword(null)
    setShowEmailChange(false)
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
    if (!isEditing && password.trim() && password.trim().length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await onSubmit({
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        role,
        age: age ? Number(age) : null,
        sex: sex || null,
        birthday: birthday || null,
        photoURL: photoURL.trim() || null,
        isActive,
        password: password.trim() || undefined
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

  const handleResetPassword = async () => {
    setError(null)
    setEmailChangeLoading(true)
    try {
      const token = await user.getIdToken()
      const res = await fetch(`/api/staff/${staff.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Failed to reset password')
      }
      setTempPassword(json.data.tempPassword)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setEmailChangeLoading(false)
    }
  }

  const handleUpdateEmail = async (e) => {
    e.preventDefault()
    setError(null)

    if (!newEmail.trim()) {
      setError('New email is required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError('Invalid email format.')
      return
    }
    if (newEmail.toLowerCase() === email.toLowerCase()) {
      setError('New email must be different from current email.')
      return
    }

    setEmailChangeLoading(true)
    try {
      const token = await user.getIdToken()
      const res = await fetch(`/api/staff/${staff.id}/update-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newEmail: newEmail.trim().toLowerCase() })
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Failed to update email')
      }
      setEmail(json.data.email)
      setNewEmail('')
      setShowEmailChange(false)
      setError(null)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setEmailChangeLoading(false)
    }
  }

  return (
    <div className="staff-form-panel-inner">
      <div className="staff-form-header">
        <h3>{tempPassword ? 'Password Reset' : isEditing ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
      </div>

      <div className="staff-form-divider"></div>

      {tempPassword ? (
        <div className="staff-form-body">
          <div className="staff-form-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p>Password reset for <strong>{displayName}</strong>.</p>
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
            <button type="button" className="staff-form-submit" onClick={() => setTempPassword(null)}>
              Done
            </button>
          </div>
        </div>
      ) : showEmailChange ? (
        <form className="staff-form-body" onSubmit={handleUpdateEmail}>
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
            <label htmlFor="staff-current-email">Current Email</label>
            <input
              id="staff-current-email"
              type="email"
              className="form-input"
              value={email}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="staff-new-email">New Email</label>
            <input
              id="staff-new-email"
              type="email"
              className="form-input"
              placeholder="Enter new email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={emailChangeLoading}
              required
            />
          </div>

          <div className="staff-form-actions">
            <button type="button" className="btn-edit" onClick={() => { setShowEmailChange(false); setNewEmail(''); setError(null) }} disabled={emailChangeLoading}>
              Cancel
            </button>
            <button type="submit" className="staff-form-submit" disabled={emailChangeLoading}>
              {emailChangeLoading ? 'Updating...' : 'Update Email'}
            </button>
          </div>
        </form>
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
            <div className="flex-row">
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
              {isEditing && (
                <button
                  type="button"
                  className="staff-form-email-btn"
                  onClick={() => setShowEmailChange(true)}
                  title="Change email"
                  disabled={isSubmitting}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="form-group">
              <label htmlFor="staff-password">Password (Optional)</label>
              <div className="flex-row-relative">
                <input
                  id="staff-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Leave blank for auto-generated password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  minLength={6}
                />
                <button
                  type="button"
                  className="staff-form-email-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="form-group">
              <label>Reset Password</label>
              <button
                type="button"
                className="staff-form-reset-banner"
                onClick={handleResetPassword}
                disabled={isSubmitting || emailChangeLoading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4v6h6"/>
                  <path d="M23 20v-6h-6"/>
                  <path d="M20.49 9A9 9 0 05.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 03.51 15"/>
                </svg>
                Reset Password
              </button>
            </div>
          )}

          <div className="staff-form-row-3">
            <div className="form-group">
              <label htmlFor="staff-role">Role</label>
              <div className="select-wrapper">
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
            </div>
            <div className="form-group">
              <label htmlFor="staff-age">Age</label>
              <input
                id="staff-age"
                type="number"
                className="form-input"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={isSubmitting}
                min="0"
                max="150"
              />
            </div>
            <div className="form-group">
              <label htmlFor="staff-sex">Sex</label>
              <div className="select-wrapper">
                <select
                  id="staff-sex"
                  className="form-input form-select"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>

          <div className="staff-form-row-2">
            <div className="form-group">
              <label htmlFor="staff-birthday">Birthday</label>
              <input
                id="staff-birthday"
                type="date"
                className="form-input"
                placeholder="MM/DD/YYYY"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="staff-photoURL">Photo URL (Optional)</label>
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
