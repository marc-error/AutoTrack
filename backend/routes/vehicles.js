import { Router } from 'express'
import * as vehicleController from '../controllers/vehicleController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyToken, vehicleController.listVehicles)
router.get('/:id', verifyToken, vehicleController.getVehicle)
router.post('/', verifyToken, vehicleController.createVehicle)
router.put('/:id', verifyToken, vehicleController.updateVehicle)
router.delete('/:id', verifyToken, vehicleController.deleteVehicle)

export default router
