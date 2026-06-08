import { Router } from 'express'
import * as staffController from '../controllers/staffController.js'
import { verifyToken, requireRole } from '../middleware/auth.js'
import rateLimit from 'express-rate-limit'

const router = Router()

const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests for this operation' }
})

router.get('/', verifyToken, requireRole('admin'), staffController.listStaff)
router.get('/:id', verifyToken, staffController.getStaff)
router.post('/', verifyToken, requireRole('admin'), sensitiveLimiter, staffController.createStaff)
router.put('/:id', verifyToken, requireRole('admin', 'manager'), staffController.updateStaff)
router.post('/:id/reset-password', verifyToken, requireRole('admin'), sensitiveLimiter, staffController.resetPassword)
router.post('/:id/update-email', verifyToken, requireRole('admin'), sensitiveLimiter, staffController.updateEmail)
router.delete('/:id', verifyToken, requireRole('admin'), staffController.deleteStaff)

export default router
