import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import { clearFavorites, getFavorites, toggleFavorite } from '../controllers/favoriteController.js'
import { validate } from '../middleware/validate.js'
import { toggleFavoriteValidator } from '../validators/favoriteValidators.js'

const router = express.Router()

router.use(verifyToken)

router.route('/').get(getFavorites).delete(clearFavorites)

router.route('/:productId').post(validate(toggleFavoriteValidator), toggleFavorite)

export default router
