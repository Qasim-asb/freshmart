import express from 'express'
import { adminOnly, verifyToken } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createCategoryValidator } from '../validators/categoryValidators.js'
import { createCategory, getCategories } from '../controllers/categoryController.js'

const router = express.Router()

router.route('/').post(verifyToken, adminOnly, validate(createCategoryValidator), createCategory).get(getCategories)

export default router
