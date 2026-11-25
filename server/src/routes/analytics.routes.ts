import { Router } from 'express'
import { summary } from '../controllers/analytics.controller.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const analyticsRoutes = Router()
analyticsRoutes.get('/summary', asyncHandler(summary))
