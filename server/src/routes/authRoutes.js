import express from 'express'
import { validate } from '../middleware/validate.js'
import { registerValidator, loginValidator } from '../validators/authValidators.js'
import { getCurrentUser, login, logout, register } from '../controllers/authController.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', validate(registerValidator), register)
router.post('/login', validate(loginValidator), login)
router.get('/getCurrentUser', verifyToken, getCurrentUser)
router.post('/logout', logout)

export default router
