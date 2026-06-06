import { Router } from 'express'
import * as staffController from '../controllers/staffController.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyToken, requireRole('admin'), staffController.listStaff)
router.get('/:id', verifyToken, staffController.getStaff)
router.post('/', verifyToken, requireRole('admin'), staffController.createStaff)
router.put('/:id', verifyToken, requireRole('admin', 'manager'), staffController.updateStaff)
router.post('/:id/reset-password', verifyToken, requireRole('admin'), staffController.resetPassword)
router.post('/:id/update-email', verifyToken, requireRole('admin'), staffController.updateEmail)
router.delete('/:id', verifyToken, requireRole('admin'), staffController.deleteStaff)

export default router
