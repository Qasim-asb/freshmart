import { body } from 'express-validator'
import { Category } from '../models/Category.js'

const name = () =>
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters')
    .custom(async (value) => {
      const exists = await Category.findOne({ name: value })
      if (exists) throw new Error('Category name already exists')
      return true
    })

const description = () =>
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 5, max: 200 }).withMessage('Description must be 5–200 characters')

const icon = () =>
  body('icon')
    .trim()
    .notEmpty().withMessage('Icon is required')
    .isLength({ max: 100 }).withMessage('Icon must be at most 100 characters')

export const createCategoryValidator = [
  name(),
  description(),
  icon(),
]
