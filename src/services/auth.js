// * Firebase Authentication helpers — wraps signIn/signOut/onAuthStateChanged
// * with error handling and user-friendly error messages.
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../config/firebase'

// Sign in with email/password. Returns { user, error } — check error for failure.
export const loginWithEmail = async (email, password) => {
  if (!auth) {
    return { user: null, error: 'Firebase is not configured. Please set up your .env file.' }
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error) {
    // ! Map Firebase auth error codes to user-friendly messages
    let errorMessage = 'Failed to login. Please check your credentials.'

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.'
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password.'
    }

    return { user: null, error: errorMessage }
  }
}

// Sign out the current user. Returns { error }.
export const logout = async () => {
  if (!auth) {
    return { error: 'Firebase is not configured.' }
  }

  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error: 'Failed to logout.' }
  }
}

// * Subscribe to Firebase auth state changes. Calls callback with the current
// * user (or null when signed out). Returns an unsubscribe function.
export const onAuthStateChange = (callback) => {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}
