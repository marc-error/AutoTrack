import { Router } from 'express'
import * as billingController from '../controllers/billingController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyToken, billingController.listBilling)
router.get('/:id', verifyToken, billingController.getBillingRecord)
router.post('/', verifyToken, billingController.createBillingRecord)
router.put('/:id', verifyToken, billingController.updateBillingRecord)
router.delete('/:id', verifyToken, billingController.deleteBillingRecord)

export default router
