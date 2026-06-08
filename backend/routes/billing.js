import { Router } from 'express'
import * as billingController from '../controllers/billingController.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyToken, billingController.listBilling)
router.get('/:id', verifyToken, billingController.getBillingRecord)
router.post('/', verifyToken, requireRole('admin', 'manager'), billingController.createBillingRecord)
router.put('/:id', verifyToken, requireRole('admin', 'manager'), billingController.updateBillingRecord)
router.delete('/:id', verifyToken, requireRole('admin'), billingController.deleteBillingRecord)

export default router
