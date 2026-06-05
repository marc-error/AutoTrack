import { useState, useEffect } from 'react'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../config/firebase'

export const useCollection = (collectionName, options = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!db) {
      setLoading(false)
      setError('Firebase is not configured.')
      return
    }

    let q = collection(db, collectionName)

    if (options.where) {
      q = query(q, where(options.where.field, options.where.operator, options.where.value))
    }

    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'))
    }

    if (options.limit) {
      q = query(q, firestoreLimit(options.limit))
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setData(docs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err)
        setError(`Failed to fetch ${collectionName}.`)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [collectionName])

  return { data, loading, error }
}

export const useDocument = (collectionName, docId) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!db || !docId) {
      setLoading(false)
      return
    }

    const unsubscribe = onSnapshot(
      doc(db, collectionName, docId),
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() })
        } else {
          setData(null)
        }
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error(`Error fetching document:`, err)
        setError('Failed to fetch document.')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [collectionName, docId])

  return { data, loading, error }
}

export const fetchCollection = async (collectionName, options = {}) => {
  try {
    let q = collection(db, collectionName)

    if (options.where) {
      q = query(q, where(options.where.field, options.where.operator, options.where.value))
    }

    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'))
    }

    if (options.limit) {
      q = query(q, firestoreLimit(options.limit))
    }

    const snapshot = await getDocs(q)
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return { data, error: null }
  } catch (error) {
    return { data: [], error: error.message }
  }
}

export const fetchDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null }
    } else {
      return { data: null, error: 'Document not found.' }
    }
  } catch (error) {
    return { data: null, error: error.message }
  }
}
