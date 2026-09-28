import express from 'express'
import { adminOnly, verifyToken } from '../middleware/auth.js'
import { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js'
import { validate } from '../middleware/validate.js'
import { createOrderValidator, orderIdValidator, updateOrderStatusValidator } from '../validators/orderValidators.js'

const router = express.Router()

router.use(verifyToken)

router.get('/admin', adminOnly, getAllOrders)

router.route('/').post(validate(createOrderValidator), createOrder).get(getMyOrders)

router.route('/:id').get(validate(orderIdValidator), getOrderById)

router.route('/:id/status').patch(adminOnly, validate(updateOrderStatusValidator), updateOrderStatus)

export default router
