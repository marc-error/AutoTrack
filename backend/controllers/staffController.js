import * as firebaseService from '../services/firebaseService.js'
import * as response from '../utils/response.js'
import { COLLECTIONS } from '../services/firebaseService.js'
import { FieldValue } from 'firebase-admin/firestore'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_REGEX = /^(https?:\/\/)/
const ALLOWED_ROLES = ['admin', 'manager', 'staff']

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str
  return str.replace(/<[^>]*>/g, '').trim()
}

const isValidUrl = (url) => {
  if (url === null || url === undefined) return true
  if (typeof url !== 'string') return false
  return URL_REGEX.test(url)
}

export const listStaff = async (req, res, next) => {
  try {
    const staff = await firebaseService.getAll(COLLECTIONS.STAFF)
    return response.success(res, staff)
  } catch (err) {
    next(err)
  }
}

export const getStaff = async (req, res, next) => {
  try {
    const isSelf = req.user && req.user.uid === req.params.id
    const isAdmin = req.userRole === 'admin'

    if (!isSelf && !isAdmin) {
      return response.error(res, 'Insufficient permissions', 403)
    }

    const staff = await firebaseService.getById(COLLECTIONS.STAFF, req.params.id)
    if (!staff) {
      return response.error(res, 'Staff not found', 404)
    }
    return response.success(res, staff)
  } catch (err) {
    next(err)
  }
}

export const createStaff = async (req, res, next) => {
  try {
    const { email, displayName, role, photoURL } = req.body

    if (!email || !displayName) {
      return response.error(res, 'email and displayName are required', 400)
    }

    if (!EMAIL_REGEX.test(email)) {
      return response.error(res, 'Invalid email format', 400)
    }

    if (typeof displayName !== 'string' || displayName.trim().length < 1 || displayName.trim().length > 100) {
      return response.error(res, 'displayName must be 1-100 characters', 400)
    }

    if (role && !ALLOWED_ROLES.includes(role)) {
      return response.error(res, 'Invalid role', 400)
    }

    if (!isValidUrl(photoURL)) {
      return response.error(res, 'photoURL must be a valid URL', 400)
    }

    const docId = email.toLowerCase().trim()
    const data = {
      email: email.toLowerCase().trim(),
      displayName: sanitizeString(displayName.trim()),
      role: role || 'staff',
      photoURL: photoURL || null,
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }

    const created = await firebaseService.create(COLLECTIONS.STAFF, docId, data)
    return response.success(res, created, 201)
  } catch (err) {
    next(err)
  }
}

export const updateStaff = async (req, res, next) => {
  try {
    const existing = await firebaseService.getById(COLLECTIONS.STAFF, req.params.id)
    if (!existing) {
      return response.error(res, 'Staff not found', 404)
    }

    const { email, displayName, role, photoURL, isActive } = req.body
    const updates = {}

    if (email !== undefined) {
      if (!EMAIL_REGEX.test(email)) {
        return response.error(res, 'Invalid email format', 400)
      }
      updates.email = email.toLowerCase().trim()
    }

    if (displayName !== undefined) {
      if (typeof displayName !== 'string' || displayName.trim().length < 1 || displayName.trim().length > 100) {
        return response.error(res, 'displayName must be 1-100 characters', 400)
      }
      updates.displayName = sanitizeString(displayName.trim())
    }

    if (role !== undefined) {
      if (!ALLOWED_ROLES.includes(role)) {
        return response.error(res, 'Invalid role', 400)
      }
      if (req.userRole !== 'admin') {
        return response.error(res, 'Only admins can change roles', 403)
      }
      updates.role = role
    }

    if (photoURL !== undefined) {
      if (!isValidUrl(photoURL)) {
        return response.error(res, 'photoURL must be a valid URL', 400)
      }
      updates.photoURL = photoURL
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return response.error(res, 'isActive must be a boolean', 400)
      }
      updates.isActive = isActive
    }

    if (Object.keys(updates).length === 0) {
      return response.error(res, 'No valid fields to update', 400)
    }

    updates.updatedAt = FieldValue.serverTimestamp()

    const updated = await firebaseService.update(COLLECTIONS.STAFF, req.params.id, updates)
    return response.success(res, updated)
  } catch (err) {
    next(err)
  }
}

export const deleteStaff = async (req, res, next) => {
  try {
    const existing = await firebaseService.getById(COLLECTIONS.STAFF, req.params.id)
    if (!existing) {
      return response.error(res, 'Staff not found', 404)
    }

    await firebaseService.remove(COLLECTIONS.STAFF, req.params.id)
    return response.success(res, { id: req.params.id })
  } catch (err) {
    next(err)
  }
}
