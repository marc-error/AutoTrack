// * Authentication context — manages Firebase auth state, loads the staff
// * profile from Firestore on login, and exposes role-checking helpers.
// * All auth-related state (user, profile, loading) lives here.
import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChange, loginWithEmail, logout as authLogout } from '../services/auth'
import { getStaffProfile, updateStaffProfile } from '../services/firestore'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [staffProfile, setStaffProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  // ! Listen for Firebase auth state changes. On login, fetch the staff
  // ! profile from Firestore. On logout, clear both user and profile.
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        const { data, error } = await getStaffProfile(firebaseUser.uid)

        if (data) {
          setStaffProfile(data)
        } else {
          setStaffProfile(null)
        }
      } else {
        setStaffProfile(null)
      }

      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    setAuthError(null)
    const result = await loginWithEmail(email, password)
    if (result.error) {
      setAuthError(result.error)
    }
    return result
  }

  const logout = async () => {
    const result = await authLogout()
    if (result.error) {
      setAuthError(result.error)
    } else {
      setUser(null)
      setStaffProfile(null)
    }
    return result
  }

  // ! Role hierarchy check: admin(3) > manager(2) > staff(1)
  // ! Used to conditionally render admin/manager-only UI elements.
  const hasMinRole = (requiredRole) => {
    if (!staffProfile) return false
    const hierarchy = { admin: 3, manager: 2, staff: 1 }
    return (hierarchy[staffProfile.role] || 0) >= (hierarchy[requiredRole] || 0)
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: 'Not authenticated' }
    const { error } = await updateStaffProfile(user.uid, updates)
    if (!error) {
      setStaffProfile(prev => ({ ...prev, ...updates }))
    }
    return { error }
  }

  const value = {
    user,
    staffProfile,
    loading,
    isAuthenticated: !!user,
    authError,
    login,
    logout,
    hasMinRole,
    updateProfile,
    clearError: () => setAuthError(null)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
