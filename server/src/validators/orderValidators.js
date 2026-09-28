import { body, param } from 'express-validator'

export const ORDER_STATUSES = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']

const customerRules = [
  body('customer')
    .notEmpty().withMessage('Customer details are required')
    .isObject().withMessage('Customer must be an object'),

  body('customer.fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 80 }).withMessage('Full name must be 2–80 characters'),

  body('customer.email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail(),

  body('customer.phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Invalid phone number'),

  body('customer.address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5, max: 200 }).withMessage('Address must be 5–200 characters'),

  body('customer.city')
    .trim()
    .notEmpty().withMessage('City is required')
    .isLength({ min: 2, max: 60 }).withMessage('City must be 2–60 characters'),

  body('customer.postalCode')
    .trim()
    .notEmpty().withMessage('Postal code is required')
    .isLength({ min: 3, max: 12 }).withMessage('Postal code must be 3–12 characters'),
]

const orderIdParam = param('id')
  .isMongoId().withMessage('Invalid order ID')

export const createOrderValidator = [...customerRules]

export const orderIdValidator = [orderIdParam]

export const updateOrderStatusValidator = [
  orderIdParam,
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(ORDER_STATUSES).withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),
]
