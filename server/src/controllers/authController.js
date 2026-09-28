import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { ErrorHandler } from '../middleware/errorHandler.js'
import env from '../config/env.js'

const sendAuthResponse = (user, res, statusCode, message) => {
  const token = jwt.sign({ id: user._id }, env.jwtSecret, { expiresIn: '7d' })

  res.status(statusCode).cookie(env.cookie.name, token, {
    httpOnly: env.cookie.httpOnly,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    maxAge: env.cookie.maxAge,
    path: env.cookie.path
  }).json({ success: true, message, user })
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) return next(new ErrorHandler(409, 'User already exists'))

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })

    const { password: _, ...userData } = user.toObject()
    sendAuthResponse(userData, res, 201, 'Registered successfully')
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) return next(new ErrorHandler(401, 'Invalid credentials'))

    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) return next(new ErrorHandler(401, 'Invalid credentials'))

    const { password: _, ...userData } = user.toObject()
    sendAuthResponse(userData, res, 200, 'Logged in successfully')
  } catch (error) {
    next(error)
  }
}

export const getCurrentUser = (req, res) => {
  res.status(200).json({ success: true, user: req.user })
}

export const logout = (req, res) => {
  res.status(200).clearCookie(env.cookie.name, {
    httpOnly: env.cookie.httpOnly,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    path: env.cookie.path
  }).json({ success: true, message: 'Logged out' })
}
