import { z } from 'zod'
import { PRIORITIES } from '../constants.js'
import { objectId } from './lead.schema.js'

export const followUpBodySchema = z.object({
  leadId: objectId,
  scheduledAt: z.coerce.date(),
  notes: z.string().trim().max(500).default(''),
  priority: z.enum(PRIORITIES).default('medium'),
})

export const followUpUpdateSchema = z.object({
  scheduledAt: z.coerce.date().optional(),
  notes: z.string().trim().max(500).optional(),
  priority: z.enum(PRIORITIES).optional(),
  completed: z.boolean().optional(),
})

export const followUpQuerySchema = z.object({
  status: z.enum(['upcoming', 'overdue', 'completed']).optional(),
  leadId: objectId.optional(),
})

export type FollowUpBody = z.infer<typeof followUpBodySchema>
export type FollowUpUpdate = z.infer<typeof followUpUpdateSchema>
export type FollowUpQuery = z.infer<typeof followUpQuerySchema>
