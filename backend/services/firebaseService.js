import { db } from '../config/firebase.js'

const COLLECTIONS = {
  STAFF: 'staff'
}

export const getAll = async (collectionName) => {
  const snapshot = await db.collection(collectionName).get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getById = async (collectionName, id) => {
  const doc = await db.collection(collectionName).doc(id).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() }
}

export const create = async (collectionName, id, data) => {
  await db.collection(collectionName).doc(id).set(data)
  return { id, ...data }
}

export const update = async (collectionName, id, data) => {
  await db.collection(collectionName).doc(id).update(data)
  const updated = await getById(collectionName, id)
  return updated
}

export const remove = async (collectionName, id) => {
  await db.collection(collectionName).doc(id).delete()
  return { id }
}

export const query = async (collectionName, field, operator, value) => {
  const snapshot = await db.collection(collectionName).where(field, operator, value).get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export { COLLECTIONS }
