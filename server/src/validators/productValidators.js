import { body, param } from 'express-validator'

const name = (optional = false) => {
  const chain = body('name').trim()
  if (optional) chain.optional()
  return chain
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters')
}

const category = (optional = false) => {
  const chain = body('category').trim()
  if (optional) chain.optional()
  return chain
    .notEmpty().withMessage('Category is required')
    .isLength({ min: 2, max: 50 }).withMessage('Category must be 2–50 characters')
}

const price = (optional = false) => {
  const chain = body('price')
  if (optional) chain.optional()
  return chain
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number')
    .toFloat()
}

const oldPrice = (optional = true) => {
  const chain = body('oldPrice')
  if (optional) chain.optional()
  return chain
    .isFloat({ min: 0 }).withMessage('Old price must be a positive number')
    .toFloat()
}

const unitValue = (optional = false) => {
  const chain = body('unitValue')
  if (optional) chain.optional()
  return chain
    .notEmpty().withMessage('Unit value is required')
    .isFloat({ gt: 0 }).withMessage('Unit value must be greater than 0')
    .toFloat()
}

const unit = (optional = false) => {
  const chain = body('unit').trim()
  if (optional) chain.optional()
  return chain
    .notEmpty().withMessage('Unit is required')
    .isLength({ min: 1, max: 20 }).withMessage('Unit must be 1–20 characters')
    .isIn(['kg', 'g', 'l', 'ml', 'piece', 'pack']).withMessage('Invalid unit')
}

const stock = (optional = true) => {
  const chain = body('stock')
  if (optional) chain.optional()
  return chain
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
    .toInt()
}

const requireImage = body().custom((_, { req }) => {
  if (!req.file) throw new Error('Image is required')
  return true
})

const mongoIdParam = param('id')
  .isMongoId().withMessage('Invalid product id')


export const createProductValidator = [
  name(),
  category(),
  price(),
  oldPrice(),
  unitValue(),
  unit(),
  stock(),
  requireImage,
]

export const updateProductValidator = [
  mongoIdParam,
  name(true),
  category(true),
  price(true),
  oldPrice(true),
  unitValue(true),
  unit(true),
  stock(true),
]

export const productIdValidator = [mongoIdParam]
