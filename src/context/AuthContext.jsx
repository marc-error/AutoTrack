import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChange, loginWithEmail, logout as authLogout } from '../firebase/auth'
import { getStaffProfile, createStaffProfile } from '../firebase/firestore'
import { ROLES } from '../utils/roles'

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

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        console.log('Auth UID:', firebaseUser.uid)
        const { data, error } = await getStaffProfile(firebaseUser.uid)
        console.log('Staff profile:', data, 'Error:', error)

        if (data) {
          setStaffProfile(data)
        } else if (error === 'Staff profile not found.') {
          console.warn('No staff profile found for UID:', firebaseUser.uid, '- auto-creating with staff role')
          const newProfile = {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: ROLES.STAFF,
            photoURL: firebaseUser.photoURL
          }
          const { error: createError } = await createStaffProfile(firebaseUser.uid, newProfile)
          if (!createError) {
            setStaffProfile({ id: firebaseUser.uid, ...newProfile, isActive: true })
          }
        } else {
          console.error('Failed to fetch staff profile:', error)
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

  const hasRole = (role) => {
    if (!staffProfile) return false
    return staffProfile.role === role
  }

  const hasMinRole = (requiredRole) => {
    if (!staffProfile) return false
    const hierarchy = { admin: 3, manager: 2, staff: 1 }
    return (hierarchy[staffProfile.role] || 0) >= (hierarchy[requiredRole] || 0)
  }

  const value = {
    user,
    staffProfile,
    loading,
    isAuthenticated: !!user,
    authError,
    login,
    logout,
    hasRole,
    hasMinRole,
    clearError: () => setAuthError(null)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
