import { Router } from 'express'
import { bulkDelete, bulkUpdateStatus, createLead, deleteLead, getLead, listLeads, updateLead } from '../controllers/lead.controller.js'
import { validate } from '../middleware/validate.js'
import { bulkDeleteSchema, bulkStatusSchema, leadBodySchema, leadQuerySchema } from '../schemas/lead.schema.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const leadRoutes = Router()
leadRoutes.get('/', validate(leadQuerySchema, 'query'), asyncHandler(listLeads))
leadRoutes.post('/', validate(leadBodySchema), asyncHandler(createLead))
leadRoutes.patch('/bulk/status', validate(bulkStatusSchema), asyncHandler(bulkUpdateStatus))
leadRoutes.delete('/bulk', validate(bulkDeleteSchema), asyncHandler(bulkDelete))
leadRoutes.get('/:id', asyncHandler(getLead))
leadRoutes.put('/:id', validate(leadBodySchema), asyncHandler(updateLead))
leadRoutes.delete('/:id', asyncHandler(deleteLead))
