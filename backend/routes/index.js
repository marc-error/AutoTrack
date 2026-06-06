import { Router } from 'express'
import staffRoutes from './staff.js'
import inventoryRoutes from './inventory.js'
import vehicleRoutes from './vehicles.js'
import billingRoutes from './billing.js'

const router = Router()

router.get('/health', (req, res) => {
  const mem = process.memoryUsage()
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    memory: {
      rss: `${(mem.rss / 1024 / 1024).toFixed(1)} MB`,
      heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB`,
      heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(1)} MB`
    }
  })
})

router.use('/staff', staffRoutes)
router.use('/inventory', inventoryRoutes)
router.use('/vehicles', vehicleRoutes)
router.use('/billing', billingRoutes)

export default router
