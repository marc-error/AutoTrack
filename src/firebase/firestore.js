import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './config'

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

export const createStaffProfile = async (uid, profileData) => {
  try {
    const docRef = doc(db, STAFF_COLLECTION, uid)
    await setDoc(docRef, {
      ...profileData,
      createdAt: serverTimestamp(),
      isActive: true
    })
    return { error: null }
  } catch (error) {
    return { error: 'Failed to create staff profile.' }
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

export const getAllStaff = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, STAFF_COLLECTION))
    const staffList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { data: staffList, error: null }
  } catch (error) {
    return { data: [], error: 'Failed to fetch staff list.' }
  }
}

export const getStaffByRole = async (role) => {
  try {
    const q = query(collection(db, STAFF_COLLECTION), where('role', '==', role))
    const querySnapshot = await getDocs(q)
    const staffList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { data: staffList, error: null }
  } catch (error) {
    return { data: [], error: 'Failed to fetch staff by role.' }
  }
}
