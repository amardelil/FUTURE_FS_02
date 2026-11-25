import { Router } from 'express'
import { createFollowUp, deleteFollowUp, listFollowUps, updateFollowUp } from '../controllers/followUp.controller.js'
import { validate } from '../middleware/validate.js'
import { followUpBodySchema, followUpQuerySchema, followUpUpdateSchema } from '../schemas/followUp.schema.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const followUpRoutes = Router()
followUpRoutes.get('/', validate(followUpQuerySchema, 'query'), asyncHandler(listFollowUps))
followUpRoutes.post('/', validate(followUpBodySchema), asyncHandler(createFollowUp))
followUpRoutes.patch('/:id', validate(followUpUpdateSchema), asyncHandler(updateFollowUp))
followUpRoutes.delete('/:id', asyncHandler(deleteFollowUp))
