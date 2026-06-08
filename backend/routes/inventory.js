import { Router } from 'express'
import * as inventoryController from '../controllers/inventoryController.js'
import { verifyToken, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyToken, inventoryController.listInventory)
router.get('/:id', verifyToken, inventoryController.getInventoryItem)
router.post('/', verifyToken, requireRole('admin', 'manager'), inventoryController.createInventoryItem)
router.put('/:id', verifyToken, requireRole('admin', 'manager'), inventoryController.updateInventoryItem)
router.delete('/:id', verifyToken, requireRole('admin'), inventoryController.deleteInventoryItem)

export default router
