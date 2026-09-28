import { body, param } from 'express-validator'

const productIdBody = body('productId')
  .notEmpty().withMessage('Product ID is required')
  .isMongoId().withMessage('Invalid product ID')

const productIdParam = param('productId')
  .isMongoId().withMessage('Invalid product ID')

const quantityAdd = body('quantity')
  .optional()
  .isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
  .toInt()

const quantityUpdate = body('quantity')
  .notEmpty().withMessage('Quantity is required')
  .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
  .toInt()

export const addToCartValidator = [productIdBody, quantityAdd]

export const updateCartItemValidator = [productIdParam, quantityUpdate]

export const removeFromCartValidator = [productIdParam]
