import { adminAuth } from '../config/firebase.js'

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const requireRole = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
      const { getFirestore } = await import('firebase-admin/firestore')
      const db = getFirestore()
      const userDoc = await db.collection('staff').doc(req.user.uid).get()

      if (!userDoc.exists) {
        return res.status(403).json({ error: 'Staff profile not found' })
      }

      const userRole = userDoc.data().role

      if (!roles.includes(userRole)) {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }

      req.userRole = userRole
      next()
    } catch (error) {
      return res.status(500).json({ error: 'Failed to verify role' })
    }
  }
}
