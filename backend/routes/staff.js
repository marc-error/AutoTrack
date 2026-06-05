import { Router } from 'express'
import * as staffController from '../controllers/staffController.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyToken, staffController.listStaff)
router.get('/:id', verifyToken, staffController.getStaff)
router.post('/', verifyToken, requireRole('admin'), staffController.createStaff)
router.put('/:id', verifyToken, requireRole('admin', 'manager'), staffController.updateStaff)
router.delete('/:id', verifyToken, requireRole('admin'), staffController.deleteStaff)

export default router
