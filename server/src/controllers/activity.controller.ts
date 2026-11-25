import type { Request, Response } from 'express'
import { z } from 'zod'
import { currentUserId } from '../middleware/auth.js'
import { Activity } from '../models/Activity.js'
import { objectId } from '../schemas/lead.schema.js'
import { oid } from '../utils/objectId.js'

export const activityQuerySchema = z.object({
  leadId: objectId.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export async function listActivities(req: Request, res: Response) {
  const { leadId, limit } = res.locals.query as z.infer<typeof activityQuerySchema>
  const data = await Activity.find({ owner: oid(currentUserId(req)), ...(leadId ? { leadId: oid(leadId) } : {}) })
    .sort({ createdAt: -1 })
    .limit(limit)
  res.json({ data })
}
