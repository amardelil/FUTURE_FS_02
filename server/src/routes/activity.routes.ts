import { Router } from 'express'
import { activityQuerySchema, listActivities } from '../controllers/activity.controller.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const activityRoutes = Router()
activityRoutes.get('/', validate(activityQuerySchema, 'query'), asyncHandler(listActivities))
