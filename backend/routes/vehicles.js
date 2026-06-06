import { Router } from 'express'
import * as vehicleController from '../controllers/vehicleController.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyToken, vehicleController.listVehicles)
router.get('/:id', verifyToken, vehicleController.getVehicle)
router.post('/', verifyToken, requireRole('admin', 'manager'), vehicleController.createVehicle)
router.put('/:id', verifyToken, requireRole('admin', 'manager'), vehicleController.updateVehicle)
router.delete('/:id', verifyToken, requireRole('admin'), vehicleController.deleteVehicle)

export default router
