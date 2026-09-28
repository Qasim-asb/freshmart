import jwt from 'jsonwebtoken'
import env from '../config/env.js'
import { ErrorHandler } from './errorHandler.js'
import { User } from '../models/User.js'

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies[env.cookie.name]
    if (!token) return next(new ErrorHandler(401, 'Unauthorized'))
    const decoded = jwt.verify(token, env.jwtSecret)
    const user = await User.findById(decoded.id)
    if (!user) return next(new ErrorHandler(401, 'User not found'))
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return next(new ErrorHandler(403, 'Admin only'))
  next()
}
