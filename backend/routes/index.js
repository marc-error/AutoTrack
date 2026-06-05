import { Router } from 'express'
import staffRoutes from './staff.js'
import inventoryRoutes from './inventory.js'
import vehicleRoutes from './vehicles.js'
import billingRoutes from './billing.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

router.use('/staff', staffRoutes)
router.use('/inventory', inventoryRoutes)
router.use('/vehicles', vehicleRoutes)
router.use('/billing', billingRoutes)

export default router
