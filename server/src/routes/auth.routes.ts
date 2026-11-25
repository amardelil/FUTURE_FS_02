import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { login, me, register } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { loginSchema, registerSchema } from '../schemas/auth.schema.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Try again in a few minutes.' },
})

export const authRoutes = Router()

authRoutes.post('/register', authLimiter, validate(registerSchema), asyncHandler(register))
authRoutes.post('/login', authLimiter, validate(loginSchema), asyncHandler(login))
authRoutes.get('/me', requireAuth, asyncHandler(me))
