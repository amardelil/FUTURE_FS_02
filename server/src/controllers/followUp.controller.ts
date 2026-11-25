import type { Request, Response } from 'express'
import { currentUserId } from '../middleware/auth.js'
import { FollowUp } from '../models/FollowUp.js'
import { Lead } from '../models/Lead.js'
import type { FollowUpBody, FollowUpQuery, FollowUpUpdate } from '../schemas/followUp.schema.js'
import { logActivity } from '../services/activity.js'
import { AppError } from '../utils/AppError.js'
import { oid } from '../utils/objectId.js'

export async function listFollowUps(req: Request, res: Response) {
  const owner = oid(currentUserId(req))
  const { status, leadId } = res.locals.query as FollowUpQuery
  const now = new Date()
  const byStatus = status === 'completed' ? { completed: true } : status === 'upcoming' ? { completed: false, scheduledAt: { $gte: now } } : status === 'overdue' ? { completed: false, scheduledAt: { $lt: now } } : {}
  const followUps = await FollowUp.find({ owner, ...(leadId ? { leadId: oid(leadId) } : {}), ...byStatus }).sort({ scheduledAt: 1 })
  res.json({ data: followUps })
}

export async function createFollowUp(req: Request, res: Response) {
  const owner = currentUserId(req)
  const body = req.body as FollowUpBody
  const lead = await Lead.findOne({ _id: body.leadId, owner: oid(owner) })
  if (!lead) throw new AppError(404, 'Lead not found.')

  const followUp = await FollowUp.create({ ...body, leadId: lead._id, owner: oid(owner) })
  await logActivity(owner, lead._id, 'followup_scheduled', `Follow-up scheduled with ${lead.name}`)
  res.status(201).json({ followUp })
}

export async function updateFollowUp(req: Request, res: Response) {
  const followUp = await FollowUp.findOneAndUpdate(
    { _id: req.params.id, owner: oid(currentUserId(req)) },
    req.body as FollowUpUpdate,
    { new: true, runValidators: true },
  )
  if (!followUp) throw new AppError(404, 'Follow-up not found.')
  res.json({ followUp })
}

export async function deleteFollowUp(req: Request, res: Response) {
  const removed = await FollowUp.findOneAndDelete({ _id: req.params.id, owner: oid(currentUserId(req)) })
  if (!removed) throw new AppError(404, 'Follow-up not found.')
  res.status(204).end()
}
