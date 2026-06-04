import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './LoginModal.css'

const REMEMBER_KEY = 'autotrack_remember_email'

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const { login, authError, clearError } = useAuth()

  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem(REMEMBER_KEY)
      if (savedEmail) {
        setEmail(savedEmail)
        setRememberMe(true)
      }
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      return
    }

    setIsSubmitting(true)
    const result = await login(email, password)

    if (result.user) {
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, email.trim())
      } else {
        localStorage.removeItem(REMEMBER_KEY)
      }
      setEmail('')
      setPassword('')
      onClose()
    }

    setIsSubmitting(false)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      setEmail('')
      setPassword('')
      setShowPassword(false)
      clearError()
      onClose()
    }, 200)
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className={`login-modal-overlay${isClosing ? ' closing' : ''}`} onClick={handleOverlayClick}>
      <div className={`login-modal${isClosing ? ' closing' : ''}`}>
        <div className="login-modal-header">
          <h2>Staff Login</h2>
          <button className="login-modal-close" onClick={handleClose} title="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form className="login-modal-form" onSubmit={handleSubmit}>
          {authError && (
            <div className="login-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{authError}</span>
            </div>
          )}

          <div className="login-input-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 4L12 13 2 4"/>
                </svg>
              </span>
              <input
                id="login-email"
                type="email"
                className="login-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="login-password">Password</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="login-options-row">
            <label className="login-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
              />
              <span className="login-checkbox-mark"></span>
              <span className="login-checkbox-label">Remember me</span>
            </label>
            <button type="button" className="login-forgot-link" onClick={() => {}}>
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={isSubmitting || !email.trim() || !password.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="login-btn-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="login-modal-footer">
          <p>Authorized AutoTrack staff only</p>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
