import express from 'express'
import { adminOnly, verifyToken } from '../middleware/auth.js'
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController.js'
import upload from '../middleware/upload.js'
import { validate } from '../middleware/validate.js'
import { createProductValidator, updateProductValidator, productIdValidator } from '../validators/productValidators.js'

const router = express.Router()

router
  .route('/')
  .post(verifyToken, adminOnly, upload.single('image'), validate(createProductValidator), createProduct)
  .get(getProducts)

router
  .route('/:id')
  .get(validate(productIdValidator), getProductById)
  .put(verifyToken, adminOnly, upload.single('image'), validate(updateProductValidator), updateProduct)
  .delete(verifyToken, adminOnly, validate(productIdValidator), deleteProduct)

export default router
