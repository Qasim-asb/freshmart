import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { addToCartValidator, removeFromCartValidator, updateCartItemValidator } from '../validators/cartValidators.js'
import { addToCart, clearCart, getCartItems, removeFromCart, updateCartItem } from '../controllers/cartController.js'

const router = express.Router()

router.use(verifyToken)

router.route('/').post(validate(addToCartValidator), addToCart).get(getCartItems).delete(clearCart)

router.route('/:productId').put(validate(updateCartItemValidator), updateCartItem).delete(validate(removeFromCartValidator), removeFromCart)

export default router
