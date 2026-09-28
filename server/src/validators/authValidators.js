import { body } from 'express-validator'

const emailRule = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Please provide a valid email')
  .normalizeEmail()

const passwordRule = body('password')
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters')

const nameRule = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ min: 2, max: 50 })
  .withMessage('Name must be between 2 and 50 characters')

export const registerValidator = [nameRule, emailRule, passwordRule]

export const loginValidator = [
  emailRule,
  body('password').notEmpty().withMessage('Password is required'),
]
