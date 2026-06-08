import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../config/firebase'

export const loginWithEmail = async (email, password) => {
  if (!auth) {
    return { user: null, error: 'Firebase is not configured. Please set up your .env file.' }
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error) {
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

export const onAuthStateChange = (callback) => {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}
