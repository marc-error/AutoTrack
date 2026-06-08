import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../config/firebase'

export const STAFF_COLLECTION = 'staff'

export const getStaffProfile = async (uid) => {
  try {
    const docRef = doc(db, STAFF_COLLECTION, uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null }
    } else {
      return { data: null, error: 'Staff profile not found.' }
    }
  } catch (error) {
    return { data: null, error: 'Failed to fetch staff profile.' }
  }
}

export const updateStaffProfile = async (uid, updates) => {
  try {
    const docRef = doc(db, STAFF_COLLECTION, uid)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    return { error: null }
  } catch (error) {
    return { error: 'Failed to update staff profile.' }
  }
}
