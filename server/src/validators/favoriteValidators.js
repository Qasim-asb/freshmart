import { param } from 'express-validator'

const productIdParam = param('productId')
  .isMongoId().withMessage('Invalid product ID')

export const toggleFavoriteValidator = [productIdParam]
