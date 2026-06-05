import { Router } from 'express'
import * as inventoryController from '../controllers/inventoryController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyToken, inventoryController.listInventory)
router.get('/:id', verifyToken, inventoryController.getInventoryItem)
router.post('/', verifyToken, inventoryController.createInventoryItem)
router.put('/:id', verifyToken, inventoryController.updateInventoryItem)
router.delete('/:id', verifyToken, inventoryController.deleteInventoryItem)

export default router
