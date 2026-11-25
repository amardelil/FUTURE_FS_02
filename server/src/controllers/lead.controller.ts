import type { Request, Response } from 'express'
import { currentUserId } from '../middleware/auth.js'
import { Activity } from '../models/Activity.js'
import { FollowUp } from '../models/FollowUp.js'
import { Lead } from '../models/Lead.js'
import type { BulkDeleteBody, BulkStatusBody, LeadBody, LeadQuery } from '../schemas/lead.schema.js'
import { logActivity, statusChangeEvent } from '../services/activity.js'
import { AppError } from '../utils/AppError.js'
import { escapeRegex, oid } from '../utils/objectId.js'

const notFound = () => new AppError(404, 'Lead not found.')

export async function listLeads(req: Request, res: Response) {
  const owner = oid(currentUserId(req))
  const { q, status, source, sort, order, page, limit } = res.locals.query as LeadQuery
  const rx = q ? new RegExp(escapeRegex(q), 'i') : null

  const filter = {
    owner,
    ...(status ? { status } : {}),
    ...(source ? { source } : {}),
    ...(rx ? { $or: [{ name: rx }, { email: rx }, { company: rx }] } : {}),
  }

  const [data, total] = await Promise.all([
    Lead.find(filter).sort({ [sort]: order === 'asc' ? 1 : -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
    Lead.countDocuments(filter),
  ])
  res.json({ data, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } })
}

export async function getLead(req: Request, res: Response) {
  const lead = await Lead.findOne({ _id: req.params.id, owner: oid(currentUserId(req)) })
  if (!lead) throw notFound()
  res.json({ lead })
}

export async function createLead(req: Request, res: Response) {
  const owner = currentUserId(req)
  const lead = await Lead.create({ ...(req.body as LeadBody), owner: oid(owner) })
  await logActivity(owner, lead._id, 'lead_created', `${lead.name} was added as a new lead`)
  res.status(201).json({ lead })
}

export async function updateLead(req: Request, res: Response) {
  const owner = currentUserId(req)
  const lead = await Lead.findOne({ _id: req.params.id, owner: oid(owner) })
  if (!lead) throw notFound()

  const previous = lead.status
  lead.set(req.body as LeadBody)
  await lead.save()

  const event = statusChangeEvent(lead, previous, lead.status)
  await logActivity(owner, lead._id, event.type, event.description)
  res.json({ lead })
}

async function removeLeads(owner: string, ids: string[]): Promise<number> {
  const owned = await Lead.find({ _id: { $in: ids }, owner: oid(owner) }).select('_id')
  const leadIds = owned.map((l) => l._id)
  if (leadIds.length === 0) return 0
  await Promise.all([
    FollowUp.deleteMany({ owner: oid(owner), leadId: { $in: leadIds } }),
    Activity.deleteMany({ owner: oid(owner), leadId: { $in: leadIds } }),
    Lead.deleteMany({ _id: { $in: leadIds } }),
  ])
  return leadIds.length
}

export async function deleteLead(req: Request, res: Response) {
  const count = await removeLeads(currentUserId(req), [String(req.params.id)])
  if (count === 0) throw notFound()
  res.status(204).end()
}

export async function bulkUpdateStatus(req: Request, res: Response) {
  const owner = currentUserId(req)
  const { ids, status } = req.body as BulkStatusBody
  const leads = await Lead.find({ _id: { $in: ids }, owner: oid(owner) })

  for (const lead of leads) {
    const previous = lead.status
    if (previous === status) continue
    lead.status = status
    await lead.save()
    const event = statusChangeEvent(lead, previous, status)
    await logActivity(owner, lead._id, event.type, event.description)
  }
  res.json({ updated: leads.length })
}

export async function bulkDelete(req: Request, res: Response) {
  const deleted = await removeLeads(currentUserId(req), (req.body as BulkDeleteBody).ids)
  res.json({ deleted })
}
