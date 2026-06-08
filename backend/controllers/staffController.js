import * as firebaseService from '../services/firebaseService.js'
import * as response from '../utils/response.js'
import { COLLECTIONS } from '../services/firebaseService.js'
import { adminAuth } from '../config/firebase.js'
import { FieldValue } from 'firebase-admin/firestore'
import crypto from 'crypto'

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

const generateTempPassword = () => {
  return 'At' + crypto.randomBytes(8).toString('hex') + '!'
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
    const { email, displayName, role, photoURL, age, sex, birthday, password } = req.body

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

    if (age !== undefined && age !== null && age !== '') {
      const ageNum = Number(age)
      if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
        return response.error(res, 'Age must be between 16 and 100', 400)
      }
    }

    if (sex !== undefined && sex !== null && sex !== '') {
      if (!['male', 'female'].includes(sex)) {
        return response.error(res, 'Sex must be male or female', 400)
      }
    }

    const normalizedEmail = email.toLowerCase().trim()
    const tempPassword = password && password.trim() ? password.trim() : generateTempPassword()

    let authUser
    try {
      authUser = await adminAuth.createUser({
        email: normalizedEmail,
        displayName: sanitizeString(displayName.trim()),
        password: tempPassword,
        emailVerified: false,
        disabled: false
      })
    } catch (authErr) {
      if (authErr.code === 'auth/email-already-exists') {
        return response.error(res, 'A user with this email already exists in Firebase Authentication.', 409)
      }
      throw authErr
    }

    const docId = authUser.uid
    const data = {
      email: normalizedEmail,
      displayName: sanitizeString(displayName.trim()),
      role: role || 'staff',
      age: age ? Number(age) : null,
      sex: sex || null,
      birthday: birthday || null,
      photoURL: photoURL || null,
      isActive: true,
      firebaseUid: authUser.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }

    const created = await firebaseService.create(COLLECTIONS.STAFF, docId, data)

    const isCustomPassword = password && password.trim()
    return response.success(res, { ...created, ...(isCustomPassword ? {} : { tempPassword }) }, 201)
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

    const { email, displayName, role, photoURL, isActive, age, sex, birthday } = req.body
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

    if (age !== undefined) {
      if (age === null || age === '') {
        updates.age = null
      } else {
        const ageNum = Number(age)
        if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
          return response.error(res, 'Age must be between 16 and 100', 400)
        }
        updates.age = ageNum
      }
    }

    if (sex !== undefined) {
      if (sex === null || sex === '') {
        updates.sex = null
      } else {
        if (!['male', 'female'].includes(sex)) {
          return response.error(res, 'Sex must be male or female', 400)
        }
        updates.sex = sex
      }
    }

    if (birthday !== undefined) {
      updates.birthday = birthday || null
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

    if (existing.firebaseUid) {
      try {
        await adminAuth.deleteUser(existing.firebaseUid)
      } catch (authErr) {
        if (authErr.code !== 'auth/user-not-found') {
          throw authErr
        }
      }
    }

    await firebaseService.remove(COLLECTIONS.STAFF, req.params.id)
    return response.success(res, { id: req.params.id })
  } catch (err) {
    next(err)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const existing = await firebaseService.getById(COLLECTIONS.STAFF, req.params.id)
    if (!existing) {
      return response.error(res, 'Staff not found', 404)
    }

    if (!existing.firebaseUid) {
      return response.error(res, 'Firebase user not found', 404)
    }

    const tempPassword = generateTempPassword()
    await adminAuth.updateUser(existing.firebaseUid, {
      password: tempPassword
    })

    return response.success(res, { tempPassword })
  } catch (err) {
    next(err)
  }
}

export const updateEmail = async (req, res, next) => {
  try {
    const { newEmail } = req.body

    if (!newEmail || !EMAIL_REGEX.test(newEmail)) {
      return response.error(res, 'Invalid email format', 400)
    }

    const existing = await firebaseService.getById(COLLECTIONS.STAFF, req.params.id)
    if (!existing) {
      return response.error(res, 'Staff not found', 404)
    }

    if (!existing.firebaseUid) {
      return response.error(res, 'Firebase user not found', 404)
    }

    const normalizedEmail = newEmail.toLowerCase().trim()

    // Check if new email already exists
    try {
      await adminAuth.getUserByEmail(normalizedEmail)
      return response.error(res, 'Email already in use', 409)
    } catch (err) {
      if (err.code !== 'auth/user-not-found') {
        throw err
      }
    }

    // Update Firebase Auth email
    await adminAuth.updateUser(existing.firebaseUid, {
      email: normalizedEmail
    })

    // Update Firestore document
    const updates = {
      email: normalizedEmail,
      updatedAt: FieldValue.serverTimestamp()
    }

    await firebaseService.update(COLLECTIONS.STAFF, req.params.id, updates)

    return response.success(res, { ...updates, id: req.params.id })
  } catch (err) {
    next(err)
  }
}
